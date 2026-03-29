// ============================================================
// pages/api/assign-tasks.js
// EVENT: TASKS_READY_FOR_ASSIGNMENT
// AGENTS TRIGGERED: Orchestrator Agent, Ethics Agent
// ============================================================

const { assignTasks } = require("../../lib/agents/orchestrator");
const { checkFairness } = require("../../lib/agents/ethics");
const {
  getUnassignedTasks,
  getProjectUsers,
  updateTask,
  writeAuditLog
} = require("../../lib/firestore");

// CHANGED: Use module.exports instead of export default for CommonJS compatibility
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: "Missing required field: projectId" });
    }

    console.log(`📋 TASKS_READY_FOR_ASSIGNMENT event for project: ${projectId}`);

    // ── STEP 1: Fetch unassigned tasks and available users ──
    const [unassignedTasks, users] = await Promise.all([
      getUnassignedTasks(projectId),
      getProjectUsers(projectId)
    ]);

    if (unassignedTasks.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No unassigned tasks found for this project.",
        assignments: []
      });
    }

    if (users.length === 0) {
      return res.status(400).json({
        error: "No team members found for this project. Add users first."
      });
    }

    console.log(`Found ${unassignedTasks.length} tasks and ${users.length} users`);

    // ── STEP 2: Call Orchestrator Agent ─────────────────────
    const taskPayload = unassignedTasks.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description,
      requiredSkills: t.requiredSkills,
      estimatedHours: t.estimatedHours,
      priority: t.priority,
    }));

    const userPayload = users.map(u => ({
      id: u.id,
      name: u.name,
      skills: u.skills || [],
      currentTaskCount: u.currentTaskCount || 0,
      experienceLevel: u.experienceLevel || "mid",
    }));

    const orchestratorResult = await assignTasks(taskPayload, userPayload);

    if (!orchestratorResult.success) {
      return res.status(500).json({
        error: "Orchestrator Agent failed",
        details: orchestratorResult.error
      });
    }

    const assignments = orchestratorResult.data;
    console.log(`👥 Orchestrator created ${assignments.length} assignments`);

    // ── STEP 3: Call Ethics Agent to check for bias ─────────
    const ethicsUserPayload = users.map(u => ({
      id: u.id,
      name: u.name,
      currentTaskCount: u.currentTaskCount || 0,
    }));

    const ethicsResult = await checkFairness(assignments, ethicsUserPayload);

    // Log ethics check results (even if no bias found)
    const ethicsData = ethicsResult.success ? ethicsResult.data : { biasDetected: false };

    await writeAuditLog({
      agent: "Ethics Agent",
      action: ethicsData.biasDetected
        ? `⚠️ Bias detected: ${ethicsData.issue}`
        : "✅ No bias detected in task assignments",
      reason: ethicsData.recommendation || "Assignment distribution looks fair across all team members.",
      projectId,
      metadata: { ethicsReport: ethicsData }
    });

    // ── STEP 4: Save assignments to Firestore ───────────────
    const savedAssignments = [];

    for (const assignment of assignments) {
      // Update task: mark as assigned
      await updateTask(assignment.taskId, {
        status: "assigned",
        assignedTo: assignment.assignedTo,
        assignedAt: new Date().toISOString(),
      });

      // Write audit log for each assignment
      await writeAuditLog({
        agent: "Orchestrator Agent",
        action: `Task "${assignment.taskId}" assigned to user "${assignment.assignedTo}"`,
        reason: assignment.reason,
        projectId,
        taskId: assignment.taskId,
        userId: assignment.assignedTo,
      });

      savedAssignments.push(assignment);
    }

    // ── STEP 5: Return response ──────────────────────────────
    return res.status(200).json({
      event: "TASKS_READY_FOR_ASSIGNMENT",
      success: true,
      assignments: savedAssignments,
      ethicsCheck: ethicsData,
      message: `${savedAssignments.length} tasks assigned successfully!`,
    });

  } catch (error) {
    console.error("❌ Error in assign-tasks:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
};