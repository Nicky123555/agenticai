import React from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'success';
type ButtonSize    = 'sm' | 'md';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  fullWidth?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'var(--cyan)', color: 'var(--bg-deep)', fontWeight: 700,
    boxShadow: '0 0 20px rgba(0,212,255,0.25)', border: 'none',
  },
  ghost: {
    background: 'transparent', color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
  },
  danger: {
    background: 'var(--red-glow)', color: 'var(--red)',
    border: '1px solid rgba(255,68,102,0.3)',
  },
  success: {
    background: 'var(--green-glow)', color: 'var(--green)',
    border: '1px solid rgba(0,255,136,0.3)',
  },
};

const SIZE_STYLES: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '5px 10px', fontSize: 10 },
  md: { padding: '8px 16px', fontSize: 11 },
};

export function Button({
  variant = 'ghost',
  size = 'md',
  fullWidth = false,
  children,
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      style={{
        borderRadius: 6, cursor: 'pointer',
        fontFamily: 'var(--font-mono)', letterSpacing: 1,
        transition: 'all 0.2s',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        justifyContent: fullWidth ? 'center' : undefined,
        width: fullWidth ? '100%' : undefined,
        ...VARIANT_STYLES[variant],
        ...SIZE_STYLES[size],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
