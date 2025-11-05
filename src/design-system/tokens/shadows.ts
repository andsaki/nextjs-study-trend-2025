/**
 * シャドウトークン
 *
 * ボックスシャドウで要素の「高さ（エレベーション）」を表現します。
 * Material Designの概念を参考にした階層構造です。
 *
 * エレベーション（Elevation）とは？
 * - UIの要素が「どれだけ浮いているか」を表現
 * - 影が濃い = より前面に表示されている
 * - 影が薄い = 背景に近い
 *
 * 使い分けガイド:
 * - none: 影なし（フラットデザイン）
 * - sm: ボタン、カード（少し浮いている）
 * - base/md: ドロップダウン、ツールチップ（中程度）
 * - lg: モーダルダイアログ（前面）
 * - xl/2xl: 最重要な要素（最前面）
 * - inner: 内側の影（押し込まれた感じ）
 *
 * アクセシビリティ:
 * - 影だけに頼らない（ボーダーや色でも区別）
 * - ハイコントラストモードでは影が消える場合がある
 *
 * @example
 * // カード
 * box-shadow: ${shadows.boxShadow.base};
 *
 * // ホバー時に浮かせる
 * &:hover {
 *   box-shadow: ${shadows.boxShadow.lg};
 * }
 */

// =====================================
// ボックスシャドウ
// =====================================

/**
 * ボックスシャドウ - エレベーション（高さ）の表現
 *
 * 複数の影を重ねることで、より自然な立体感を表現しています。
 * 一般的に、2つの影を組み合わせます：
 * 1. 上方向の影（要素の下に落ちる影）
 * 2. 拡散した柔らかい影（周囲全体のぼやけ）
 *
 * 影の濃さ:
 * - 薄い (rgba 0.05-0.1): 微妙な高さ
 * - 中程度 (rgba 0.1-0.15): 通常の高さ
 * - 濃い (rgba 0.2-0.25): 最前面
 *
 * @example
 * // ボタン（デフォルト状態）
 * box-shadow: ${boxShadow.sm};
 *
 * // ホバー時（浮き上がる）
 * &:hover {
 *   box-shadow: ${boxShadow.md};
 *   transform: translateY(-2px);
 * }
 */
export const boxShadow = {
  none: 'none', // 影なし（フラットデザイン）
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // 微妙な影（ボタン、小さいカード）
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', // 標準の影（カード）
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // 中程度（ドロップダウン）
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // 大きめ（モーダル）
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // とても大きい（ダイアログ）
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // 最大（最前面の要素）
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)', // 内側の影（押し込まれた感じ）
} as const;

/**
 * フォーカスリング
 *
 * キーボードナビゲーション時に、フォーカスされている要素を明確に示します。
 * WCAG 2.4.7（Focus Visible）に準拠するための重要な要素です。
 *
 * 要件:
 * - 最低3pxの幅（視認性確保）
 * - 背景や周囲の色と区別できる色
 * - アニメーションなし（点滅は避ける）
 *
 * 使い分け:
 * - default: 通常の要素（ボタン、リンクなど）
 * - error: エラー状態の要素（バリデーションエラー）
 * - success: 成功状態の要素（送信完了など）
 *
 * @example
 * // ボタンのフォーカススタイル
 * &:focus-visible {
 *   outline: none;
 *   box-shadow: ${focusRing.default};
 * }
 *
 * // エラー状態のインプット
 * &:focus-visible {
 *   box-shadow: ${focusRing.error};
 * }
 */
export const focusRing = {
  default: '0 0 0 3px rgba(66, 153, 225, 0.5)', // 青（標準）
  error: '0 0 0 3px rgba(245, 101, 101, 0.5)', // 赤（エラー）
  success: '0 0 0 3px rgba(72, 187, 120, 0.5)', // 緑（成功）
} as const;

/**
 * コンポーネント固有のシャドウ
 */
export const component = {
  card: boxShadow.base,
  cardHover: boxShadow.lg,
  dropdown: boxShadow.lg,
  modal: boxShadow['2xl'],
  button: boxShadow.sm,
  buttonHover: boxShadow.md,
} as const;

// =====================================
// 統合エクスポート
// =====================================

export const shadows = {
  boxShadow,
  focusRing,
  component,
} as const;

export type ShadowTokens = typeof shadows;
