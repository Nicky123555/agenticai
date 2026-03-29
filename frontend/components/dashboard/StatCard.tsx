import React from 'react';

type StatColor = 'cyan' | 'green' | 'yellow' | 'red' | 'purple';

interface StatCardProps {
  label: string;
  value: string | number;
  desc: string;
  icon: string;
  color: StatColor;
}

const COLOR_MAP: Record<StatColor, string> = {
  cyan:   'var(--cyan)',
  green:  'var(--green)',
  yellow: 'var(--yellow)',
  red:    'var(--red)',
  purple: 'var(--purple)',
};

export function StatCard({ label, value, desc, icon, color }: StatCardProps) {
  return (
    <div
      style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 10, padding: 20, position: 'relative', overflow: 'hidden',
        transition: 'all 0.25s',
        borderLeft: `3px solid ${COLOR_MAP[color]}`,
      }}
    >
      <div
        style={{
          fontSize: 10, color: 'var(--text-secondary)',
          fontFamily: 'var(--font-mono)', letterSpacing: 2,
          textTransform: 'uppercase', marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800,
          lineHeight: 1, marginBottom: 6, color: COLOR_MAP[color],
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        {desc}
      </div>
      <div
        style={{
          position: 'absolute', top: 16, right: 16,
          fontSize: 28, opacity: 0.15,
        }}
      >
        {icon}
      </div>
    </div>
  );
}
