import React, { useId } from 'react';
import { colors, spacing, typography, accessibilityLevels, radii } from '../tokens';
import type { WCAGLevel } from '../tokens';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** ラベルテキスト */
  label: string;
  /** エラーメッセージ */
  error?: string;
  /** ヘルプテキスト */
  helperText?: string;
  /** 入力欄のサイズ */
  size?: 'sm' | 'md' | 'lg';
  /** 必須項目かどうか */
  required?: boolean;
  /** WCAGアクセシビリティレベル (A/AA/AAA) @default 'AA' */
  wcagLevel?: WCAGLevel;
}

/**
 * アクセシブルな入力コンポーネント
 *
 * 機能:
 * - ラベルとinputの関連付け（for/id）
 * - エラー状態の適切な伝達（aria-invalid, aria-describedby）
 * - 必須項目の明示（aria-required）
 * - フォーカス表示
 * - WCAG AA準拠のカラーコントラスト
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  size = 'md',
  required = false,
  disabled = false,
  wcagLevel = 'AA',
  id,
  ...props
}) => {
  // ユニークなIDを自動生成（idが指定されていない場合）
  const autoId = useId();
  const inputId = id || autoId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  // WCAGレベルに応じたフォーカススタイルを取得
  const levelFocus = accessibilityLevels.focus[wcagLevel];

  // キーボード操作によるフォーカスかどうかを追跡
  const [isKeyboardFocus, setIsKeyboardFocus] = React.useState(false);

  // グローバルなキーボード/マウスの使用を検出
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardFocus(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardFocus(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // サイズスタイル
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: `${spacing.input.paddingY.sm} ${spacing.input.paddingX.sm}`,
      fontSize: typography.fontSize.sm,
    },
    md: {
      padding: `${spacing.input.paddingY.md} ${spacing.input.paddingX.md}`,
      fontSize: typography.fontSize.base,
    },
    lg: {
      padding: `${spacing.input.paddingY.lg} ${spacing.input.paddingX.lg}`,
      fontSize: typography.fontSize.lg,
    },
  };

  // ベーススタイル
  const inputStyles: React.CSSProperties = {
    width: '100%',
    fontFamily: typography.fontFamily.base,
    borderRadius: radii.borderRadius.md,
    border: `2px solid ${error ? colors.input.borderError : colors.input.border}`,
    outline: 'none',
    transition: 'all 0.2s ease-in-out',
    backgroundColor: disabled ? colors.input.bgDisabled : colors.input.bg,
    color: disabled ? colors.input.textDisabled : colors.input.text,
    cursor: disabled ? 'not-allowed' : 'text',
    ...sizeStyles[size],
  };

  const labelStyles: React.CSSProperties = {
    display: 'block',
    marginBottom: spacing.input.gap,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.input.label,
  };

  const helperTextStyles: React.CSSProperties = {
    marginTop: spacing.input.gap,
    fontSize: typography.fontSize.sm,
    color: error ? colors.input.errorText : colors.input.helperText,
    lineHeight: typography.lineHeight.normal,
  };

  const containerStyles: React.CSSProperties = {
    marginBottom: spacing.scale[4], // 16px
  };

  // aria-describedbyの値を構築
  const getAriaDescribedBy = () => {
    const ids: string[] = [];
    if (error) ids.push(errorId);
    if (helperText && !error) ids.push(helperId);
    return ids.length > 0 ? ids.join(' ') : undefined;
  };

  return (
    <div style={containerStyles}>
      {/* ラベル: for属性でinputと関連付け */}
      <label htmlFor={inputId} style={labelStyles}>
        {label}
        {/* 必須項目の表示 */}
        {required && (
          <span
            style={{ color: colors.input.errorText, marginLeft: spacing.scale[1] }}
            aria-label="必須"
          >
            *
          </span>
        )}
      </label>

      {/* 入力フィールド */}
      <input
        id={inputId}
        disabled={disabled}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={getAriaDescribedBy()}
        style={inputStyles}
        {...props}
        // フォーカス時のスタイル: WCAGレベルに応じて変更
        onFocus={(e) => {
          if (!disabled && isKeyboardFocus) {
            e.currentTarget.style.backgroundColor = levelFocus.background;
            e.currentTarget.style.color = levelFocus.text;
            e.currentTarget.style.borderColor = levelFocus.outline;
            e.currentTarget.style.outline = `${levelFocus.outlineWidth} solid ${levelFocus.outline}`;
            e.currentTarget.style.outlineOffset = levelFocus.outlineOffset;
          }
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          // 元のスタイルに戻す
          e.currentTarget.style.backgroundColor = disabled ? colors.input.bgDisabled : colors.input.bg;
          e.currentTarget.style.color = disabled ? colors.input.textDisabled : colors.input.text;
          e.currentTarget.style.borderColor = error ? colors.input.borderError : colors.input.border;
          e.currentTarget.style.outline = 'none';
          e.currentTarget.style.outlineOffset = '0';
          props.onBlur?.(e);
        }}
      />

      {/* エラーメッセージ: role="alert"で即座に読み上げ */}
      {error && (
        <div
          id={errorId}
          role="alert"
          aria-live="polite"
          style={helperTextStyles}
        >
          {error}
        </div>
      )}

      {/* ヘルプテキスト: エラーがない場合のみ表示 */}
      {helperText && !error && (
        <div id={helperId} style={helperTextStyles}>
          {helperText}
        </div>
      )}
    </div>
  );
};
