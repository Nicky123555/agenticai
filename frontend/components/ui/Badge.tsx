import React from 'react';

type BadgeVariant =
  | 'todo' | 'in-progress' | 'done'
  | 'high' | 'medium' | 'low'
  | 'cyan' | 'purple' | 'orange' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const VARIANT_STYLES: Record<BadgeVariant, React.CSSProperties> = {
  'todo':        { background: 'rgba(107,138,170,0.15)', color: 'var(--text-secondary)', borderColor: 'rgba(107,138,170,0.3)' },
  'in-progress': { background: 'var(--yellow-glow)',     color: 'var(--yellow)',         borderColor: 'rgba(255,204,0,0.3)'   },
  'done':        { background: 'var(--green-glow)',      color: 'var(--green)',          borderColor: 'rgba(0,255,136,0.3)'   },
  'high':        { background: 'var(--red-glow)',        color: 'var(--red)',            borderColor: 'rgba(255,68,102,0.3)'  },
  'medium':      { background: 'var(--yellow-glow)',     color: 'var(--yellow)',         borderColor: 'rgba(255,204,0,0.3)'   },
  'low':         { background: 'var(--green-glow)',      color: 'var(--green)',          borderColor: 'rgba(0,255,136,0.3)'   },
  'cyan':        { background: 'var(--cyan-glow)',       color: 'var(--cyan)',           borderColor: 'rgba(0,212,255,0.3)'   },
  'purple':      { background: 'var(--purple-glow)',     color: 'var(--purple)',         borderColor: 'rgba(168,85,247,0.3)'  },
  'orange':      { background: 'var(--orange-glow)',     color: 'var(--orange)',         borderColor: 'rgba(249,115,22,0.3)'  },
  'default':     { background: 'rgba(107,138,170,0.1)', color: 'var(--text-secondary)', borderColor: 'var(--border)'         },
};

export function Badge({ variant = 'default', children, style }: BadgeProps) {
  return (
    <span
      style={{
        fontSize: 9, fontFamily: 'var(--font-mono)',
        padding: '3px 8px', borderRadius: 4,
        letterSpacing: 1, fontWeight: 500,
        border: '1px solid transparent',
        display: 'inline-block',
        ...VARIANT_STYLES[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/** Small emoji badge used on leaderboard */
export function EmojiBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 3,
        fontSize: 10, fontFamily: 'var(--font-mono)',
        padding: '3px 8px', borderRadius: 20,
        background: 'rgba(255,204,0,0.1)',
        border: '1px solid rgba(255,204,0,0.25)',
        color: 'var(--yellow)',
      }}
    >
      {children}
    </span>
  );
}

/** Dependency chip */
export function DepChip({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 9, fontFamily: 'var(--font-mono)',
        padding: '2px 7px', borderRadius: 3,
        background: 'rgba(168,85,247,0.1)',
        border: '1px solid rgba(168,85,247,0.25)',
        color: 'var(--purple)',
        display: 'inline-flex', alignItems: 'center', gap: 3,
      }}
    >
      → {children}
    </span>
  );
}
