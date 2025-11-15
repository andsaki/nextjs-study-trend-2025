import React from 'react';
import { spacing } from '../tokens';

export type InfoBoxVariant = 'info' | 'warning' | 'success' | 'tip';

export interface InfoBoxProps {
  /** バリアント（色テーマ） */
  variant?: InfoBoxVariant;
  /** タイトル */
  title?: string;
  /** アイコン（絵文字など） */
  icon?: string;
  /** 子要素 */
  children: React.ReactNode;
  /** カスタムスタイル */
  style?: React.CSSProperties;
}

const variantStyles: Record<
  InfoBoxVariant,
  { bg: string; border: string; color: string }
> = {
  info: {
    bg: '#f0f9ff',
    border: '#bfdbfe',
    color: '#1e40af',
  },
  warning: {
    bg: '#fef3c7',
    border: '#fbbf24',
    color: '#92400e',
  },
  success: {
    bg: '#d1fae5',
    border: '#6ee7b7',
    color: '#065f46',
  },
  tip: {
    bg: '#f0f9ff',
    border: '#bfdbfe',
    color: '#1e40af',
  },
};

/**
 * 情報ボックスコンポーネント
 *
 * ヒントや警告などの情報を強調して表示するためのコンポーネント
 */
export const InfoBox: React.FC<InfoBoxProps> = ({
  variant = 'info',
  title,
  icon,
  children,
  style,
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      style={{
        padding: spacing.scale[4],
        backgroundColor: styles.bg,
        borderRadius: '8px',
        border: `1px solid ${styles.border}`,
        color: styles.color,
        ...style,
      }}
    >
      {(title || icon) && (
        <div
          style={{
            fontWeight: 600,
            marginBottom: spacing.scale[2],
            color: styles.color,
          }}
        >
          {icon && <span style={{ marginRight: spacing.scale[2] }}>{icon}</span>}
          {title}
        </div>
      )}
      <div style={{ lineHeight: 1.6 }}>{children}</div>
    </div>
  );
};
