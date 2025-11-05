/**
 * タイポグラフィトークン
 *
 * フォント、文字サイズ、行高などの文字組みに関する定義
 * アクセシビリティとレスポンシブデザインを考慮しています
 */

// =====================================
// 1. フォントファミリー
// =====================================

/**
 * フォントファミリー（フォントスタック）
 *
 * システムフォントを優先し、高速な読み込みとネイティブな見た目を実現。
 * フォールバック順に並べ、ユーザーの環境で最適なフォントを自動選択します。
 *
 * なぜシステムフォント？
 * 1. 読み込み時間ゼロ（既にインストール済み）
 * 2. OSに最適化されたレンダリング
 * 3. ユーザーにとって見慣れた見た目
 *
 * フォールバック順序:
 * 1. -apple-system: iOS/macOS（最優先）
 * 2. BlinkMacSystemFont: macOS Chrome
 * 3. Segoe UI: Windows
 * 4. Roboto: Android
 * 5. Noto Sans JP: 日本語フォント
 * 6. sans-serif: 最後のフォールバック
 *
 * @example
 * font-family: ${fontFamily.base};
 */
export const fontFamily = {
  /**
   * ベースフォント
   * UI全体で使用する標準フォント
   */
  base: [
    '-apple-system', // iOS/macOS システムフォント
    'BlinkMacSystemFont', // macOS Chrome
    '"Segoe UI"', // Windows
    'Roboto', // Android
    '"Helvetica Neue"', // 古いmacOS
    'Arial', // クロスプラットフォーム
    '"Noto Sans JP"', // 日本語（Googleフォントで読み込む場合）
    'sans-serif', // 最終フォールバック
  ].join(', '),

  /**
   * 等幅フォント
   * コード表示に使用
   */
  mono: [
    'Menlo', // macOS
    'Monaco', // macOS（古い）
    '"Courier New"', // Windows
    'monospace', // 最終フォールバック
  ].join(', '),

  /**
   * セリフフォント
   * 長文の読み物などで使用（あまり使わない）
   */
  serif: [
    'Georgia', // クロスプラットフォーム
    '"Times New Roman"', // Windows
    'Times', // macOS
    'serif', // 最終フォールバック
  ].join(', '),
} as const;

// =====================================
// 2. フォントサイズ
// =====================================

/**
 * フォントサイズスケール
 *
 * なぜrem単位？
 * - ユーザーのブラウザ設定（文字サイズ）を尊重
 * - アクセシビリティの向上（拡大縮小が容易）
 * - レスポンシブデザインに最適
 *
 * 基準サイズ:
 * - 1rem = 16px（ブラウザのデフォルト）
 * - ユーザーが200%に設定 → 1rem = 32px に自動調整
 *
 * 最小サイズ:
 * - xs (12px) が最小
 * - これ以下は視認性が低下し、WCAG違反の可能性
 *
 * スケールの選び方:
 * - xs/sm: キャプション、メタ情報
 * - base: 本文（最も重要）
 * - lg/xl: 小見出し
 * - 2xl〜6xl: 大見出し、ヒーロー
 *
 * @example
 * // 本文
 * font-size: ${fontSize.base};  // 16px
 *
 * // 見出し
 * font-size: ${fontSize['3xl']};  // 30px
 */
export const fontSize = {
  xs: '0.75rem', // 12px - 最小サイズ（注釈、ラベルなど）
  sm: '0.875rem', // 14px - 小さい本文、キャプション
  base: '1rem', // 16px - 基準サイズ（本文）
  lg: '1.125rem', // 18px - 大きめの本文、小見出し
  xl: '1.25rem', // 20px - h6相当
  '2xl': '1.5rem', // 24px - h5相当
  '3xl': '1.875rem', // 30px - h4相当
  '4xl': '2.25rem', // 36px - h3相当
  '5xl': '3rem', // 48px - h2相当
  '6xl': '3.75rem', // 60px - h1相当、ヒーローテキスト
} as const;

// =====================================
// 3. フォントウェイト
// =====================================

/**
 * フォントの太さ
 * 日本語フォントでも適切に表示される値を選択
 */
export const fontWeight = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

// =====================================
// 4. 行高（Line Height）
// =====================================

/**
 * 行高（Line Height）
 *
 * WCAG 2.1 Success Criterion 1.4.8:
 * - 本文の行高は最低1.5以上推奨
 * - 段落の間隔は行高の1.5倍以上推奨
 *
 * 行高の選び方:
 * - 文字が大きい → 行高は詰める（tight/snug）
 *   理由: 大きい文字は目の移動が少ないため、詰めても読みやすい
 *
 * - 文字が小さい → 行高は広げる（normal/relaxed）
 *   理由: 小さい文字は行を見失いやすいため、間隔が必要
 *
 * 使い分けガイド:
 * - none (1.0): アイコンと並べる場合のみ（非推奨）
 * - tight (1.25): 大見出し（48px以上）
 * - snug (1.375): 中見出し（24px-48px）
 * - normal (1.5): 本文（16px前後）← 最重要
 * - relaxed (1.625): 長文、読みやすさ重視
 * - loose (2.0): 詩、短い文章の強調
 *
 * @example
 * // 本文
 * font-size: ${fontSize.base};
 * line-height: ${lineHeight.normal};  // 1.5
 *
 * // 見出し
 * font-size: ${fontSize['4xl']};
 * line-height: ${lineHeight.tight};  // 1.25
 */
export const lineHeight = {
  none: 1, // 特殊用途のみ（アイコン整列など）
  tight: 1.25, // 大見出し（48px以上）
  snug: 1.375, // 中見出し（24px-48px）
  normal: 1.5, // 本文（WCAG推奨の最小値）
  relaxed: 1.625, // 読みやすさ重視の本文
  loose: 2, // 詩、短文の強調
} as const;

// =====================================
// 5. レタースペーシング
// =====================================

/**
 * 文字間隔
 * 読みやすさを調整
 */
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

// =====================================
// 6. テキストスタイルプリセット
// =====================================

/**
 * 見出しスタイルのプリセット
 *
 * セマンティックなHTML要素（h1-h6）に対応した、
 * フォントサイズ・ウェイト・行高・字間の組み合わせです。
 *
 * デザイン原則:
 * - 大きい文字 = 狭い行高・詰めた字間（視認性重視）
 * - 小さい文字 = 広い行高・標準の字間（可読性重視）
 *
 * 使い方:
 * 1. HTML要素は意味に応じて選ぶ（h1はページに1つ）
 * 2. 見た目はこのプリセットで調整
 * 3. 必要に応じてカスタマイズ
 *
 * @example
 * // 見出しに適用
 * h1 {
 *   font-size: ${heading.h1.fontSize};
 *   font-weight: ${heading.h1.fontWeight};
 *   line-height: ${heading.h1.lineHeight};
 *   letter-spacing: ${heading.h1.letterSpacing};
 * }
 *
 * // または一括で
 * const H1 = styled.h1`
 *   ${heading.h1}
 * `;
 */
export const heading = {
  /**
   * H1 - ページタイトル
   * 最も大きく目立つ見出し（ページに1つ推奨）
   */
  h1: {
    fontSize: fontSize['5xl'], // 48px
    fontWeight: fontWeight.bold, // 700
    lineHeight: lineHeight.tight, // 1.25
    letterSpacing: letterSpacing.tight, // -0.025em（詰める）
  },
  h2: {
    fontSize: fontSize['4xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.normal,
  },
  h4: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.normal,
  },
  h5: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  h6: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
} as const;

/**
 * 本文のスタイル定義
 */
export const body = {
  large: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.relaxed,
  },
  base: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
  },
  small: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
  },
  xs: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
  },
} as const;

/**
 * その他のテキストスタイル
 */
export const textStyle = {
  caption: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
  },
  overline: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase' as const,
  },
  code: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
  },
} as const;

// =====================================
// 統合エクスポート
// =====================================

export const typography = {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  heading,
  body,
  textStyle,
} as const;

export type TypographyTokens = typeof typography;
