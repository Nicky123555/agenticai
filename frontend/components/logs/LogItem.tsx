import type { AuditLog, AgentName } from '@/types';

interface LogItemProps {
  log: AuditLog;
}

const AGENT_STYLES: Record<AgentName, { nameColor: string; tagBg: string; tagColor: string; tagBorder: string }> = {
  ARCHITECT:    { nameColor: 'var(--cyan)',   tagBg: 'var(--cyan-glow)',                    tagColor: 'var(--cyan)',   tagBorder: 'rgba(0,212,255,0.3)'   },
  ORCHESTRATOR: { nameColor: 'var(--purple)', tagBg: 'rgba(168,85,247,0.12)',               tagColor: 'var(--purple)', tagBorder: 'rgba(168,85,247,0.3)'  },
  AUDITOR:      { nameColor: 'var(--yellow)', tagBg: 'var(--yellow-glow)',                  tagColor: 'var(--yellow)', tagBorder: 'rgba(255,204,0,0.3)'   },
  RECOVERY:     { nameColor: 'var(--red)',    tagBg: 'var(--red-glow)',                     tagColor: 'var(--red)',    tagBorder: 'rgba(255,68,102,0.3)'   },
  ETHICS:       { nameColor: 'var(--green)',  tagBg: 'var(--green-glow)',                   tagColor: 'var(--green)',  tagBorder: 'rgba(0,255,136,0.3)'   },
  MOTIVATION:   { nameColor: 'var(--orange)', tagBg: 'rgba(249,115,22,0.12)',               tagColor: 'var(--orange)', tagBorder: 'rgba(249,115,22,0.3)'  },
};

export function LogItem({ log }: LogItemProps) {
  const s = AGENT_STYLES[log.agent] ?? AGENT_STYLES.ARCHITECT;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '180px 160px 1fr',
        gap: 16, padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = 'var(--bg-card-hover)')
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = 'transparent')
      }
    >
      {/* Timestamp */}
      <div
        style={{
          fontSize: 10, color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)', paddingTop: 2,
        }}
      >
        {log.timestamp}
      </div>

      {/* Agent + Action */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div
          style={{
            fontSize: 11, fontFamily: 'var(--font-mono)',
            fontWeight: 700, color: s.nameColor,
          }}
        >
          {log.agent}
        </div>
        <span
          style={{
            fontSize: 9, fontFamily: 'var(--font-mono)',
            padding: '2px 7px', borderRadius: 3,
            display: 'inline-block', letterSpacing: 1,
            background: s.tagBg, color: s.tagColor,
            border: `1px solid ${s.tagBorder}`,
          }}
        >
          {log.action}
        </span>
      </div>

      {/* Reason / Decision Rationale */}
      <div
        style={{
          fontSize: 12, color: 'var(--text-secondary)',
          fontFamily: 'var(--font-ui)', lineHeight: 1.7,
        }}
      >
        {log.reason}
      </div>
    </div>
  );
}
