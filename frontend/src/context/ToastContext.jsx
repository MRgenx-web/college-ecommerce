// Lightweight toast notification system (no external dependency). Renders
// its own fixed-position stack; call showToast(message, type) from anywhere.
import { createContext, useState, useCallback } from 'react';

export const ToastContext = createContext(null);

let idCounter = 0;

const TYPE_STYLES = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-gray-800',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${TYPE_STYLES[toast.type] || TYPE_STYLES.info} flex min-w-[220px] items-start gap-3 rounded-lg px-4 py-3 text-sm text-white shadow-lg animate-fade-in`}
          >
            <span className="flex-1">{toast.message}</span>
            <button
              type="button"
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              aria-label="Dismiss notification"
              className="shrink-0 text-white/70 hover:text-white"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
