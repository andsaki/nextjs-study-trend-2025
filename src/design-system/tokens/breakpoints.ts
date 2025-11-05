/**
 * ブレークポイントトークン
 *
 * レスポンシブデザインのためのブレークポイント定義です。
 * モバイルファースト設計を採用し、小さい画面から大きい画面へと拡張します。
 *
 * なぜこれらの値？
 * 1. **業界標準**: Material Design、Bootstrap、Tailwind CSSなどが採用
 * 2. **実デバイスに基づく**: 実際のスマホ・タブレット・PCのサイズを考慮
 * 3. **モバイルファースト**: 小さい画面から設計し、段階的に拡張
 *
 * 使い方の原則:
 * - デフォルトはモバイル用のスタイル
 * - @media (min-width: ...) でより大きい画面用を追加
 * - デバイスではなく、コンテンツに応じて調整
 *
 * @example
 * // モバイルファーストのスタイル
 * const styles = {
 *   fontSize: '14px',
 *   '@media (min-width: 768px)': {
 *     fontSize: '16px',
 *   },
 * };
 */

// =====================================
// 1. ブレークポイントの値（px）
// =====================================

/**
 * ブレークポイントの数値定義
 *
 * 使い分けガイド:
 * - xs (0px〜): スマートフォン（縦）- 最小サイズ、デフォルト
 * - sm (640px〜): スマートフォン（横）・小型タブレット
 * - md (768px〜): タブレット（縦）
 * - lg (1024px〜): タブレット（横）・ノートPC
 * - xl (1280px〜): デスクトップPC
 * - 2xl (1536px〜): 大型デスクトップ・外部モニター
 *
 * 参考デバイス:
 * - iPhone 14 Pro: 393px × 852px
 * - iPad: 768px × 1024px
 * - MacBook Air: 1280px × 832px
 * - フルHD: 1920px × 1080px
 */
export const breakpointValues = {
  xs: 0, // モバイル（デフォルト）
  sm: 640, // 大きめのスマホ・小型タブレット
  md: 768, // タブレット
  lg: 1024, // 小型ノートPC・タブレット横
  xl: 1280, // デスクトップPC
  '2xl': 1536, // 大型デスクトップ
} as const;

// =====================================
// 2. メディアクエリ文字列
// =====================================

/**
 * メディアクエリ用の文字列
 *
 * CSSやstyled-componentsで直接使用できる形式
 *
 * @example
 * // CSS-in-JS
 * const styles = {
 *   fontSize: '14px',
 *   [breakpoints.media.md]: {
 *     fontSize: '16px',
 *   },
 * };
 *
 * @example
 * // styled-components
 * const Title = styled.h1`
 *   font-size: 24px;
 *
 *   ${breakpoints.media.md} {
 *     font-size: 32px;
 *   }
 * `;
 */
export const media = {
  xs: `@media (min-width: ${breakpointValues.xs}px)`,
  sm: `@media (min-width: ${breakpointValues.sm}px)`,
  md: `@media (min-width: ${breakpointValues.md}px)`,
  lg: `@media (min-width: ${breakpointValues.lg}px)`,
  xl: `@media (min-width: ${breakpointValues.xl}px)`,
  '2xl': `@media (min-width: ${breakpointValues['2xl']}px)`,
} as const;

/**
 * max-widthメディアクエリ（〜まで）
 *
 * 特定のサイズ以下でスタイルを適用したい場合に使用
 * 通常はモバイルファースト（min-width）を推奨
 *
 * @example
 * // タブレット以下でのみ表示
 * const styles = {
 *   [breakpoints.mediaMax.md]: {
 *     display: 'none',
 *   },
 * };
 */
export const mediaMax = {
  xs: `@media (max-width: ${breakpointValues.sm - 1}px)`, // 〜639px
  sm: `@media (max-width: ${breakpointValues.md - 1}px)`, // 〜767px
  md: `@media (max-width: ${breakpointValues.lg - 1}px)`, // 〜1023px
  lg: `@media (max-width: ${breakpointValues.xl - 1}px)`, // 〜1279px
  xl: `@media (max-width: ${breakpointValues['2xl'] - 1}px)`, // 〜1535px
} as const;

/**
 * 範囲指定メディアクエリ（〜から〜まで）
 *
 * 特定の範囲でのみスタイルを適用したい場合に使用
 *
 * @example
 * // タブレットサイズのみ
 * const styles = {
 *   [breakpoints.mediaOnly.md]: {
 *     padding: '2rem',
 *   },
 * };
 */
export const mediaOnly = {
  xs: `@media (max-width: ${breakpointValues.sm - 1}px)`, // 0〜639px
  sm: `@media (min-width: ${breakpointValues.sm}px) and (max-width: ${breakpointValues.md - 1}px)`, // 640〜767px
  md: `@media (min-width: ${breakpointValues.md}px) and (max-width: ${breakpointValues.lg - 1}px)`, // 768〜1023px
  lg: `@media (min-width: ${breakpointValues.lg}px) and (max-width: ${breakpointValues.xl - 1}px)`, // 1024〜1279px
  xl: `@media (min-width: ${breakpointValues.xl}px) and (max-width: ${breakpointValues['2xl'] - 1}px)`, // 1280〜1535px
  '2xl': `@media (min-width: ${breakpointValues['2xl']}px)`, // 1536px〜
} as const;

// =====================================
// 3. コンテナの最大幅
// =====================================

/**
 * コンテナの最大幅
 *
 * レイアウトコンテナの最大幅を定義
 * 画面サイズに応じて段階的に広がる
 *
 * @example
 * const Container = styled.div`
 *   max-width: ${breakpoints.container.md};
 *   margin: 0 auto;
 *   padding: 0 1rem;
 * `;
 */
export const container = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%',
} as const;

// =====================================
// 4. デバイスタイプ判定（参考用）
// =====================================

/**
 * デバイスタイプの定義（参考）
 *
 * 実際のコードでは使用せず、設計時の参考として利用
 * デバイスではなく、画面サイズで判断すること
 */
export const deviceReference = {
  mobile: {
    description: 'スマートフォン',
    range: '0px〜767px',
    breakpoints: ['xs', 'sm'],
    examples: ['iPhone 14', 'Pixel 7', 'Galaxy S23'],
  },
  tablet: {
    description: 'タブレット',
    range: '768px〜1023px',
    breakpoints: ['md'],
    examples: ['iPad', 'Galaxy Tab', 'Surface Go'],
  },
  desktop: {
    description: 'デスクトップPC・ノートPC',
    range: '1024px〜',
    breakpoints: ['lg', 'xl', '2xl'],
    examples: ['MacBook', 'iMac', 'Windows PC'],
  },
} as const;

// =====================================
// 統合エクスポート
// =====================================

export const breakpoints = {
  values: breakpointValues,
  media,
  mediaMax,
  mediaOnly,
  container,
  deviceReference,
} as const;

export type Breakpoints = typeof breakpoints;
