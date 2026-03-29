'use client';

import { useStore } from '@/store/useStore';

export function LoadingOverlay() {
  const loading     = useStore((s) => s.loading);
  const loadingText = useStore((s) => s.loadingText);

  if (!loading) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(4,8,16,0.85)',
        zIndex: 2000,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16,
      }}
    >
      <div
        style={{
          width: 48, height: 48,
          border: '2px solid var(--border)',
          borderTopColor: 'var(--cyan)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <div
        style={{
          fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'var(--cyan)', letterSpacing: 2,
        }}
      >
        {loadingText}
      </div>

      {/* Inline keyframe — avoids needing a separate CSS file */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
