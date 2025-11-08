"use client";

import { Modal, Button } from "@/src/design-system/components";
import { AlertTriangle } from "lucide-react";

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * 確認モーダルコンポーネント
 *
 * デザインシステムのModalコンポーネントを使用した確認ダイアログ
 */
export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "確認",
  cancelLabel = "キャンセル",
  variant = "danger",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const variantColors = {
    danger: {
      icon: "#f44336",
      bg: "#ffebee",
      border: "#ef5350",
      buttonBg: "#f44336",
    },
    warning: {
      icon: "#ff9800",
      bg: "#fff3e0",
      border: "#ffa726",
      buttonBg: "#ff9800",
    },
    info: {
      icon: "#2196f3",
      bg: "#e3f2fd",
      border: "#42a5f5",
      buttonBg: "#2196f3",
    },
  };

  const colors = variantColors[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoading ? () => {} : onCancel}
      title={title}
      size="sm"
      footer={
        <>
          <Button
            variant="outline"
            size="md"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            size="md"
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
            style={
              variant !== "danger"
                ? {
                    backgroundColor: colors.buttonBg,
                    borderColor: colors.buttonBg,
                  }
                : undefined
            }
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div
          style={{
            padding: "1rem",
            backgroundColor: colors.bg,
            border: `1px solid ${colors.border}`,
            borderRadius: "6px",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
          }}
        >
          <AlertTriangle size={20} color={colors.icon} style={{ flexShrink: 0, marginTop: "0.125rem" }} />
          <p
            style={{
              fontSize: "1rem",
              color: "#212121",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {message}
          </p>
        </div>

        {variant === "danger" && (
          <p
            style={{
              fontSize: "0.875rem",
              color: "#757575",
              margin: 0,
            }}
          >
            この操作は取り消せません。本当に実行しますか？
          </p>
        )}
      </div>
    </Modal>
  );
}
