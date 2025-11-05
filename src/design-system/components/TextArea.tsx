import React, { useState, useEffect } from "react";
import { colors, spacing, typography, radii, accessibilityLevels } from "../tokens";
import type { WCAGLevel } from "../tokens";

export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, ""> {
  /** ラベルテキスト */
  label: string;
  /** エラーメッセージ */
  error?: string;
  /** ヘルプテキスト */
  helpText?: string;
  /** 必須項目かどうか */
  required?: boolean;
  /** 文字数カウント表示 */
  showCount?: boolean;
  /** 最大文字数 */
  maxLength?: number;
  /** WCAGアクセシビリティレベル (A/AA/AAA) @default 'AA' */
  wcagLevel?: WCAGLevel;
}

/**
 * アクセシブルなテキストエリアコンポーネント
 *
 * 機能:
 * - キーボード操作対応
 * - スクリーンリーダー対応
 * - エラー表示とaria-invalid
 * - 文字数カウント表示
 * - フォーカス表示（キーボード操作時のみ）
 * - リサイズ可能
 */
export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helpText,
  required = false,
  showCount = false,
  maxLength,
  id,
  disabled = false,
  wcagLevel = "AA",
  value,
  defaultValue,
  onChange,
  ...props
}) => {
  const generatedId = React.useId();
  const textareaId = id || generatedId;
  const errorId = `${textareaId}-error`;
  const helpId = `${textareaId}-help`;
  const countId = `${textareaId}-count`;

  const levelFocus = accessibilityLevels.focus[wcagLevel];

  // キーボードフォーカスの検出
  const [isKeyboardFocus, setIsKeyboardFocus] = useState(false);

  // 文字数カウント用の内部状態
  const [charCount, setCharCount] = useState(0);

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

  // 初期文字数の設定
  useEffect(() => {
    const initialValue = (value || defaultValue || "") as string;
    setCharCount(initialValue.length);
  }, [value, defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
    onChange?.(e);
  };

  return (
    <div style={{ width: "100%" }}>
      <label
        htmlFor={textareaId}
        style={{
          display: "block",
          marginBottom: spacing.scale[2],
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.medium,
          color: disabled ? colors.text.disabled : colors.text.primary,
        }}
      >
        {label}
        {required && (
          <span
            style={{ color: colors.text.error, marginLeft: spacing.scale[1] }}
            aria-label="必須"
          >
            *
          </span>
        )}
      </label>

      <div style={{ position: "relative" }}>
        <textarea
          id={textareaId}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          aria-invalid={error ? true : undefined}
          aria-required={required ? true : undefined}
          aria-describedby={
            [
              error ? errorId : null,
              helpText ? helpId : null,
              showCount ? countId : null,
            ]
              .filter(Boolean)
              .join(" ") || undefined
          }
          {...props}
          style={{
            width: "100%",
            minHeight: "120px",
            padding: spacing.scale[3],
            fontSize: typography.fontSize.base,
            lineHeight: typography.lineHeight.normal,
            color: disabled ? colors.text.disabled : colors.text.primary,
            backgroundColor: disabled
              ? colors.input.bgDisabled
              : colors.input.bg,
            border: `1px solid ${
              error
                ? colors.input.borderError
                : disabled
                ? colors.input.bgDisabled
                : colors.input.border
            }`,
            borderRadius: radii.borderRadius.md,
            outline: "none",
            resize: "vertical",
            transition: "border-color 0.2s, box-shadow 0.2s",
            cursor: disabled ? "not-allowed" : "text",
            fontFamily: "inherit",
            ...props.style,
          }}
          onFocus={(e) => {
            if (isKeyboardFocus && !disabled) {
              e.currentTarget.style.outline = `${levelFocus.outlineWidth} solid ${levelFocus.outline}`;
              e.currentTarget.style.outlineOffset = levelFocus.outlineOffset;
              e.currentTarget.style.backgroundColor = levelFocus.background;
            }
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = "none";
            e.currentTarget.style.backgroundColor = disabled
              ? colors.input.bgDisabled
              : colors.input.bg;
            props.onBlur?.(e);
          }}
          onMouseDown={() => {
            setIsKeyboardFocus(false);
          }}
        />
      </div>

      {showCount && maxLength && (
        <div
          id={countId}
          style={{
            marginTop: spacing.scale[1],
            fontSize: typography.fontSize.xs,
            color:
              charCount > maxLength
                ? colors.text.error
                : colors.text.secondary,
            textAlign: "right",
          }}
          aria-live="polite"
        >
          {charCount} / {maxLength}
        </div>
      )}

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
  );
};
