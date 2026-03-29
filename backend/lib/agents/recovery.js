// ============================================================
// lib/agents/recovery.js
// Wraps the Recovery Agent logic
// ============================================================

const { callAgent } = require('../gemini');

/**
 * Determines a recovery action for a failed or overdue task.
 * @param {string} reason - "DEADLINE_MISSED" or "LOW_SCORE_DETECTED"
 * @param {object} task - The task data
 * @param {object} currentAssignee - User currently assigned
 * @param {Array} availableUsers - Other users who could take over
 * @returns {Promise<object>} - Recommended action (reassign, extend, etc.)
 */
async function handleFailure(reason, task, currentAssignee, availableUsers) {
  return await callAgent(
    'recovery', 
    reason, 
    { task, currentAssignee, availableUsers }
  );
}

module.exports = { handleFailure };