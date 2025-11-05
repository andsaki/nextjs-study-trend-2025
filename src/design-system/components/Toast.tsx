import React, { useEffect, useState } from 'react';
import { spacing, typography, radii, accessibilityLevels } from '../tokens';
import { primitive } from '../tokens/colors';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type WCAGLevel = 'A' | 'AA' | 'AAA';

export interface ToastProps {
  /** トーストのID */
  id: string;
  /** トーストのタイプ */
  type?: ToastType;
  /** タイトル */
  title?: string;
  /** メッセージ */
  message: string;
  /** 自動で閉じるまでの時間（ミリ秒）、0で無効化 */
  duration?: number;
  /** 閉じる時のコールバック */
  onClose: (id: string) => void;
  /** 表示位置のインデックス */
  index?: number;
  /** WCAGレベル（A, AA, AAA） */
  wcagLevel?: WCAGLevel;
}

/**
 * Toast コンポーネント
 *
 * 一時的な通知メッセージを表示
 *
 * 機能:
 * - 4種類のタイプ（success, error, warning, info）
 * - 自動消去（デフォルト5秒）
 * - スライドインアニメーション
 * - アクセシブル（role="alert"）
 */
export const Toast: React.FC<ToastProps> = ({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  index = 0,
  wcagLevel = 'AA',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // マウント時にスライドイン
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  // 自動クローズ
  useEffect(() => {
    if (duration === 0) return;

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // アニメーション時間と合わせる
  };

  // タイプごとの色
  const typeColors = {
    success: {
      bg: primitive.green[50],
      border: primitive.green[500],
      icon: primitive.green[600],
      text: primitive.green[900],
    },
    error: {
      bg: primitive.red[50],
      border: primitive.red[500],
      icon: primitive.red[600],
      text: primitive.red[900],
    },
    warning: {
      bg: primitive.orange[50],
      border: primitive.orange[500],
      icon: primitive.orange[600],
      text: primitive.orange[900],
    },
    info: {
      bg: primitive.blue[50],
      border: primitive.blue[500],
      icon: primitive.blue[600],
      text: primitive.blue[900],
    },
  };

  // タイプごとのアイコン
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  const themeColor = typeColors[type];

  // WCAGレベルに応じたフォーカススタイル
  const focusStyles = {
    outline: `${accessibilityLevels.focus[wcagLevel].outlineWidth} solid ${accessibilityLevels.focus[wcagLevel].outline}`,
    outlineOffset: accessibilityLevels.focus[wcagLevel].outlineOffset,
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'fixed',
        top: `${spacing.scale[4]}`,
        right: spacing.scale[4],
        transform: `translateY(${index * 96}px) translateX(${isVisible && !isExiting ? '0' : '400px'})`,
        opacity: isVisible && !isExiting ? 1 : 0,
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'flex-start',
        gap: spacing.scale[3],
        padding: spacing.scale[4],
        backgroundColor: themeColor.bg,
        border: `1px solid ${themeColor.border}`,
        borderLeft: `4px solid ${themeColor.border}`,
        borderRadius: radii.borderRadius.lg,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        minWidth: '320px',
        maxWidth: '480px',
        pointerEvents: 'auto',
      }}
    >
      {/* アイコン */}
      <div
        aria-hidden="true"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px',
          borderRadius: radii.borderRadius.full,
          backgroundColor: themeColor.icon,
          color: primitive.white,
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.bold,
          flexShrink: 0,
        }}
      >
        {icons[type]}
      </div>

      {/* コンテンツ */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              color: themeColor.text,
              marginBottom: spacing.scale[1],
            }}
          >
            {title}
          </div>
        )}
        <div
          style={{
            fontSize: typography.fontSize.sm,
            color: themeColor.text,
            lineHeight: typography.lineHeight.relaxed,
          }}
        >
          {message}
        </div>
      </div>

      {/* 閉じるボタン */}
      <button
        onClick={handleClose}
        aria-label="通知を閉じる"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px',
          padding: 0,
          border: 'none',
          background: 'transparent',
          color: themeColor.icon,
          cursor: 'pointer',
          fontSize: typography.fontSize.lg,
          lineHeight: 1,
          borderRadius: radii.borderRadius.sm,
          transition: 'background-color 0.2s ease',
          flexShrink: 0,
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = focusStyles.outline;
          e.currentTarget.style.outlineOffset = focusStyles.outlineOffset;
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = '';
          e.currentTarget.style.outlineOffset = '';
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        ×
      </button>
    </div>
  );
};
