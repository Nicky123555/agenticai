const { evaluateSubmission } = require("../../lib/agents/auditor");
const { calculateRewards } = require("../../lib/agents/motivation");
const { getTask, getUser, updateTask, updateUser, writeAuditLog } = require("../../lib/firestore");

const PASS_THRESHOLD = 60;

// CHANGED: Use module.exports for CommonJS compatibility
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { taskId, userId, submissionText, completedAt } = req.body;

    if (!taskId || !userId || !submissionText) {
      return res.status(400).json({ error: "Missing required fields: taskId, userId, submissionText" });
    }

    console.log(`📤 TASK_SUBMITTED event: task=${taskId}, user=${userId}`);

    const [task, user] = await Promise.all([
      getTask(taskId),
      getUser(userId)
    ]);

    if (!task) return res.status(404).json({ error: `Task ${taskId} not found` });
    if (!user) return res.status(404).json({ error: `User ${userId} not found` });

    const taskPayload = {
      id: task.id,
      title: task.title,
      description: task.description,
      estimatedHours: task.estimatedHours,
      priority: task.priority,
      deadline: task.deadline || "not set",
      assignedAt: task.assignedAt,
    };

    const submissionPayload = {
      submittedBy: userId,
      submissionText,
      completedAt: completedAt || new Date().toISOString(),
      isLate: task.deadline ? new Date() > new Date(task.deadline) : false,
    };

    const auditorResult = await evaluateSubmission(taskPayload, submissionPayload);

    if (!auditorResult.success) {
      return res.status(500).json({ error: "Auditor Agent failed", details: auditorResult.error });
    }

    const scoreData = auditorResult.data;
    const passed = scoreData.score >= PASS_THRESHOLD;

    await writeAuditLog({
      agent: "Quality Auditor Agent",
      action: `Task "${task.title}" scored ${scoreData.score}/100 (${passed ? "PASS" : "FAIL"})`,
      reason: scoreData.feedback,
      projectId: task.projectId,
      taskId,
      userId,
      metadata: { scoreData }
    });

    await updateTask(taskId, {
      status: passed ? "complete" : "failed",
      submittedAt: completedAt || new Date().toISOString(),
      score: scoreData.score,
      grade: scoreData.grade,
      feedback: scoreData.feedback,
    });

    let rewardData = null;
    if (passed) {
      const taskRewardPayload = { title: task.title, priority: task.priority, estimatedHours: task.estimatedHours };
      const performancePayload = {
        score: scoreData.score,
        grade: scoreData.grade,
        totalTasksCompleted: (user.tasksCompleted || 0) + 1,
        currentXP: user.xp || 0,
        currentBadges: user.badges || [],
      };

      const motivationResult = await calculateRewards(userId, user.name, taskRewardPayload, performancePayload);

      if (motivationResult.success) {
        rewardData = motivationResult.data;
        await updateUser(userId, {
          xp: (user.xp || 0) + rewardData.xpAwarded,
          badges: [...(user.badges || []), ...(rewardData.badges || [])],
          tasksCompleted: (user.tasksCompleted || 0) + 1,
          currentTaskCount: Math.max(0, (user.currentTaskCount || 1) - 1),
        });

        await writeAuditLog({
          agent: "Motivation Agent",
          action: `Awarded ${rewardData.xpAwarded} XP to ${user.name}`,
          reason: rewardData.message,
          projectId: task.projectId,
          taskId,
          userId,
          metadata: { rewardData }
        });
      }
    }

    if (!passed) {
      await writeAuditLog({
        agent: "System",
        action: `⚠️ Task "${task.title}" flagged for recovery`,
        reason: `Score ${scoreData.score} is below threshold.`,
        projectId: task.projectId,
        taskId,
        userId,
      });
    }

    return res.status(200).json({
      event: "TASK_SUBMITTED",
      success: true,
      passed,
      score: scoreData,
      rewards: rewardData,
      requiresRecovery: !passed,
    });

  } catch (error) {
    console.error("❌ Error in submit-task:", error);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
};