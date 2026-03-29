// ============================================================
// lib/gemini.js
// Reusable Gemini API function for all AI agents
// ============================================================

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini with your API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("API KEY:", process.env.GEMINI_API_KEY);
// -------------------------------------------------------
// AGENT SYSTEM PROMPTS
// Each agent has a unique identity and job description
// -------------------------------------------------------
const AGENT_PROMPTS = {

  architect: `
You are the ARCHITECT AGENT in an Autonomous Multi-Agent Project Management System.
Your ONLY job is to break down a project description into clear, actionable tasks.

Rules:
- Each task must have: id, title, description, estimatedHours, requiredSkills (array), priority (high/medium/low)
- Tasks should be logical, non-overlapping, and completable by one person
- Return ONLY a valid JSON array. No explanation. No markdown.

Example output:
[
  {
    "id": "task_001",
    "title": "Design Database Schema",
    "description": "Create the Firestore collections and document structure",
    "estimatedHours": 3,
    "requiredSkills": ["database", "firebase"],
    "priority": "high"
  }
]
`,

  orchestrator: `
You are the ORCHESTRATOR AGENT in an Autonomous Multi-Agent Project Management System.
Your ONLY job is to assign tasks to users based on their skills and current workload.

Rules:
- Match task requiredSkills with user skills
- Prefer users with lower currentTaskCount (less busy)
- Return ONLY a valid JSON array of assignments. No explanation. No markdown.

Example output:
[
  {
    "taskId": "task_001",
    "assignedTo": "user_abc",
    "reason": "User has firebase and database skills, currently has 0 active tasks"
  }
]
`,

  auditor: `
You are the QUALITY AUDITOR AGENT in an Autonomous Multi-Agent Project Management System.
Your ONLY job is to evaluate submitted work and give a performance score.

Rules:
- Score from 0-100 based on: completeness, quality, timeliness
- Provide specific feedback for improvement
- Return ONLY valid JSON. No explanation. No markdown.

Example output:
{
  "score": 85,
  "grade": "B+",
  "feedback": "Task completed well but missing edge case handling.",
  "passThreshold": true
}
`,

  recovery: `
You are the RECOVERY AGENT in an Autonomous Multi-Agent Project Management System.
Your ONLY job is to handle failures: missed deadlines, blocked tasks, or poor scores.

Rules:
- Suggest: reassign, extend deadline, split task, or escalate
- Provide a clear recovery action plan
- Return ONLY valid JSON. No explanation. No markdown.

Example output:
{
  "action": "reassign",
  "newAssignee": "user_xyz",
  "reason": "Original assignee missed deadline 2 times. User xyz has capacity and matching skills.",
  "urgency": "high"
}
`,

  ethics: `
You are the ETHICS AGENT in an Autonomous Multi-Agent Project Management System.
Your ONLY job is to detect unfair workload distribution and bias in task assignments.

Rules:
- Check if any user has significantly more tasks than others
- Flag if a user consistently receives low-priority/boring tasks
- Return ONLY valid JSON. No explanation. No markdown.

Example output:
{
  "biasDetected": true,
  "issue": "User alice has 8 tasks while others average 2",
  "recommendation": "Redistribute 3 tasks from alice to other team members"
}
`,

  motivation: `
You are the MOTIVATION AGENT in an Autonomous Multi-Agent Project Management System.
Your ONLY job is to calculate rewards (XP, badges) for completed tasks.

Rules:
- Base XP on score and task difficulty
- Award badges for milestones (first task, 5 tasks, perfect score, etc.)
- Return ONLY valid JSON. No explanation. No markdown.

Example output:
{
  "xpAwarded": 150,
  "badges": ["first_task_complete", "speed_demon"],
  "message": "Great work! You earned the Speed Demon badge for finishing 2 hours early!"
}
`
};

// -------------------------------------------------------
// MAIN callAgent FUNCTION
// This is the core reusable function for ALL agents
// -------------------------------------------------------
/**
 * Calls the Gemini API as a specific AI agent
 * @param {string} agentType - One of: architect, orchestrator, auditor, recovery, ethics, motivation
 * @param {string} trigger - The event that triggered this agent (e.g. "NEW_PROJECT_CREATED")
 * @param {object} inputData - The data the agent needs to process
 * @returns {object} - Parsed JSON response from Gemini
 */
async function callAgent(agentType, trigger, inputData) {
  try {
    // Get the right system prompt for this agent
    const systemPrompt = AGENT_PROMPTS[agentType];
    if (!systemPrompt) {
      throw new Error(`Unknown agent type: ${agentType}`);
    }

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build the prompt in the structured format Gemini understands best
    const prompt = `
SYSTEM:
${systemPrompt}

USER:
Trigger = ${trigger}
Input = ${JSON.stringify(inputData, null, 2)}

IMPORTANT: Return ONLY valid JSON. Do not add any explanation, comments, or markdown code blocks.
`;

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    // Clean up the response (remove markdown code blocks if Gemini adds them)
    const cleanedText = rawText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Parse and return JSON
    const parsedResponse = JSON.parse(cleanedText);
    return { success: true, data: parsedResponse };

  } catch (error) {
    console.error(`[${agentType.toUpperCase()} AGENT ERROR]`, error.message);
    return {
      success: false,
      error: error.message,
      agentType,
      trigger
    };
  }
}

export { callAgent };