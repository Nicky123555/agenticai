// ============================================================
// lib/agents/ethics.js
// Wraps the Ethics Agent logic
// ============================================================

const { callAgent } = require('../gemini');

/**
 * Checks pending task assignments for workload bias.
 * @param {Array} assignments - Proposed assignments from the Orchestrator
 * @param {Array} users - Current user workload stats
 * @returns {Promise<object>} - Bias detection report
 */
async function checkFairness(assignments, users) {
  return await callAgent(
    'ethics', 
    'PRE_ASSIGNMENT_CHECK', 
    { assignments, users }
  );
}

module.exports = { checkFairness };