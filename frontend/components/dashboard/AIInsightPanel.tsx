import React from 'react';
import type { AgentName } from '@/types';

interface AIInsightProps {
  agent: AgentName;
  children: React.ReactNode;
}

const AGENT_COLORS: Record<AgentName, { text: string; border: string; bg: string }> = {
  ARCHITECT:    { text: 'var(--cyan)',   border: 'rgba(0,212,255,0.2)',   bg: 'linear-gradient(135deg,rgba(0,212,255,0.05),rgba(168,85,247,0.05))' },
  ORCHESTRATOR: { text: 'var(--purple)', border: 'rgba(168,85,247,0.2)', bg: 'linear-gradient(135deg,rgba(168,85,247,0.05),rgba(0,212,255,0.03))'  },
  AUDITOR:      { text: 'var(--yellow)', border: 'rgba(255,204,0,0.2)',  bg: 'linear-gradient(135deg,rgba(255,204,0,0.04),rgba(0,212,255,0.02))'   },
  RECOVERY:     { text: 'var(--red)',    border: 'rgba(255,68,102,0.2)', bg: 'linear-gradient(135deg,rgba(255,68,102,0.05),rgba(255,204,0,0.02))'   },
  ETHICS:       { text: 'var(--green)',  border: 'rgba(0,255,136,0.2)',  bg: 'linear-gradient(135deg,rgba(0,255,136,0.04),rgba(0,212,255,0.02))'    },
  MOTIVATION:   { text: 'var(--orange)', border: 'rgba(249,115,22,0.2)', bg: 'linear-gradient(135deg,rgba(249,115,22,0.05),rgba(255,204,0,0.02))'  },
};

export function AIInsightPanel({ agent, children }: AIInsightProps) {
  const c = AGENT_COLORS[agent];
  return (
    <div
      style={{
        background: c.bg, border: `1px solid ${c.border}`,
        borderRadius: 10, padding: 16, marginBottom: 12,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* "AI DECISION" watermark */}
      <div
        style={{
          position: 'absolute', top: 10, right: 14,
          fontSize: 8, fontFamily: 'var(--font-mono)',
          color: c.text, letterSpacing: 2, opacity: 0.7,
        }}
      >
        AI DECISION
      </div>

      <div
        style={{
          fontSize: 11, fontFamily: 'var(--font-mono)',
          color: c.text, marginBottom: 6, letterSpacing: 1,
        }}
      >
        🤖 {agent} AGENT
      </div>
      <div
        style={{
          fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7,
        }}
      >
        {children}
      </div>
    </div>
  );
}
