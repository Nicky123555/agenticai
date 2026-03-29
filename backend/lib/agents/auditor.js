// ============================================================
// lib/agents/auditor.js
// Wraps the Quality Auditor Agent logic
// ============================================================

const { callAgent } = require('../gemini');

/**
 * Evaluates and scores a completed task.
 * @param {object} task - The original task data
 * @param {object} submission - The user's submission details
 * @returns {Promise<object>} - Score, grade, and feedback
 */
async function evaluateSubmission(task, submission) {
  return await callAgent(
    'auditor', 
    'TASK_SUBMITTED', 
    { task, submission }
  );
}

module.exports = { evaluateSubmission };