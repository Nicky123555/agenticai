import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { LogFeed } from '@/components/logs/LogFeed';

export default function LogsPage() {
  return (
    <div>
      <PageHeader
        title="Audit Trail"
        subtitle="// ALL AI AGENT DECISIONS · TRANSPARENT & EXPLAINABLE"
        badge="🔴 LIVE"
        badgePulse
      />

      {/* Legend */}
      <div
        style={{
          display: 'flex', gap: 12, flexWrap: 'wrap',
          marginBottom: 20, padding: '10px 14px',
          background: 'var(--bg-panel)', border: '1px solid var(--border)',
          borderRadius: 8, fontSize: 10, fontFamily: 'var(--font-mono)',
        }}
      >
        {[
          { name: 'ARCHITECT',    color: 'var(--cyan)'   },
          { name: 'ORCHESTRATOR', color: 'var(--purple)' },
          { name: 'AUDITOR',      color: 'var(--yellow)' },
          { name: 'RECOVERY',     color: 'var(--red)'    },
          { name: 'ETHICS',       color: 'var(--green)'  },
          { name: 'MOTIVATION',   color: 'var(--orange)' },
        ].map((a) => (
          <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div
              style={{
                width: 8, height: 8, borderRadius: '50%',
                background: a.color, flexShrink: 0,
              }}
            />
            <span style={{ color: a.color }}>{a.name}</span>
          </div>
        ))}
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <LogFeed />
      </Card>
    </div>
  );
}
