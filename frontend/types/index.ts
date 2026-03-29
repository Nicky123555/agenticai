export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';
export type AgentName =
  | 'ARCHITECT'
  | 'ORCHESTRATOR'
  | 'AUDITOR'
  | 'RECOVERY'
  | 'ETHICS'
  | 'MOTIVATION';

export interface Task {
  id: string;
  name: string;
  assignee: string;
  avatar: string;
  avatarColor: 'cyan' | 'green' | 'yellow' | 'purple' | 'orange';
  status: TaskStatus;
  priority: TaskPriority;
  project: string;
  deps: string[];
  estimate?: string;
  score?: number;
}

export interface User {
  handle: string;
  name: string;
  avatar: string;
  avatarColor: 'cyan' | 'green' | 'yellow' | 'purple' | 'orange';
  xp: number;
  maxXp: number;
  badges: string[];
  tasksCompleted: number;
  avgScore: number;
}

export interface AuditLog {
  id: string;
  agent: AgentName;
  action: string;
  reason: string;
  timestamp: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  team: string[];
  deadline?: string;
  tasks: Task[];
  createdAt: string;
}

export interface AgentStatus {
  name: AgentName;
  active: boolean;
}

// API payloads
export interface CreateProjectPayload {
  name: string;
  description: string;
  team: string[];
  deadline?: string;
}

export interface SubmitTaskPayload {
  taskId: string;
}

export interface AssignTasksPayload {
  projectId: string;
}

export interface RecoverTaskPayload {
  taskId: string;
  reason: string;
}

// API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateProjectResponse {
  projectId: string;
  tasks: Task[];
  logs: AuditLog[];
}

export interface SubmitTaskResponse {
  score: number;
  xpAwarded: number;
  log: AuditLog;
  updatedUser: User;
}

export interface AssignTasksResponse {
  assignments: { taskId: string; assignee: string }[];
  logs: AuditLog[];
}
