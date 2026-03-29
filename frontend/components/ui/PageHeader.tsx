import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
  badgePulse?: boolean;
}

export function PageHeader({ title, subtitle, badge, badgePulse }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
              color: 'var(--text-primary)', letterSpacing: 1,
            }}
          >
            {title}
          </h1>
          <div
            style={{
              fontSize: 11, color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)', letterSpacing: 1, marginTop: 4,
            }}
          >
            {subtitle}
          </div>
        </div>
        {badge && (
          <span
            className={badgePulse ? 'animate-flicker' : ''}
            style={{
              fontSize: 10, fontFamily: 'var(--font-mono)',
              padding: '4px 10px', borderRadius: 4,
              border: '1px solid var(--border-glow)',
              color: 'var(--cyan)', background: 'var(--cyan-glow)',
              letterSpacing: 1,
            }}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
