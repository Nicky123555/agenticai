// ============================================================
// lib/agents/architect.js
// Wraps the Architect Agent logic
// ============================================================

import { callAgent } from "../gemini.js";

async function decomposeProject(name, description, teamSize, deadline) {
  return await callAgent("architect", "NEW_PROJECT_CREATED", {
    projectName: name,
    projectDescription: description,
    teamSize,
    deadline
  });
}

export { decomposeProject };