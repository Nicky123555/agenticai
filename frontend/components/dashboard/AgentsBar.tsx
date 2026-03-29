'use client';

import { useStore } from '@/store/useStore';
import type { AgentName } from '@/types';

const AGENT_COLORS: Record<AgentName, string> = {
  ARCHITECT:    'var(--cyan)',
  ORCHESTRATOR: 'var(--purple)',
  AUDITOR:      'var(--yellow)',
  RECOVERY:     'var(--red)',
  ETHICS:       'var(--green)',
  MOTIVATION:   'var(--orange)',
};

export function AgentsBar() {
  const agents = useStore((s) => s.agents);

  return (
    <div
      style={{
        display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24,
        padding: '12px 16px', background: 'var(--bg-panel)',
        border: '1px solid var(--border)', borderRadius: 8,
      }}
    >
      {agents.map((agent) => (
        <div
          key={agent.name}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 10, fontFamily: 'var(--font-mono)',
            padding: '6px 12px', borderRadius: 6,
            border: agent.active
              ? `1px solid ${AGENT_COLORS[agent.name]}33`
              : '1px solid var(--border)',
            color: agent.active ? AGENT_COLORS[agent.name] : 'var(--text-muted)',
          }}
        >
          <div
            style={{
              width: 6, height: 6, borderRadius: '50%',
              background: agent.active ? AGENT_COLORS[agent.name] : 'var(--text-muted)',
              animation: agent.active ? 'pulse-green 1.5s infinite' : 'none',
            }}
          />
          {agent.name}
        </div>
      ))}

      <style>{`
        @keyframes pulse-green {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
