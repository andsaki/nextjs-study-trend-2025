import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { Toast } from './Toast';
import type { ToastType, WCAGLevel } from './Toast';

export interface ToastOptions {
  type?: ToastType;
  title?: string;
  duration?: number;
}

interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration: number;
}

interface ToastContextType {
  showToast: (message: string, options?: ToastOptions) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export interface ToastProviderProps {
  children: ReactNode;
  /** WCAGレベル（A, AA, AAA） */
  wcagLevel?: WCAGLevel;
}

/**
 * ToastProvider
 *
 * アプリケーション全体でトーストを管理する Provider
 *
 * @example
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ children, wcagLevel = 'AA' }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, options: ToastOptions = {}) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastItem = {
      id,
      type: options.type || 'info',
      title: options.title,
      message,
      duration: options.duration ?? 5000,
    };

    setToasts((prev) => [...prev, newToast]);
  }, []);

  const success = useCallback((message: string, title?: string) => {
    showToast(message, { type: 'success', title });
  }, [showToast]);

  const error = useCallback((message: string, title?: string) => {
    showToast(message, { type: 'error', title });
  }, [showToast]);

  const warning = useCallback((message: string, title?: string) => {
    showToast(message, { type: 'warning', title });
  }, [showToast]);

  const info = useCallback((message: string, title?: string) => {
    showToast(message, { type: 'info', title });
  }, [showToast]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const value: ToastContextType = {
    showToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* トースト表示領域 */}
      <div
        aria-live="polite"
        aria-atomic="false"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          zIndex: 10000,
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast, index) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            onClose={removeToast}
            index={index}
            wcagLevel={wcagLevel}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

/**
 * useToast
 *
 * トーストを表示するためのカスタムフック
 *
 * @throws ToastProvider外で使用した場合にエラー
 *
 * @example
 * const { success, error } = useToast();
 *
 * <button onClick={() => success('保存しました')}>保存</button>
 * <button onClick={() => error('エラーが発生しました')}>エラー</button>
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};
