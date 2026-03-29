import React from 'react';

type AvatarColor = 'cyan' | 'green' | 'yellow' | 'purple' | 'orange';

interface AvatarProps {
  letter: string;
  color: AvatarColor;
  size?: number;
}

const COLOR_MAP: Record<AvatarColor, string> = {
  cyan:   'var(--cyan)',
  green:  'var(--green)',
  yellow: 'var(--yellow)',
  purple: 'var(--purple)',
  orange: 'var(--orange)',
};

export function Avatar({ letter, color, size = 20 }: AvatarProps) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        background: COLOR_MAP[color],
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.45, fontWeight: 700,
        color: 'var(--bg-deep)', flexShrink: 0,
      }}
    >
      {letter}
    </div>
  );
}
