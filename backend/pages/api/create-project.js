// ============================================================
// pages/api/create-project.js
// EVENT: NEW_PROJECT_CREATED
// AGENTS TRIGGERED: Architect Agent
// ============================================================

import { decomposeProject } from "../../lib/agents/architect.js";
import { createProject, saveTasks, writeAuditLog, db } from "../../lib/firestore.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { name, description, teamMembers, deadline } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: "Missing required fields: name, description" });
    }

    console.log(`🚀 NEW_PROJECT_CREATED event triggered for: "${name}"`);

    const projectId = await createProject({
      name,
      description,
      teamMembers: teamMembers || [],
      deadline: deadline || null,
      tasksGenerated: false,
    });

    // --- TESTING HACK: Assign all seeded users to this new project ---
    const usersSnapshot = await db.collection("users").get();
    const batch = db.batch();
    usersSnapshot.forEach(doc => {
      batch.update(doc.ref, { projectId: projectId });
    });
    await batch.commit();
    console.log(`🔗 Linked all seeded users to new project: ${projectId}`);
    // -----------------------------------------------------------------

    console.log(`💾 Project saved with ID: ${projectId}`);

    const teamSize = teamMembers?.length || 1;
    const projectDeadline = deadline || "not specified";
    
    const architectResult = await decomposeProject(name, description, teamSize, projectDeadline);

    if (!architectResult.success) {
      return res.status(500).json({
        error: "Architect Agent failed to generate tasks",
        details: architectResult.error
      });
    }

    const tasks = architectResult.data;
    console.log(`🏗️ Architect Agent generated ${tasks.length} tasks`);

    const tasksWithProjectId = tasks.map((task, index) => ({
      ...task,
      id: task.id || `task_${projectId}_${index + 1}`,
      projectId,
    }));

    await saveTasks(projectId, tasksWithProjectId);

    await writeAuditLog({
      agent: "Architect Agent",
      action: `Generated ${tasks.length} tasks for project "${name}"`,
      reason: `User submitted project with description: "${description}". AI analyzed scope and complexity.`,
      projectId,
      metadata: { taskCount: tasks.length, taskTitles: tasks.map(t => t.title) }
    });

    return res.status(200).json({
      event: "NEW_PROJECT_CREATED",
      success: true,
      projectId,
      tasks: tasksWithProjectId,
      message: `Project created! Architect Agent generated ${tasks.length} tasks.`,
    });

  } catch (error) {
    console.error("❌ Error in create-project:", error);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
};