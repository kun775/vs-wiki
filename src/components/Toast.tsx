import React, { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { ToastContext } from './toast-context';

interface Toast {
  id: number;
  message: string;
  exiting: boolean;
}

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, exiting: false }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 200);
    }, 2300);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          pointerEvents: 'none',
        }}
        role="status"
        aria-live="polite"
      >
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={toast.exiting ? 'toast-exit' : 'toast-enter'}
            style={{
              background: 'rgba(139, 92, 246, 0.92)',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 500,
              boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
              maxWidth: '90vw',
              textAlign: 'center',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
