import { Badge, DepChip } from '@/components/ui/Badge';
import type { Task } from '@/types';

interface GeneratedTaskPreviewProps {
  tasks: Task[];
}

const PRIORITY_BORDER: Record<string, string> = {
  high:   'var(--red)',
  medium: 'var(--yellow)',
  low:    'var(--green)',
};

export function GeneratedTaskPreview({ tasks }: GeneratedTaskPreviewProps) {
  if (tasks.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center', padding: '48px 24px',
          color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12,
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>🤖</div>
        <div>Architect Agent output will appear here</div>
        <div style={{ marginTop: 6, color: 'var(--text-muted)', fontSize: 10 }}>
          Fill the form and launch the agent
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {tasks.map((task, i) => (
        <div
          key={task.id}
          className="animate-fadeInUp"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderLeft: `3px solid ${PRIORITY_BORDER[task.priority]}`,
            borderRadius: 8, padding: '12px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 12,
            animationDelay: `${i * 60}ms`,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 600,
                color: 'var(--text-primary)', marginBottom: 6,
              }}
            >
              #{i + 1} {task.name}
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
              <Badge variant={task.priority}>{task.priority.toUpperCase()}</Badge>
              {task.estimate && (
                <span
                  style={{
                    fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
                  }}
                >
                  est. {task.estimate}
                </span>
              )}
              {task.deps.length > 0 ? (
                <DepChip>deps: {task.deps.join(', ')}</DepChip>
              ) : (
                <span
                  style={{
                    fontSize: 9, color: 'var(--green)', fontFamily: 'var(--font-mono)',
                  }}
                >
                  no deps
                </span>
              )}
            </div>
          </div>
          <Badge variant="todo">TODO</Badge>
        </div>
      ))}
    </div>
  );
}
