import React, { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { ToastContext } from './toast-context';

interface Toast {
  id: number;
  message: string;
}

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2500);
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
      >
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              background: 'rgba(139, 92, 246, 0.95)',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 500,
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              animation: 'toast-slide 0.3s ease-out',
              maxWidth: '90vw',
              textAlign: 'center',
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
