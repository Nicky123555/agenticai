import type {
  ApiResponse,
  CreateProjectPayload,
  CreateProjectResponse,
  SubmitTaskPayload,
  SubmitTaskResponse,
  AssignTasksPayload,
  AssignTasksResponse,
  RecoverTaskPayload,
  AuditLog,
} from '@/types';

const API_BASE = '/api';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error ?? `HTTP ${res.status}` };
    }
    return { success: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error';
    return { success: false, error: message };
  }
}

/** POST /api/create-project — Architect Agent breaks project into tasks */
export async function createProject(
  payload: CreateProjectPayload
): Promise<ApiResponse<CreateProjectResponse>> {
  return request<CreateProjectResponse>('/create-project', {
    method: 'POST',
    body: JSON.stringify({ project: payload }),
  });
}

/** POST /api/assign-tasks — Orchestrator Agent assigns tasks to users */
export async function assignTasks(
  payload: AssignTasksPayload
): Promise<ApiResponse<AssignTasksResponse>> {
  return request<AssignTasksResponse>('/assign-tasks', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** POST /api/submit-task — Auditor Agent scores submitted work */
export async function submitTask(
  payload: SubmitTaskPayload
): Promise<ApiResponse<SubmitTaskResponse>> {
  return request<SubmitTaskResponse>('/submit-task', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** POST /api/recover-task — Recovery Agent handles failures & reassignment */
export async function recoverTask(
  payload: RecoverTaskPayload
): Promise<ApiResponse<{ log: AuditLog }>> {
  return request<{ log: AuditLog }>('/recover-task', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** Utility: generate a unique ID on the client side */
export function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
