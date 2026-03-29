'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

const TYPE_STYLES: Record<ToastType, React.CSSProperties> = {
  success: { borderColor: 'rgba(0,255,136,0.4)',  color: 'var(--green)' },
  error:   { borderColor: 'rgba(255,68,102,0.4)', color: 'var(--red)'   },
  info:    { borderColor: 'rgba(0,212,255,0.4)',  color: 'var(--cyan)'  },
};

export function ToastProvider({ children }: { children?: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast area */}
      <div
        style={{
          position: 'fixed', bottom: 24, right: 24,
          zIndex: 3000, display: 'flex', flexDirection: 'column', gap: 8,
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 8, padding: '12px 16px',
              fontSize: 12, fontFamily: 'var(--font-mono)',
              display: 'flex', alignItems: 'center', gap: 10,
              minWidth: 280, maxWidth: 360,
              animation: 'slideInRight 0.3s ease',
              ...TYPE_STYLES[toast.type],
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
