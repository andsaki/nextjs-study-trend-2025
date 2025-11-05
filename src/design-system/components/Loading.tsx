import React from "react";
import { colors, spacing } from "../tokens";
import { primitive } from "../tokens/colors";

export interface LoadingProps {
  /** スピナーのサイズ */
  size?: "sm" | "md" | "lg" | "xl";
  /** スピナーの色 */
  color?: "primary" | "secondary" | "white";
  /** ラベルテキスト */
  label?: string;
  /** フルスクリーンオーバーレイ表示 */
  fullscreen?: boolean;
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
} as const;

const colorMap = {
  primary: primitive.blue[500],
  secondary: primitive.gray[600],
  white: primitive.white,
} as const;

/**
 * アクセシブルなローディングスピナーコンポーネント
 *
 * 機能:
 * - スクリーンリーダー対応（aria-label, role="status"）
 * - サイズバリエーション（sm/md/lg/xl）
 * - カラーバリエーション（primary/secondary/white）
 * - フルスクリーンオーバーレイ表示
 * - アニメーション対応
 */
export const Loading: React.FC<LoadingProps> = ({
  size = "md",
  color = "primary",
  label = "読み込み中",
  fullscreen = false,
}) => {
  const spinnerSize = sizeMap[size];
  const spinnerColor = colorMap[color];

  const spinner = (
    <div
      role="status"
      aria-label={label}
      aria-live="polite"
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: spacing.scale[2],
      }}
    >
      <svg
        width={spinnerSize}
        height={spinnerSize}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          animation: "spin 1s linear infinite",
        }}
      >
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={spinnerColor}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="50 50"
          opacity="0.25"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={spinnerColor}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="31.4 31.4"
          strokeDashoffset="0"
        />
      </svg>
      {label && (
        <span
          style={{
            fontSize: size === "sm" ? "12px" : size === "md" ? "14px" : "16px",
            color: color === "white" ? primitive.white : colors.text.secondary,
            fontWeight: 500,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
        aria-modal="true"
      >
        {spinner}
      </div>
    );
  }

  return spinner;
};

/**
 * インラインローディング用の小さなスピナー
 */
export const InlineLoading: React.FC<{
  size?: "sm" | "md";
  color?: "primary" | "secondary";
}> = ({ size = "sm", color = "primary" }) => {
  const spinnerSize = size === "sm" ? 14 : 18;
  const spinnerColor = colorMap[color];

  return (
    <svg
      width={spinnerSize}
      height={spinnerSize}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        animation: "spin 1s linear infinite",
        display: "inline-block",
        verticalAlign: "middle",
      }}
      role="status"
      aria-label="読み込み中"
    >
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={spinnerColor}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="50 50"
        opacity="0.25"
      />
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={spinnerColor}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="31.4 31.4"
        strokeDashoffset="0"
      />
    </svg>
  );
};
