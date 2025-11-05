import React, { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { spacing, typography, radii, accessibilityLevels } from '../tokens';
import { primitive } from '../tokens/colors';

export type WCAGLevel = 'A' | 'AA' | 'AAA';

export interface ModalProps {
  /** モーダルの開閉状態 */
  isOpen: boolean;
  /** 閉じる時のコールバック */
  onClose: () => void;
  /** モーダルのタイトル */
  title: string;
  /** モーダルの内容 */
  children: ReactNode;
  /** フッターの内容（オプション） */
  footer?: ReactNode;
  /** サイズ */
  size?: 'sm' | 'md' | 'lg';
  /** WCAGレベル（A, AA, AAA） */
  wcagLevel?: WCAGLevel;
}

/**
 * Modal コンポーネント
 *
 * アクセシブルなモーダルダイアログ
 *
 * 機能:
 * - role="dialog" と aria-modal="true"
 * - フォーカストラップ（Tab キーでモーダル内を循環）
 * - Esc キーで閉じる
 * - 背景スクロール防止
 * - 開いた時に最初のフォーカス可能要素にフォーカス
 * - 閉じた時に元の場所にフォーカスを戻す
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  wcagLevel = 'AA',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // モーダルを開いた時の要素を記憶
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  // フォーカス管理と Esc キー処理
  useEffect(() => {
    if (!isOpen) return;

    // 背景スクロール防止
    document.body.style.overflow = 'hidden';

    // 最初のフォーカス可能要素にフォーカス
    const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements && focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Esc キーで閉じる
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // フォーカストラップ
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTab);

    return () => {
      // クリーンアップ
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);

      // 元の要素にフォーカスを戻す
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: { maxWidth: '400px', minHeight: '200px' },
    md: { maxWidth: '600px', minHeight: '300px' },
    lg: { maxWidth: '800px', minHeight: '400px' },
  };

  // WCAGレベルに応じたフォーカススタイル
  const focusStyles = {
    outline: `${accessibilityLevels.focus[wcagLevel].outlineWidth} solid ${accessibilityLevels.focus[wcagLevel].outline}`,
    outlineOffset: accessibilityLevels.focus[wcagLevel].outlineOffset,
  };

  return (
    <>
      {/* オーバーレイ */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.scale[4],
        }}
        onClick={onClose}
        aria-hidden="true"
      >
        {/* ダイアログ */}
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          style={{
            backgroundColor: primitive.white,
            borderRadius: radii.borderRadius.lg,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            width: '100%',
            ...sizeStyles[size],
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ヘッダー */}
          <div
            style={{
              padding: spacing.scale[6],
              borderBottom: `1px solid ${primitive.gray[200]}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h2
              id="modal-title"
              style={{
                margin: 0,
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.semibold,
                color: primitive.gray[900],
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="モーダルを閉じる"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                padding: 0,
                border: 'none',
                background: 'transparent',
                color: primitive.gray[500],
                cursor: 'pointer',
                fontSize: typography.fontSize['2xl'],
                lineHeight: 1,
                borderRadius: radii.borderRadius.sm,
                transition: 'background-color 0.2s ease, color 0.2s ease',
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
                e.currentTarget.style.backgroundColor = primitive.gray[100];
                e.currentTarget.style.color = primitive.gray[700];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = primitive.gray[500];
              }}
            >
              ×
            </button>
          </div>

          {/* コンテンツ */}
          <div
            style={{
              padding: spacing.scale[6],
              overflowY: 'auto',
              flex: 1,
              color: primitive.gray[700],
              lineHeight: typography.lineHeight.relaxed,
            }}
          >
            {children}
          </div>

          {/* フッター */}
          {footer && (
            <div
              style={{
                padding: spacing.scale[6],
                borderTop: `1px solid ${primitive.gray[200]}`,
                display: 'flex',
                gap: spacing.scale[3],
                justifyContent: 'flex-end',
              }}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
