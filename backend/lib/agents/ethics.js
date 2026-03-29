// ============================================================
// lib/agents/ethics.js
// Wraps the Ethics Agent logic
// ============================================================

import { callAgent } from '../gemini.js';

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

export { checkFairness };