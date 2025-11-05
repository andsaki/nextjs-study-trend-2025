/**
 * トランジショントークン
 *
 * アニメーションのタイミングと期間に関する定義
 * スムーズなユーザー体験を提供
 */

// =====================================
// トランジションデュレーション（持続時間）
// =====================================

/**
 * アニメーションの長さ
 * 短すぎず長すぎない、ちょうどよい時間
 */
export const duration = {
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  slower: '500ms',
} as const;

// =====================================
// イージング関数
// =====================================

/**
 * アニメーションの加速曲線
 * 自然な動きを表現
 */
export const easing = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  // カスタムイージング
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)', // Material Design標準
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// =====================================
// トランジションプロパティ
// =====================================

/**
 * よく使うトランジションのプリセット
 */
export const property = {
  all: 'all',
  colors: 'background-color, border-color, color, fill, stroke',
  opacity: 'opacity',
  shadow: 'box-shadow',
  transform: 'transform',
} as const;

// =====================================
// 完全なトランジション定義
// =====================================

/**
 * よく使う組み合わせをプリセット化
 */
export const preset = {
  // 基本的なトランジション
  default: `${property.all} ${duration.base} ${easing.easeInOut}`,

  // 色の変化（ホバーなど）
  colors: `${property.colors} ${duration.fast} ${easing.easeInOut}`,

  // フェードイン・アウト
  fade: `${property.opacity} ${duration.base} ${easing.easeInOut}`,

  // シャドウの変化
  shadow: `${property.shadow} ${duration.base} ${easing.easeOut}`,

  // トランスフォーム（スケール、移動など）
  transform: `${property.transform} ${duration.base} ${easing.smooth}`,

  // 速い変化（即座にフィードバック）
  fast: `${property.all} ${duration.fast} ${easing.easeOut}`,

  // ゆっくりした変化（目立たせたい時）
  slow: `${property.all} ${duration.slow} ${easing.easeInOut}`,
} as const;

// =====================================
// コンポーネント固有のトランジション
// =====================================

/**
 * コンポーネントごとの推奨トランジション
 */
export const component = {
  button: preset.colors,
  input: preset.colors,
  card: `${preset.shadow}, ${preset.transform}`,
  modal: preset.fade,
  dropdown: `${preset.fade}, ${preset.transform}`,
  tooltip: preset.fast,
} as const;

// =====================================
// 統合エクスポート
// =====================================

export const transitions = {
  duration,
  easing,
  property,
  preset,
  component,
} as const;

export type TransitionTokens = typeof transitions;
