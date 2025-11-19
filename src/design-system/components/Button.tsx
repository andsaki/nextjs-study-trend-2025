import React from "react";
import {
  colors,
  spacing,
  typography,
  accessibilityLevels,
  radii,
} from "../tokens";
import type { WCAGLevel } from "../tokens";
import "./Button.css";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** ボタンのバリエーション */
  variant?: "primary" | "secondary" | "outline" | "danger";
  /** ボタンのサイズ */
  size?: "sm" | "md" | "lg";
  /** ローディング状態 */
  isLoading?: boolean;
  /** テキストの前に表示するアイコン */
  icon?: React.ReactNode;
  /** WCAGアクセシビリティレベル (A/AA/AAA) @default 'AA' */
  wcagLevel?: WCAGLevel;
}

/**
 * アクセシブルなボタンコンポーネント
 *
 * 機能:
 * - キーボード操作対応（Enter、Space）
 * - スクリーンリーダー対応
 * - フォーカス表示
 * - ARIA属性サポート
 * - aria-busyによるローディング状態
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  disabled,
  type = "button",
  wcagLevel = "AA",
  ...props
}) => {
  // WCAGレベルに応じたカラートークンを取得
  const levelColors = accessibilityLevels.button[wcagLevel];
  const levelFocus = variant === 'danger'
    ? accessibilityLevels.dangerFocus[wcagLevel]
    : accessibilityLevels.focus[wcagLevel];

  // キーボード操作によるフォーカスかどうかを追跡
  const [isKeyboardFocus, setIsKeyboardFocus] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // グローバルなキーボード/マウスの使用を検出
  React.useEffect(() => {
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

  // ベーススタイル: すべてのボタンに共通するスタイル
  const baseStyles: React.CSSProperties = {
    fontFamily: typography.fontFamily.base,
    fontWeight: typography.fontWeight.semibold,
    borderRadius: radii.borderRadius.md,
    cursor: disabled || isLoading ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.button.gap,
    transition: "all 0.2s ease-in-out",
    opacity: disabled || isLoading ? 0.6 : 1, // 無効化時は透明度を下げる
    outline: "none", // デフォルトのアウトラインを削除（カスタムフォーカススタイルを使用）
    position: "relative",
  };

  // 各バリアントのボーダー色
  const borderColors = {
    primary: disabled
      ? colors.button.primary.bgDisabled
      : levelColors.primary.border,
    secondary: disabled
      ? colors.button.secondary.borderHover
      : levelColors.secondary.border,
    outline: disabled
      ? colors.button.outline.borderDisabled || colors.border.default
      : levelColors.primary.bg,
    danger: disabled
      ? colors.button.danger.bgDisabled
      : levelColors.danger.border,
  };

  // バリアントスタイル: WCAGレベルとバリアントに応じた見た目を定義
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: disabled
        ? colors.button.primary.bgDisabled
        : levelColors.primary.bg,
      color: disabled
        ? colors.button.primary.textDisabled
        : levelColors.primary.text,
      borderWidth: "1px",
      borderStyle: "solid",
    },
    secondary: {
      backgroundColor: disabled
        ? colors.button.secondary.bgDisabled
        : levelColors.secondary.bg,
      color: disabled
        ? colors.button.secondary.textDisabled
        : levelColors.secondary.text,
      borderWidth: "1px",
      borderStyle: "solid",
    },
    outline: {
      backgroundColor: disabled
        ? colors.button.outline.bgDisabled
        : "transparent",
      color: disabled
        ? colors.button.outline.textDisabled
        : levelColors.primary.bg,
      borderWidth: "2px",
      borderStyle: "solid",
    },
    danger: {
      backgroundColor: disabled
        ? colors.button.danger.bgDisabled
        : levelColors.danger.bg,
      color: disabled
        ? colors.button.danger.textDisabled
        : levelColors.danger.text,
      borderWidth: "1px",
      borderStyle: "solid",
    },
  };

  // サイズスタイル: sm、md、lgのサイズを定義
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: `${spacing.button.paddingY.sm} ${spacing.button.paddingX.sm}`,
      fontSize: typography.fontSize.sm,
    },
    md: {
      padding: `${spacing.button.paddingY.md} ${spacing.button.paddingX.md}`,
      fontSize: typography.fontSize.base,
    },
    lg: {
      padding: `${spacing.button.paddingY.lg} ${spacing.button.paddingX.lg}`,
      fontSize: typography.fontSize.lg,
    },
  };

  // 最終的なスタイル: ベース、バリアント、サイズを統合
  const styles = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
  };

  // ホバー/アクティブ用のトークンを直接取得
  const hoverBg =
    variant === "primary"
      ? colors.button.primary.bgHover
      : variant === "secondary"
      ? colors.button.secondary.bgHover
      : variant === "danger"
      ? colors.button.danger.bgHover
      : colors.button.outline.bgHover;

  const hoverBorder =
    variant === "primary"
      ? colors.button.primary.borderHover
      : variant === "secondary"
      ? colors.button.secondary.borderHover
      : variant === "danger"
      ? colors.button.danger.borderHover
      : colors.button.outline.borderHover || colors.button.outline.bgHover;

  // propsからstyleを分離して、最後にマージする
  const { style: externalStyle, ...restProps } = props;

  // 外部から渡されたstyleからborderショートハンドを除外
  const sanitizedExternalStyle = externalStyle
    ? Object.fromEntries(
        Object.entries(externalStyle).filter(([key]) => key !== "border")
      )
    : {};

  return (
    <button
      ref={buttonRef}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-disabled={disabled || isLoading}
      className={`button-${variant}`}
      {...restProps}
      style={{
        ...styles,
        // CSS変数でボーダー/ホバー/フォーカス色を定義
        ["--border-color" as string]: borderColors[variant],
        ["--hover-bg" as string]: disabled || isLoading ? "" : hoverBg,
        ["--hover-border" as string]: disabled || isLoading ? "" : hoverBorder,
        ["--focus-bg" as string]: levelFocus.background,
        ["--focus-text" as string]: levelFocus.text,
        ["--focus-outline" as string]: levelFocus.outline,
        ["--focus-outline-width" as string]: levelFocus.outlineWidth,
        ["--focus-outline-offset" as string]: levelFocus.outlineOffset,
        // 外部から渡されたstyleを最後にマージ（borderショートハンドは除外済み）
        ...sanitizedExternalStyle,
      }}
      onMouseEnter={restProps.onMouseEnter}
      onMouseLeave={restProps.onMouseLeave}
      onFocus={(e) => {
        // キーボードフォーカスの場合のみ表示
        if (isKeyboardFocus) {
          e.currentTarget.setAttribute("data-focused", "true");
        }
        restProps.onFocus?.(e);
      }}
      onBlur={(e) => {
        // フォーカス時のクラスを削除
        e.currentTarget.removeAttribute("data-focused");
        restProps.onBlur?.(e);
      }}
    >
      {/* ローディング状態の表示 */}
      {isLoading && (
        <span role="status" aria-label="読み込み中">
          ⏳
        </span>
      )}
      {/* アイコンの表示（装飾的なのでaria-hidden） */}
      {!isLoading && icon && (
        <span
          aria-hidden="true"
          style={{ display: "inline-flex", alignItems: "center" }}
        >
          {icon}
        </span>
      )}
      {children}
    </button>
  );
};
