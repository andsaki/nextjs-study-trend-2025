import React from 'react';
import { colors, spacing, typography, radii, accessibilityLevels } from '../tokens';
import type { WCAGLevel } from '../tokens';
import './Accordion.css';

export interface AccordionProps extends React.DetailsHTMLAttributes<HTMLDetailsElement> {
  children: React.ReactNode;
  className?: string;
  /** 初期状態で開いているか */
  defaultOpen?: boolean;
  /** WCAGアクセシビリティレベル (A/AA/AAA) @default 'AA' */
  wcagLevel?: WCAGLevel;
}

/**
 * アクセシブルなアコーディオンコンポーネント
 *
 * 機能:
 * - ネイティブの<details>/<summary>要素を使用
 * - キーボード操作完全対応（Enter、Space）
 * - スクリーンリーダー対応（自動的にaria属性が付与される）
 * - フォーカス表示
 * - スムーズなアニメーション
 */
export const Accordion: React.FC<AccordionProps> = ({
  children,
  className = '',
  defaultOpen = false,
  wcagLevel = 'AA',
  ...props
}) => {
  const accordionStyles: React.CSSProperties = {
    border: `1px solid ${colors.accordion.border}`,
    borderRadius: radii.borderRadius.md,
    backgroundColor: colors.accordion.bg,
    overflow: 'hidden',
  };

  // wcagLevelを子コンポーネントに渡すためのContext（簡易版）
  return (
    <details
      className={className}
      style={accordionStyles}
      open={defaultOpen}
      data-wcag-level={wcagLevel}
      {...props}
    >
      {children}
    </details>
  );
};

export interface AccordionSummaryProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

export const AccordionSummary: React.FC<AccordionSummaryProps> = ({
  children,
  className = '',
  ...props
}) => {
  // キーボード操作によるフォーカスかどうかを追跡
  const [isKeyboardFocus, setIsKeyboardFocus] = React.useState(false);
  const summaryRef = React.useRef<HTMLElement>(null);

  // 親のdetails要素からwcagLevelを取得
  const [wcagLevel, setWcagLevel] = React.useState<WCAGLevel>('AA');

  React.useEffect(() => {
    if (summaryRef.current) {
      const detailsElement = summaryRef.current.closest('details');
      const level = detailsElement?.getAttribute('data-wcag-level') as WCAGLevel;
      if (level) {
        setWcagLevel(level);
      }
    }
  }, []);

  // WCAGレベルに応じたフォーカススタイルを取得
  const levelFocus = accessibilityLevels.focus[wcagLevel];

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

  const summaryStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.scale[3],
    padding: `${spacing.scale[3]} ${spacing.scale[4]}`,
    cursor: 'pointer',
    listStyle: 'none',
    backgroundColor: colors.accordion.bg,
    color: colors.accordion.text,
    fontFamily: typography.fontFamily.base,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.normal,
    transition: 'background-color 0.2s ease',
    outline: 'none',
  };

  return (
    <summary
      ref={summaryRef}
      className={className}
      style={summaryStyles}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.accordion.bgHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = colors.accordion.bg;
      }}
      onFocus={(e) => {
        if (isKeyboardFocus) {
          e.currentTarget.style.backgroundColor = levelFocus.background;
          e.currentTarget.style.color = levelFocus.text;
          e.currentTarget.style.outline = `${levelFocus.outlineWidth} solid ${levelFocus.outline}`;
          e.currentTarget.style.outlineOffset = levelFocus.outlineOffset;
        }
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.backgroundColor = colors.accordion.bg;
        e.currentTarget.style.color = colors.accordion.text;
        e.currentTarget.style.outline = 'none';
        e.currentTarget.style.outlineOffset = '0';
        props.onBlur?.(e);
      }}
      {...props}
    >
      <AccordionIcon />
      <span style={{ flex: 1 }}>{children}</span>
    </summary>
  );
};

/** アコーディオンの開閉アイコン */
const AccordionIcon: React.FC = () => {
  const iconStyles: React.CSSProperties = {
    width: '24px',
    height: '24px',
    flexShrink: 0,
    color: colors.accordion.icon,
    transition: 'transform 0.3s ease',
  };

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={iconStyles}
      aria-hidden="true"
      className="accordion-icon"
    >
      <path
        d="M7 10L12 15L17 10H7Z"
        fill="currentColor"
      />
    </svg>
  );
};

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({
  children,
  className = '',
  ...props
}) => {
  const contentStyles: React.CSSProperties = {
    padding: `${spacing.scale[4]} ${spacing.scale[4]}`,
    backgroundColor: colors.accordion.bg,
    color: colors.accordion.text,
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.relaxed,
    borderTop: `1px solid ${colors.accordion.border}`,
  };

  return (
    <div
      className={className}
      style={contentStyles}
      {...props}
    >
      {children}
    </div>
  );
};
