import React, { useState, useEffect } from "react";
import { colors, spacing, typography, radii, accessibilityLevels } from "../tokens";
import type { WCAGLevel } from "../tokens";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** ラベルテキスト */
  label: string;
  /** エラーメッセージ */
  error?: string;
  /** ヘルプテキスト */
  helpText?: string;
  /** 不確定状態 */
  indeterminate?: boolean;
  /** WCAGアクセシビリティレベル (A/AA/AAA) @default 'AA' */
  wcagLevel?: WCAGLevel;
}

/**
 * アクセシブルなチェックボックスコンポーネント
 *
 * 機能:
 * - キーボード操作対応（Space）
 * - スクリーンリーダー対応
 * - エラー表示とaria-invalid
 * - 不確定状態（indeterminate）のサポート
 * - フォーカス表示（キーボード操作時のみ）
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  helpText,
  indeterminate = false,
  id,
  disabled = false,
  wcagLevel = "AA",
  ...props
}) => {
  const generatedId = React.useId();
  const checkboxId = id || generatedId;
  const errorId = `${checkboxId}-error`;
  const helpId = `${checkboxId}-help`;

  const checkboxRef = React.useRef<HTMLInputElement>(null);
  const levelFocus = accessibilityLevels.focus[wcagLevel];

  // 不確定状態の管理
  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  // キーボードフォーカスの検出
  const [isKeyboardFocus, setIsKeyboardFocus] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setIsKeyboardFocus(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardFocus(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: spacing.scale[2],
      }}
    >
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <input
          ref={checkboxRef}
          type="checkbox"
          id={checkboxId}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error
              ? errorId
              : helpText
              ? helpId
              : undefined
          }
          {...props}
          style={{
            width: "20px",
            height: "20px",
            cursor: disabled ? "not-allowed" : "pointer",
            accentColor: colors.button.primary.bg,
            opacity: disabled ? 0.5 : 1,
            margin: 0,
          }}
          onFocus={(e) => {
            if (isKeyboardFocus) {
              e.currentTarget.parentElement!.setAttribute("data-focused", "true");
            }
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.parentElement!.removeAttribute("data-focused");
            props.onBlur?.(e);
          }}
        />
        <style>{`
          [data-focused="true"] {
            outline: ${levelFocus.outlineWidth} solid ${levelFocus.outline};
            outline-offset: ${levelFocus.outlineOffset};
            border-radius: ${radii.borderRadius.sm};
            background-color: ${levelFocus.background};
          }
        `}</style>
      </div>
      <div style={{ flex: 1 }}>
        <label
          htmlFor={checkboxId}
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.medium,
            color: disabled ? colors.text.disabled : colors.text.primary,
            cursor: disabled ? "not-allowed" : "pointer",
            userSelect: "none",
          }}
        >
          {label}
        </label>
        {helpText && !error && (
          <p
            id={helpId}
            style={{
              margin: `${spacing.scale[1]} 0 0 0`,
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
              lineHeight: typography.lineHeight.normal,
            }}
          >
            {helpText}
          </p>
        )}
        {error && (
          <p
            id={errorId}
            role="alert"
            style={{
              margin: `${spacing.scale[1]} 0 0 0`,
              fontSize: typography.fontSize.sm,
              color: colors.text.error,
              lineHeight: typography.lineHeight.normal,
            }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
};
