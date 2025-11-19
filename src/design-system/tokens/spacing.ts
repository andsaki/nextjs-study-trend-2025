/**
 * スペーシングトークン
 *
 * マージン、パディング、ギャップなどの余白に関する定義です。
 * 8pxグリッドシステムを基準とし、一貫性のあるレイアウトを実現します。
 *
 * なぜ8pxグリッド？
 * 1. **倍数で計算しやすい**: 8の倍数は2,4でも割り切れる
 * 2. **デザイナーとの共通言語**: Figma、Sketchなどでも標準
 * 3. **レティナディスプレイ対応**: 8px = 4dp（デザインポイント）
 * 4. **業界標準**: Material Design、Ant Designなど主要システムが採用
 *
 * 使い方の原則:
 * - 小さい余白（4px, 8px）: 関連する要素の間
 * - 中程度（16px, 24px）: セクション内の要素
 * - 大きい余白（32px以上）: セクション間、ページ構造
 *
 * @example
 * // コンポーネント内の余白
 * padding: ${spacing.scale[4]};  // 16px
 *
 * // セクション間の余白
 * margin-bottom: ${spacing.scale[12]};  // 48px
 */

// =====================================
// 1. 基本スペーシングスケール
// =====================================

/**
 * 基本スペーシングスケール
 *
 * 数値は8pxグリッドの倍数を表します（例: 4 = 4×4px = 16px）
 * 一部4px単位も含みます（より細かい調整用）
 *
 * 使い分けの目安:
 * - 0-2 (0-8px): アイコンとテキストの間隔、ボーダー内の余白
 * - 3-6 (12-24px): ボタン/インプットのパディング、カード内の余白
 * - 8-12 (32-48px): コンポーネント間の余白、セクション内の余白
 * - 16-24 (64-96px): セクション間の余白、ページレイアウト
 * - 32+ (128px+): 大きなレイアウト、ヒーローセクション
 *
 * @example
 * // ボタンのパディング
 * padding: ${scale[2]} ${scale[4]};  // 8px 16px
 *
 * // カード間の余白
 * gap: ${scale[6]};  // 24px
 *
 * // セクション間の余白
 * margin-bottom: ${scale[16]};  // 64px
 */
export const scale = {
  0: '0', // 余白なし
  0.5: '0.125rem', // 2px - 極小単位（outline offset等）
  0.75: '0.1875rem', // 3px - 微調整用（underline offset等）
  1: '0.25rem', // 4px - 最小単位
  2: '0.5rem', // 8px - 基本単位
  3: '0.75rem', // 12px - ボタンの縦パディング
  4: '1rem', // 16px - 標準の余白
  5: '1.25rem', // 20px - やや広めの余白
  6: '1.5rem', // 24px - カードのパディング
  8: '2rem', // 32px - セクション内の余白
  10: '2.5rem', // 40px - 中程度のセクション余白
  12: '3rem', // 48px - 大きめのセクション余白
  16: '4rem', // 64px - セクション間の余白
  20: '5rem', // 80px - 大きなセクション余白
  24: '6rem', // 96px - ページレイアウト
  32: '8rem', // 128px - 非常に大きな余白
  40: '10rem', // 160px - ヒーローセクション
  48: '12rem', // 192px - 特大の余白
  56: '14rem', // 224px - ランディングページ
  64: '16rem', // 256px - 最大の余白
} as const;

// =====================================
// 2. セマンティックスペーシング
// =====================================

/**
 * 意味を持ったスペーシング名
 * 用途に応じて使い分け
 */
export const semantic = {
  none: scale[0],
  xs: scale[1], // 4px
  sm: scale[2], // 8px
  md: scale[4], // 16px
  lg: scale[6], // 24px
  xl: scale[8], // 32px
  '2xl': scale[12], // 48px
  '3xl': scale[16], // 64px
  '4xl': scale[24], // 96px
} as const;

// =====================================
// 3. コンポーネント固有のスペーシング
// =====================================

/**
 * ボタンのスペーシング
 */
export const button = {
  paddingX: {
    sm: scale[3], // 12px
    md: scale[4], // 16px
    lg: scale[6], // 24px
  },
  paddingY: {
    sm: scale[2], // 8px
    md: scale[3], // 12px
    lg: scale[4], // 16px
  },
  gap: scale[2], // アイコンとテキストの間隔: 8px
} as const;

/**
 * インプットのスペーシング
 */
export const input = {
  paddingX: {
    sm: scale[3], // 12px
    md: scale[4], // 16px
    lg: scale[5], // 20px
  },
  paddingY: {
    sm: scale[2], // 8px
    md: scale[3], // 12px
    lg: scale[4], // 16px
  },
  gap: scale[2], // ラベルと入力欄の間隔: 8px
} as const;

/**
 * カードのスペーシング
 */
export const card = {
  padding: {
    sm: scale[4], // 16px
    md: scale[6], // 24px
    lg: scale[8], // 32px
  },
  gap: scale[4], // カード内要素の間隔: 16px
} as const;

/**
 * レイアウトのスペーシング
 */
export const layout = {
  container: {
    paddingX: scale[4], // 16px
    maxWidth: '1200px',
  },
  section: {
    paddingY: {
      sm: scale[8], // 32px
      md: scale[12], // 48px
      lg: scale[16], // 64px
    },
  },
  stack: {
    gap: {
      sm: scale[2], // 8px
      md: scale[4], // 16px
      lg: scale[6], // 24px
    },
  },
} as const;

// =====================================
// 統合エクスポート
// =====================================

export const spacing = {
  scale,
  semantic,
  button,
  input,
  card,
  layout,
} as const;

export type SpacingTokens = typeof spacing;
