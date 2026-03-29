'use client';

import { Badge, DepChip } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import type { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  allTasks: Task[];
  onSubmit: (taskId: string) => void;
}

const PRIORITY_BORDER: Record<string, string> = {
  high:   'var(--red)',
  medium: 'var(--yellow)',
  low:    'var(--green)',
};

export function TaskCard({ task, allTasks, onSubmit }: TaskCardProps) {
  const statusLabel =
    task.status === 'in-progress' ? 'IN PROGRESS' : task.status.toUpperCase();

  const depTasks = (task.deps ?? [])
    .map((dId) => allTasks.find((t) => t.id === dId))
    .filter((t): t is Task => Boolean(t));

  return (
    <div
      className="animate-fadeInUp"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderLeft: `3px solid ${PRIORITY_BORDER[task.priority]}`,
        borderRadius: 8, padding: 16,
        display: 'grid', gridTemplateColumns: '1fr auto',
        gap: 12, alignItems: 'center',
        transition: 'all 0.2s',
      }}
    >
      {/* Left */}
      <div>
        <div
          style={{
            fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 600,
            color: 'var(--text-primary)', marginBottom: 8,
          }}
        >
          {task.name}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Assignee */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Avatar letter={task.avatar} color={task.avatarColor} size={20} />
            <span
              style={{
                fontSize: 10, color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              @{task.assignee}
            </span>
          </div>

          <Badge variant={task.priority}>{task.priority.toUpperCase()}</Badge>

          <span
            style={{
              fontSize: 9, color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {task.project}
          </span>

          {/* Dependencies */}
          {depTasks.map((dep) => (
            <DepChip key={dep.id}>
              #{dep.id} {dep.name.split(' ')[0]}
            </DepChip>
          ))}
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Badge variant={task.status}>{statusLabel}</Badge>

        {task.status !== 'done' ? (
          <Button variant="success" size="sm" onClick={() => onSubmit(task.id)}>
            ✓ Submit
          </Button>
        ) : (
          <span style={{ color: 'var(--green)', fontSize: 14 }}>✓</span>
        )}
      </div>
    </div>
  );
}
