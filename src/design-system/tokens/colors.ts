/**
 * カラートークン
 *
 * デザインシステムのカラーパレットを定義します。
 * 3層構造で管理しています：
 * 1. プリミティブトークン（基礎色）
 * 2. セマンティックトークン（意味付き色）
 * 3. コンポーネントトークン（用途特化色）
 */

// =====================================
// 1. プリミティブトークン（基礎色）
// =====================================

/**
 * 基礎となるカラーパレット
 *
 * プロジェクト全体で使用する色の基準値です。
 * 直接使用せず、セマンティックトークンの定義に使用してください。
 *
 * @example
 * // ❌ 直接使用しない
 * color: primitive.blue[500]
 *
 * // ✅ セマンティックトークン経由で使用
 * color: brand.primary  // 内部的にprimitive.blue[500]を参照
 */
export const primitive = {
  /**
   * グレースケール
   *
   * 用途:
   * - 50-200: 背景、微妙な区切り
   * - 300-400: ボーダー、プレースホルダー
   * - 500-600: 補助的なテキスト
   * - 700-900: 主要なテキスト
   *
   * アクセシビリティ:
   * - 700以上: 白背景に対してWCAG AA準拠（4.5:1以上）
   * - 600: やや薄いが、大きなテキスト（18px以上）ならAA準拠
   */
  gray: {
    50: '#fafafa', // ほぼ白、微妙な背景
    100: '#f5f5f5', // カード背景、セクション区切り
    200: '#eeeeee', // ホバー時の背景
    300: '#e0e0e0', // デフォルトボーダー
    400: '#bdbdbd', // プレースホルダー、無効化テキスト
    500: '#9e9e9e', // 補助テキスト（コントラスト比: 3.26:1 - AAA Large Text）
    600: '#757575', // 副次的なテキスト（コントラスト比: 4.55:1 - AA）
    700: '#616161', // 主要なテキスト（コントラスト比: 7.00:1 - AAA）
    800: '#424242', // 濃いテキスト（コントラスト比: 11.60:1 - AAA）
    900: '#212121', // 最も濃いテキスト（コントラスト比: 16.10:1 - AAA）
  },

  /**
   * ブルー（プライマリカラーのベース）
   *
   * 用途:
   * - 50-200: 背景、バッジ、情報表示
   * - 300-600: ボタン、リンク、アクティブ状態
   * - 700-900: ホバー、押下状態、濃いアクセント
   *
   * アクセシビリティ:
   * - 700以上: 白背景のテキストとして使用可能（AA準拠）
   * - 500-600: 大きな要素の背景色として使用
   * - 50-400: テキストには使用不可（コントラスト不足）
   */
  blue: {
    50: '#e3f2fd', // 情報バナーの背景
    100: '#bbdefb', // 選択状態の薄い背景
    200: '#90caf9', // ホバー時のアクセント
    300: '#64b5f6', // アクティブな要素
    400: '#42a5f5', // インタラクティブな要素
    500: '#2196f3', // プライマリカラー（デフォルト）
    600: '#1e88e5', // ホバー時の濃い色
    700: '#1976d2', // テキストとして使用可能（コントラスト比: 4.59:1）
    800: '#1565c0', // 強いアクセント（コントラスト比: 6.28:1）
    900: '#0d47a1', // 最も濃いアクセント（コントラスト比: 9.68:1）
  },

  // Red (Error/Danger)
  red: {
    50: '#ffebee',
    100: '#ffcdd2',
    200: '#ef9a9a',
    300: '#e57373',
    400: '#ef5350',
    500: '#f44336',
    600: '#e53935',
    700: '#d32f2f',
    800: '#c62828',
    900: '#b71c1c',
  },

  // Green (Success)
  green: {
    50: '#e8f5e9',
    100: '#c8e6c9',
    200: '#a5d6a7',
    300: '#81c784',
    400: '#66bb6a',
    500: '#4caf50',
    600: '#43a047',
    700: '#388e3c',
    800: '#2e7d32',
    900: '#1b5e20',
  },

  // Orange (Warning)
  orange: {
    50: '#fff3e0',
    100: '#ffe0b2',
    200: '#ffcc80',
    300: '#ffb74d',
    400: '#ffa726',
    500: '#ff9800',
    600: '#fb8c00',
    700: '#f57c00',
    800: '#ef6c00',
    900: '#e65100',
  },

  // Pink (Kind/Gentle theme)
  pink: {
    50: '#fce4ec',
    100: '#f8bbd0',
    200: '#f48fb1',
    300: '#f06292',
    400: '#ec407a',
    500: '#e91e63',
    600: '#d81b60',
    700: '#c2185b',
    800: '#ad1457',
    900: '#880e4f',
  },

  // White & Black
  white: '#ffffff',
  black: '#000000',

  // Yellow (Accessibility)
  // WCAGレベルAAAのフォーカス背景色として使用
  // コントラスト比: 19.56:1 (黒文字との組み合わせ)
  yellow: '#ffff00',
} as const;

// =====================================
// 2. セマンティックトークン（意味付き色）
// =====================================

/**
 * ブランドカラー
 *
 * プロダクトのアイデンティティを表す色です。
 * プロダクト全体で一貫して使用される主要な色を定義します。
 *
 * 命名規則:
 * - primary: メインカラー（ボタン、リンク、アクセントなど）
 * - secondary: セカンダリカラー（補助的な要素）
 * - Light/Dark: 明度のバリエーション（ホバー、アクティブ状態など）
 *
 * @example
 * // プライマリボタンの背景色
 * background-color: ${brand.primary}
 *
 * // ホバー時
 * background-color: ${brand.primaryDark}
 */
export const brand = {
  primary: primitive.blue[500], // メインのブランドカラー
  primaryLight: primitive.blue[300], // 薄いバリエーション
  primaryDark: primitive.blue[700], // 濃いバリエーション（ホバー時など）
  secondary: primitive.gray[700], // セカンダリカラー
  secondaryLight: primitive.gray[500], // 薄いセカンダリ
  secondaryDark: primitive.gray[900], // 濃いセカンダリ
} as const;

/**
 * テキストカラー
 *
 * すべての色が白背景に対してWCAG AA準拠（コントラスト比4.5:1以上）です。
 *
 * 使い分けガイド:
 * - primary: 本文、見出しなど主要なテキスト
 * - secondary: キャプション、説明文など副次的なテキスト
 * - tertiary: メタ情報、タイムスタンプなど補助的なテキスト
 * - disabled: 無効化された要素のテキスト（クリックできない）
 * - inverse: ダークな背景の上に表示する白いテキスト
 * - link: リンクテキスト（青色）
 * - error/success/warning: 状態を示すテキスト
 *
 * @example
 * // 本文のテキスト
 * color: ${text.primary}
 *
 * // 説明文
 * color: ${text.secondary}
 *
 * // リンク
 * color: ${text.link}
 * &:hover { color: ${text.linkHover} }
 */
export const text = {
  primary: primitive.gray[900], // 主要テキスト（コントラスト比: 16.10:1 - AAA）
  secondary: primitive.gray[700], // 副次的なテキスト（コントラスト比: 7.00:1 - AAA）
  tertiary: primitive.gray[600], // 補助テキスト（コントラスト比: 4.55:1 - AA）
  disabled: primitive.gray[400], // 無効化されたテキスト（意図的に薄い）
  inverse: primitive.white, // 反転テキスト（濃い背景上で使用）
  link: primitive.blue[700], // リンクテキスト（コントラスト比: 4.59:1 - AA）
  linkHover: primitive.blue[800], // リンクホバー時（より濃く）
  error: primitive.red[700], // エラーテキスト（コントラスト比: 5.14:1 - AA）
  success: primitive.green[700], // 成功テキスト（コントラスト比: 4.74:1 - AA）
  warning: primitive.orange[800], // 警告テキスト（コントラスト比: 5.93:1 - AA）
} as const;

/**
 * 背景カラー
 */
export const background = {
  default: primitive.white, // デフォルト背景
  paper: primitive.gray[50], // カード等の背景
  subtle: primitive.gray[100], // 微妙な背景
  hover: primitive.gray[100], // ホバー時の背景
  active: primitive.gray[200], // アクティブ時の背景
  disabled: primitive.gray[100], // 無効化時の背景
  overlay: 'rgba(0, 0, 0, 0.5)', // オーバーレイ
  dark: primitive.gray[900], // ダークモード用
} as const;

/**
 * ボーダーカラー
 */
export const border = {
  default: primitive.gray[300], // デフォルトボーダー
  subtle: primitive.gray[200], // 微妙なボーダー
  strong: primitive.gray[400], // 強調ボーダー
  hover: primitive.gray[400], // ホバー時
  focus: primitive.blue[500], // フォーカス時
  error: primitive.red[500], // エラー時
  success: primitive.green[500], // 成功時
  warning: primitive.orange[500], // 警告時
} as const;

/**
 * フォーカス表示用カラー
 * キーボードナビゲーション時のアクセシビリティを確保
 */
export const focus = {
  ring: primitive.blue[500], // フォーカスリング
  background: primitive.yellow, // 高コントラスト背景（黄色）
  outline: primitive.black, // アウトライン
  text: primitive.black, // テキスト（フォーカス時）
} as const;

/**
 * フィードバックカラー（状態表示）
 * アラート、通知、バナー等で使用
 */
export const feedback = {
  error: {
    bg: primitive.red[50],
    border: primitive.red[300],
    text: primitive.red[800],
    icon: primitive.red[600],
  },
  success: {
    bg: primitive.green[50],
    border: primitive.green[300],
    text: primitive.green[800],
    icon: primitive.green[600],
  },
  warning: {
    bg: primitive.orange[50],
    border: primitive.orange[300],
    text: primitive.orange[900],
    icon: primitive.orange[600],
  },
  info: {
    bg: primitive.blue[50],
    border: primitive.blue[300],
    text: primitive.blue[800],
    icon: primitive.blue[600],
  },
} as const;

// =====================================
// 3. コンポーネントトークン（用途特化色）
// =====================================

/**
 * ボタンコンポーネント用カラー
 *
 * 各バリアント（primary/secondary/outline）ごとに、
 * 状態（通常/hover/active/disabled）に応じた色を定義します。
 *
 * 命名規則:
 * - bg: 背景色
 * - text: テキスト色
 * - border: ボーダー色
 * - Hover: マウスホバー時
 * - Active: クリック/押下時
 * - Disabled: 無効化時
 *
 * @example
 * // プライマリボタンのスタイル
 * background-color: ${button.primary.bg};
 * color: ${button.primary.text};
 *
 * &:hover {
 *   background-color: ${button.primary.bgHover};
 * }
 *
 * &:disabled {
 *   background-color: ${button.primary.bgDisabled};
 *   color: ${button.primary.textDisabled};
 * }
 */
export const button = {
  /**
   * プライマリボタン
   * 最も重要なアクション（保存、送信、確定など）に使用
   */
  primary: {
    bg: brand.primary, // 背景: ブランドカラー
    bgHover: primitive.blue[600], // ホバー時: 少し濃く
    bgActive: primitive.blue[700], // 押下時: さらに濃く
    bgDisabled: primitive.gray[300], // 無効化時: グレー
    text: primitive.white, // テキスト: 白
    textDisabled: primitive.gray[500], // 無効化時テキスト: 薄いグレー
    border: brand.primary, // ボーダー: 背景と同色
    borderHover: primitive.blue[600], // ホバー時ボーダー
  },
  secondary: {
    bg: primitive.white,
    bgHover: primitive.gray[50],
    bgActive: primitive.gray[100],
    bgDisabled: primitive.gray[100],
    text: primitive.gray[700],
    textDisabled: primitive.gray[400],
    border: primitive.gray[300],
    borderHover: primitive.gray[400],
  },
  outline: {
    bg: 'transparent',
    bgHover: primitive.blue[50],
    bgActive: primitive.blue[100],
    bgDisabled: 'transparent',
    text: brand.primary,
    textDisabled: primitive.gray[400],
    border: brand.primary,
    borderHover: primitive.blue[600],
    borderDisabled: primitive.gray[300],
  },
  /**
   * デンジャーボタン
   * 危険なアクション（削除、破棄など）に使用
   */
  danger: {
    bg: primitive.red[600], // 背景: 赤
    bgHover: primitive.red[700], // ホバー時: 濃い赤
    bgActive: primitive.red[800], // 押下時: さらに濃く
    bgDisabled: primitive.gray[300], // 無効化時: グレー
    text: primitive.white, // テキスト: 白
    textDisabled: primitive.gray[500], // 無効化時テキスト: 薄いグレー
    border: primitive.red[600], // ボーダー: 背景と同色
    borderHover: primitive.red[700], // ホバー時ボーダー
  },
} as const;

/**
 * インプットコンポーネント用カラー
 */
export const input = {
  bg: primitive.white,
  bgDisabled: primitive.gray[100],
  text: primitive.gray[900],
  textDisabled: primitive.gray[500],
  placeholder: primitive.gray[400],
  border: primitive.gray[300],
  borderHover: primitive.gray[400],
  borderFocus: brand.primary,
  borderError: primitive.red[500],
  borderSuccess: primitive.green[500],
  label: primitive.gray[700],
  helperText: primitive.gray[600],
  errorText: primitive.red[700],
} as const;

/**
 * アコーディオンコンポーネント用カラー
 */
export const accordion = {
  bg: primitive.white,
  bgHover: primitive.gray[50],
  bgActive: primitive.gray[100],
  bgOpen: primitive.gray[50],
  border: primitive.gray[300],
  text: primitive.gray[900],
  icon: primitive.gray[600],
} as const;

/**
 * Breadcrumbsコンポーネント用カラー
 */
export const breadcrumbs = {
  text: primitive.gray[600],
  textCurrent: primitive.gray[900],
  link: primitive.blue[700],
  linkHover: primitive.blue[800],
  separator: primitive.gray[400],
} as const;

// =====================================
// 統合エクスポート
// =====================================

export const colors = {
  primitive,
  brand,
  text,
  background,
  border,
  focus,
  feedback,
  button,
  input,
  accordion,
  breadcrumbs,
} as const;

// =====================================
// ダークモードカラー
// =====================================

/**
 * ダークモード用のテキストカラー
 */
export const darkText = {
  primary: primitive.gray[50], // 主要テキスト（ほぼ白）
  secondary: primitive.gray[100], // 副次的なテキスト
  tertiary: primitive.gray[200], // 補助テキスト
  disabled: primitive.gray[600], // 無効化されたテキスト
  inverse: primitive.gray[900], // 反転テキスト（明るい背景上で使用）
  link: primitive.blue[400], // リンクテキスト
  linkHover: primitive.blue[300], // リンクホバー時
  error: primitive.red[400], // エラーテキスト
  success: primitive.green[400], // 成功テキスト
  warning: primitive.orange[400], // 警告テキスト
} as const;

/**
 * ダークモード用の背景カラー
 */
export const darkBackground = {
  default: primitive.gray[900], // デフォルト背景
  paper: primitive.gray[800], // カード等の背景
  subtle: primitive.gray[800], // 微妙な背景
  hover: primitive.gray[700], // ホバー時の背景
  active: primitive.gray[600], // アクティブ時の背景
  disabled: primitive.gray[800], // 無効化時の背景
  overlay: 'rgba(0, 0, 0, 0.7)', // オーバーレイ
  dark: primitive.black, // 最も暗い背景
} as const;

/**
 * ダークモード用のボーダーカラー
 */
export const darkBorder = {
  default: primitive.gray[700], // デフォルトボーダー
  subtle: primitive.gray[800], // 微妙なボーダー
  strong: primitive.gray[600], // 強調ボーダー
  hover: primitive.gray[600], // ホバー時
  focus: primitive.blue[500], // フォーカス時
  error: primitive.red[500], // エラー時
  success: primitive.green[500], // 成功時
  warning: primitive.orange[500], // 警告時
} as const;

/**
 * ダークモードカラーの統合
 */
export const darkColors = {
  primitive,
  brand, // ブランドカラーは共通
  text: darkText,
  background: darkBackground,
  border: darkBorder,
  focus, // フォーカスカラーは共通
  feedback, // フィードバックカラーは共通
  button, // ボタンカラーは共通（背景色が変わるので調整不要）
  input, // インプットカラーは共通
  accordion, // アコーディオンカラーは共通
  breadcrumbs, // パンくずカラーは共通
} as const;

export type ColorTokens = typeof colors;
export type DarkColorTokens = typeof darkColors;
