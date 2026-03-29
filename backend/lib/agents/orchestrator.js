// ============================================================
// lib/agents/orchestrator.js
// Wraps the Orchestrator Agent logic
// ============================================================

const { callAgent } = require('../gemini');

/**
 * Assigns unassigned tasks to available users based on skills and capacity.
 * @param {Array} tasks - Unassigned tasks
 * @param {Array} users - Available project users
 * @returns {Promise<object>} - Array of assignment mappings
 */
async function assignTasks(tasks, users) {
  return await callAgent(
    'orchestrator', 
    'TASKS_READY_FOR_ASSIGNMENT', 
    { tasks, users }
  );
}

module.exports = { assignTasks };