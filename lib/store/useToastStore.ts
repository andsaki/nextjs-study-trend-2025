import { create } from "zustand";
import type { ToastType } from "@/src/design-system/components";

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  // ヘルパーメソッド
  success: (message: string, title?: string, duration?: number) => void;
  error: (message: string, title?: string, duration?: number) => void;
  warning: (message: string, title?: string, duration?: number) => void;
  info: (message: string, title?: string, duration?: number) => void;
}

/**
 * トースト通知のグローバルストア
 *
 * 使い方:
 * ```tsx
 * const { success, error } = useToastStore();
 *
 * // 成功通知
 * success('保存しました');
 *
 * // エラー通知
 * error('エラーが発生しました', 'エラー');
 * ```
 */
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  // ヘルパーメソッド
  success: (message, title, duration = 5000) => {
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id: `toast-${Date.now()}-${Math.random()}`,
          type: "success",
          title,
          message,
          duration,
        },
      ],
    }));
  },

  error: (message, title, duration = 5000) => {
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id: `toast-${Date.now()}-${Math.random()}`,
          type: "error",
          title,
          message,
          duration,
        },
      ],
    }));
  },

  warning: (message, title, duration = 5000) => {
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id: `toast-${Date.now()}-${Math.random()}`,
          type: "warning",
          title,
          message,
          duration,
        },
      ],
    }));
  },

  info: (message, title, duration = 5000) => {
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id: `toast-${Date.now()}-${Math.random()}`,
          type: "info",
          title,
          message,
          duration,
        },
      ],
    }));
  },
}));
