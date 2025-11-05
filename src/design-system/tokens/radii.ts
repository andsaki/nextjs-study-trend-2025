/**
 * ボーダー半径トークン
 *
 * 角の丸みに関する定義
 * コンポーネントの柔らかさを表現
 */

// =====================================
// 基本的なボーダー半径
// =====================================

/**
 * ボーダー半径のスケール
 */
export const borderRadius = {
  none: '0',
  sm: '0.125rem', // 2px
  base: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px', // 完全な円形
} as const;

// =====================================
// コンポーネント固有のボーダー半径
// =====================================

/**
 * ボタンの角丸
 */
export const button = {
  sm: borderRadius.md,
  md: borderRadius.lg,
  lg: borderRadius.xl,
} as const;

/**
 * インプットの角丸
 */
export const input = {
  sm: borderRadius.md,
  md: borderRadius.lg,
  lg: borderRadius.xl,
} as const;

/**
 * カードの角丸
 */
export const card = {
  sm: borderRadius.lg,
  md: borderRadius.xl,
  lg: borderRadius['2xl'],
} as const;

/**
 * その他のコンポーネント
 */
export const component = {
  badge: borderRadius.full,
  avatar: borderRadius.full,
  chip: borderRadius.full,
  modal: borderRadius['2xl'],
  dropdown: borderRadius.lg,
  tooltip: borderRadius.md,
} as const;

// =====================================
// 統合エクスポート
// =====================================

export const radii = {
  borderRadius,
  button,
  input,
  card,
  component,
} as const;

export type RadiiTokens = typeof radii;
