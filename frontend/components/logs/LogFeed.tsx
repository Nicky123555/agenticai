'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { LogItem } from './LogItem';
import { Button } from '@/components/ui/Button';
import type { AgentName } from '@/types';

type FilterValue = 'all' | AgentName;

const AGENT_FILTERS: { label: string; value: FilterValue; color?: string }[] = [
  { label: 'All Agents',   value: 'all'          },
  { label: 'Architect',    value: 'ARCHITECT',    color: 'var(--cyan)'   },
  { label: 'Orchestrator', value: 'ORCHESTRATOR', color: 'var(--purple)' },
  { label: 'Auditor',      value: 'AUDITOR',      color: 'var(--yellow)' },
  { label: 'Recovery',     value: 'RECOVERY',     color: 'var(--red)'    },
  { label: 'Ethics',       value: 'ETHICS',       color: 'var(--green)'  },
  { label: 'Motivation',   value: 'MOTIVATION',   color: 'var(--orange)' },
];

export function LogFeed() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');
  const logs = useStore((s) => s.logs);

  const filtered = activeFilter === 'all'
    ? logs
    : logs.filter((l) => l.agent === activeFilter);

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {AGENT_FILTERS.map((f) => (
          <Button
            key={f.value}
            variant="ghost"
            size="sm"
            onClick={() => setActiveFilter(f.value)}
            style={{
              borderColor: activeFilter === f.value ? 'var(--cyan)' : undefined,
              color: activeFilter === f.value
                ? 'var(--cyan)'
                : (f.color ?? 'var(--text-secondary)'),
            }}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Table header */}
      <div
        style={{
          display: 'grid', gridTemplateColumns: '180px 160px 1fr', gap: 16,
          padding: '8px 16px', fontSize: 9, color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)', letterSpacing: 2,
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div>TIMESTAMP</div>
        <div>AGENT / ACTION</div>
        <div>DECISION RATIONALE</div>
      </div>

      {/* Log rows */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center', padding: '48px 24px',
            color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12,
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>◉</div>
          No logs for this agent
        </div>
      ) : (
        filtered.map((log) => <LogItem key={log.id} log={log} />)
      )}
    </div>
  );
}
