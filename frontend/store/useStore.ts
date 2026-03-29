import { create } from 'zustand';
import type { Task, User, AuditLog, AgentStatus, AgentName } from '@/types';

interface AppState {
  // Data
  tasks: Task[];
  users: User[];
  logs: AuditLog[];
  agents: AgentStatus[];
  currentProjectId: string | null;

  // UI
  loading: boolean;
  loadingText: string;

  // Setters
  setTasks: (tasks: Task[]) => void;
  addTasks: (tasks: Task[]) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;

  setUsers: (users: User[]) => void;
  updateUser: (handle: string, patch: Partial<User>) => void;

  prependLog: (log: AuditLog) => void;
  setLogs: (logs: AuditLog[]) => void;

  setCurrentProjectId: (id: string | null) => void;
  setLoading: (loading: boolean, text?: string) => void;
  setAgentActive: (name: AgentName, active: boolean) => void;
  fetchTasks: () => Promise<void>;
}

// Keep only the agents UI data so the sidebar doesn't break
const seedAgents: AgentStatus[] = [
  { name: 'ARCHITECT',    active: true  },
  { name: 'ORCHESTRATOR', active: true  },
  { name: 'AUDITOR',      active: true  },
  { name: 'RECOVERY',     active: false },
  { name: 'ETHICS',       active: true  },
  { name: 'MOTIVATION',   active: true  },
];

// ─── Store ────────────────────────────────────────────────────
export const useStore = create<AppState>((set) => ({
  // Initialize these as empty arrays so the frontend waits for the backend
  tasks: [],
  users: [],
  logs: [],
  
  agents: seedAgents,
  currentProjectId: null,
  loading: false,
  loadingText: 'PROCESSING...',

  setTasks:  (tasks)  => set({ tasks }),
  addTasks:  (tasks)  => set((s) => ({ tasks: [...s.tasks, ...tasks] })),
  updateTask: (id, patch) =>
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),

  setUsers:   (users)  => set({ users }),
  updateUser: (handle, patch) =>
    set((s) => ({ users: s.users.map((u) => (u.handle === handle ? { ...u, ...patch } : u)) })),

  prependLog: (log)  => set((s) => ({ logs: [log, ...s.logs] })),
  setLogs:    (logs) => set({ logs }),

  setCurrentProjectId: (id) => set({ currentProjectId: id }),
  setLoading: (loading, text) =>
    set({ loading, loadingText: text ?? 'PROCESSING...' }),

  setAgentActive: (name, active) =>
    set((s) => ({
      agents: s.agents.map((a) => (a.name === name ? { ...a, active } : a)),
    })),

  // Fetch tasks from backend (if available) or fallback to existing local tasks.
  fetchTasks: async () => {
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) {
        console.warn('fetchTasks: /api/tasks returned non-OK status', res.status);
        return;
      }
      const tasks = await res.json();
      if (Array.isArray(tasks)) {
        set({ tasks });
      } else {
        console.warn('fetchTasks: invalid tasks payload', tasks);
      }
    } catch (error) {
      console.warn('fetchTasks: could not fetch tasks from backend', error);
    }
  },
}));