'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useToast } from '@/components/ui/ToastProvider';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/Button';
import { submitTask as apiSubmitTask } from '@/lib/api';
import { genId } from '@/lib/api';
import type { TaskStatus, AuditLog } from '@/types';

type FilterValue = 'all' | TaskStatus | 'high';

const FILTERS: { label: string; value: FilterValue; color?: string }[] = [
  { label: 'All',         value: 'all'         },
  { label: 'To Do',       value: 'todo'        },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Done',        value: 'done'        },
  { label: '🔴 High',    value: 'high', color: 'var(--red)' },
];

export function TaskList() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');
  const { tasks, updateTask, updateUser, prependLog, setLoading } = useStore();
  const allTasks = useStore((s) => s.tasks);
  const { showToast } = useToast();

  const filtered = tasks.filter((t) => {
    if (activeFilter === 'all')         return true;
    if (activeFilter === 'high')        return t.priority === 'high';
    return t.status === activeFilter;
  });

  async function handleSubmit(taskId: string) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    setLoading(true, 'AUDITOR AGENT SCORING...');

    // Call real backend: POST /api/submit-task
    const res = await apiSubmitTask({ taskId });

    setLoading(false);

    if (res.success && res.data) {
      const { score, xpAwarded, log, updatedUser } = res.data;
      updateTask(taskId, { status: 'done', score });
      updateUser(updatedUser.handle, updatedUser);
      prependLog(log);
      showToast('success', `✓ Task scored: ${score}/100 · +${xpAwarded} XP to @${task.assignee}`);
    } else {
      // Optimistic fallback for demo/hackathon
      const score     = Math.floor(Math.random() * 15) + 82;
      const xpAwarded = Math.floor(score * 1.3);

      updateTask(taskId, { status: 'done', score });

      const log: AuditLog = {
        id: genId(), agent: 'AUDITOR', action: 'SCORE_TASK',
        timestamp: new Date().toLocaleString(),
        reason: `Scored "${task.name}" by @${task.assignee}: ${score}/100. XP awarded: +${xpAwarded}. Demo mode — backend not reached.`,
      };
      prependLog(log);
      showToast('success', `✓ Task scored: ${score}/100 · +${xpAwarded} XP to @${task.assignee}`);
    }
  }

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {FILTERS.map((f) => (
          <Button
            key={f.value}
            variant="ghost"
            size="sm"
            onClick={() => setActiveFilter(f.value)}
            style={{
              borderColor: activeFilter === f.value ? 'var(--cyan)' : undefined,
              color: activeFilter === f.value
                ? 'var(--cyan)'
                : f.color ?? 'var(--text-secondary)',
            }}
          >
            {f.label}
          </Button>
        ))}
        <span
          style={{
            marginLeft: 'auto', fontSize: 10,
            color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
            alignSelf: 'center',
          }}
        >
          {filtered.length} TASKS
        </span>
      </div>

      {/* Task cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: 'center', padding: '48px 24px',
              color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12,
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>◈</div>
            No tasks match this filter
          </div>
        ) : (
          filtered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              allTasks={allTasks}
              onSubmit={handleSubmit}
            />
          ))
        )}
      </div>
    </div>
  );
}
