"use client";

import { Toast } from "@/src/design-system/components";
import { useToastStore } from "@/lib/store/useToastStore";

/**
 * トースト通知を表示するコンテナ
 *
 * root layoutに配置して、アプリ全体でトーストを表示できるようにします。
 */
export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <>
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
        />
      ))}
    </>
  );
}
