"use client";

import { memo, useEffect, useRef } from "react";
import { MermaidDiagram } from "./MermaidDiagram";
import { colors, spacing } from "../../../src/design-system/tokens";

interface DiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  chart: string;
  title: string;
}

export const DiagramModal = memo(function DiagramModal({
  isOpen,
  onClose,
  chart,
  title,
}: DiagramModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // 前のフォーカス要素を記憶
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  // Escapeキー、フォーカストラップ、オーバーフローの処理
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    // 最初のフォーカス可能要素にフォーカス
    const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusableElements?.[0]?.focus();

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // フォーカストラップ（Tabキーでモーダル内を循環）
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const elements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!elements || elements.length === 0) return;

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleTab);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleTab);
      // 前のフォーカス要素に戻す
      previousActiveElement.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.scale[4],
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="diagram-modal-title"
        style={{
          backgroundColor: colors.background.default,
          borderRadius: "1rem",
          width: "95vw",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          border: `2px solid ${colors.border.default}`,
        }}
      >
        <div
          style={{
            padding: spacing.scale[4],
            borderBottom: `1px solid ${colors.border.subtle}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            id="diagram-modal-title"
            style={{
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: 600,
              color: colors.text.primary,
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="モーダルを閉じる"
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              padding: spacing.scale[2],
              lineHeight: 1,
              color: colors.text.secondary,
            }}
          >
            ✕
          </button>
        </div>
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: spacing.scale[6],
          }}
        >
          <MermaidDiagram chart={chart} />
        </div>
      </div>
    </div>
  );
});
