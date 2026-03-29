// ============================================================
// lib/agents/motivation.js
// Wraps the Motivation Agent logic
// ============================================================

import { callAgent } from '../gemini.js';

/**
 * Calculates XP and badges to award for a completed task.
 * @param {string} userId - ID of the user
 * @param {string} userName - Name of the user
 * @param {object} task - Details of the task
 * @param {object} performance - The score and history of the user
 * @returns {Promise<object>} - XP awarded, badges, and a message
 */
async function calculateRewards(userId, userName, task, performance) {
  return await callAgent(
    'motivation', 
    'TASK_COMPLETED', 
    { userId, userName, task, performance }
  );
}

export { calculateRewards };