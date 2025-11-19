import React, { useState, useEffect } from "react";
import { colors, spacing, typography, radii, accessibilityLevels } from "../tokens";
import { primitive } from "../tokens/colors";
import type { WCAGLevel } from "../tokens";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** ラベルテキスト */
  label: string;
  /** エラーメッセージ */
  error?: string;
  /** ヘルプテキスト */
  helpText?: string;
  /** WCAGアクセシビリティレベル (A/AA/AAA) @default 'AA' */
  wcagLevel?: WCAGLevel;
}

/**
 * アクセシブルなラジオボタンコンポーネント
 *
 * 機能:
 * - キーボード操作対応（矢印キー、Space）
 * - スクリーンリーダー対応
 * - エラー表示とaria-invalid
 * - フォーカス表示（キーボード操作時のみ）
 */
export const Radio: React.FC<RadioProps> = ({
  label,
  error,
  helpText,
  id,
  disabled = false,
  wcagLevel = "AA",
  ...props
}) => {
  const generatedId = React.useId();
  const radioId = id || generatedId;
  const errorId = `${radioId}-error`;
  const helpId = `${radioId}-help`;

  const levelFocus = accessibilityLevels.focus[wcagLevel];

  // キーボードフォーカスの検出
  const [isKeyboardFocus, setIsKeyboardFocus] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" || e.key.startsWith("Arrow")) {
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
          type="radio"
          id={radioId}
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
            accentColor: primitive.blue[500],
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
          input[type="radio"] {
            accent-color: ${primitive.blue[500]};
          }
          [data-focused="true"] {
            outline: ${levelFocus.outlineWidth} solid ${levelFocus.outline};
            outline-offset: ${levelFocus.outlineOffset};
            border-radius: ${radii.borderRadius.full};
            background-color: ${levelFocus.background};
          }
        `}</style>
      </div>
      <div style={{ flex: 1 }}>
        <label
          htmlFor={radioId}
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.medium,
            color: disabled ? primitive.gray[400] : primitive.gray[900],
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
              color: primitive.gray[600],
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

export interface RadioGroupProps {
  /** グループのラベル */
  label: string;
  /** ラジオボタンのリスト */
  children: React.ReactNode;
  /** エラーメッセージ */
  error?: string;
  /** ヘルプテキスト */
  helpText?: string;
}

/**
 * ラジオボタングループコンポーネント
 *
 * 複数のラジオボタンをグループ化するためのコンポーネントです。
 * fieldset と legend を使用してアクセシブルな構造を提供します。
 */
export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  children,
  error,
  helpText,
}) => {
  const groupId = React.useId();
  const errorId = `${groupId}-error`;
  const helpId = `${groupId}-help`;

  return (
    <fieldset
      style={{
        border: `1px solid ${error ? colors.border.error : colors.border.default}`,
        borderRadius: radii.borderRadius.md,
        padding: spacing.scale[4],
        margin: 0,
      }}
      aria-describedby={
        error
          ? errorId
          : helpText
          ? helpId
          : undefined
      }
    >
      <legend
        style={{
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.semibold,
          color: colors.text.primary,
          padding: `0 ${spacing.scale[2]}`,
        }}
      >
        {label}
      </legend>
      {helpText && !error && (
        <p
          id={helpId}
          style={{
            margin: `0 0 ${spacing.scale[3]} 0`,
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
            lineHeight: typography.lineHeight.normal,
          }}
        >
          {helpText}
        </p>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacing.scale[3],
        }}
      >
        {children}
      </div>
      {error && (
        <p
          id={errorId}
          role="alert"
          style={{
            margin: `${spacing.scale[3]} 0 0 0`,
            fontSize: typography.fontSize.sm,
            color: colors.text.error,
            lineHeight: typography.lineHeight.normal,
          }}
        >
          {error}
        </p>
      )}
    </fieldset>
  );
};
