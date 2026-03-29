// ============================================================
// pages/api/recover-task.js
// EVENT: DEADLINE_MISSED or LOW_SCORE
// AGENTS TRIGGERED: Recovery Agent
// ============================================================

import { handleFailure } from "../../lib/agents/recovery.js";
import {
  getTask,
  getUser,
  getProjectUsers,
  updateTask,
  writeAuditLog
} from "../../lib/firestore.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { taskId, reason } = req.body;
    // reason should be: "deadline_missed" or "low_score"

    if (!taskId) {
      return res.status(400).json({ error: "Missing required field: taskId" });
    }

    console.log(`🔁 RECOVERY triggered for task: ${taskId} | Reason: ${reason}`);

    // ── STEP 1: Fetch task and current assignee ──────────────
    const task = await getTask(taskId);

    if (!task) {
      return res.status(404).json({ error: `Task ${taskId} not found` });
    }

    const currentAssignee = task.assignedTo ? await getUser(task.assignedTo) : null;
    const allUsers = await getProjectUsers(task.projectId);

    // ── STEP 2: Call Recovery Agent ─────────────────────────
    const eventTrigger = reason === "deadline_missed" ? "DEADLINE_MISSED" : "LOW_SCORE_DETECTED";
    
    const taskPayload = {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      estimatedHours: task.estimatedHours,
      requiredSkills: task.requiredSkills,
      deadline: task.deadline || "not set",
      assignedAt: task.assignedAt,
      missedDeadlineCount: task.missedDeadlineCount || 0,
      score: task.score || null,
    };

    const assigneePayload = currentAssignee ? {
      id: currentAssignee.id,
      name: currentAssignee.name,
      currentTaskCount: currentAssignee.currentTaskCount || 0,
      tasksCompleted: currentAssignee.tasksCompleted || 0,
    } : null;

    const availableUsersPayload = allUsers
      .filter(u => u.id !== task.assignedTo)
      .map(u => ({
        id: u.id,
        name: u.name,
        skills: u.skills || [],
        currentTaskCount: u.currentTaskCount || 0,
      }));

    const recoveryResult = await handleFailure(
      eventTrigger,
      taskPayload,
      assigneePayload,
      availableUsersPayload
    );

    if (!recoveryResult.success) {
      return res.status(500).json({
        error: "Recovery Agent failed",
        details: recoveryResult.error
      });
    }

    const recovery = recoveryResult.data;
    console.log(`🔧 Recovery Agent recommends: ${recovery.action}`);

    // ── STEP 3: Execute the recovery action ─────────────────
    let updatePayload = {
      recoveryApplied: true,
      recoveryReason: reason,
      recoveryAction: recovery.action,
      missedDeadlineCount: (task.missedDeadlineCount || 0) + 1,
    };

    switch (recovery.action) {
      case "reassign":
        updatePayload.status = "assigned";
        updatePayload.assignedTo = recovery.newAssignee;
        updatePayload.assignedAt = new Date().toISOString();
        updatePayload.score = null;
        console.log(`🔄 Reassigning task to: ${recovery.newAssignee}`);
        break;

      case "extend_deadline":
        const newDeadline = new Date();
        newDeadline.setDate(newDeadline.getDate() + (recovery.extensionDays || 2));
        updatePayload.deadline = newDeadline.toISOString();
        updatePayload.status = "assigned";
        console.log(`⏰ Extending deadline by ${recovery.extensionDays || 2} days`);
        break;

      case "escalate":
        updatePayload.status = "escalated";
        updatePayload.escalatedAt = new Date().toISOString();
        console.log(`🚨 Task escalated for human review`);
        break;

      default:
        updatePayload.status = "needs_review";
        break;
    }

    await updateTask(taskId, updatePayload);

    // ── STEP 4: Write Audit Log ─────────────────────────────
    await writeAuditLog({
      agent: "Recovery Agent",
      action: `Recovery action "${recovery.action}" applied to task "${task.title}"`,
      reason: recovery.reason,
      projectId: task.projectId,
      taskId,
      userId: recovery.newAssignee || task.assignedTo || null,
      metadata: {
        recoveryData: recovery,
        triggerReason: reason,
        previousAssignee: task.assignedTo,
      }
    });

    // ── STEP 5: Return response ──────────────────────────────
    return res.status(200).json({
      event: eventTrigger,
      success: true,
      recovery,
      taskId,
      message: `Recovery Agent applied action: ${recovery.action}. ${recovery.reason}`,
    });

  } catch (error) {
    console.error("❌ Error in recover-task:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
};