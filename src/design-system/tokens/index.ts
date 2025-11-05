/**
 * デザイントークン統合エクスポート
 *
 * デザインシステムの全トークンをここから参照できます
 */

// 各トークンを統合オブジェクトとしてエクスポート
export { colors, primitive } from './colors';
export { typography } from './typography';
export { spacing } from './spacing';
export { shadows } from './shadows';
export { radii } from './radii';
export { transitions } from './transitions';
export { accessibilityLevels } from './accessibility-levels';
export { breakpoints } from './breakpoints';
export { icons } from './icons';

// 個別のトークンも必要に応じて使用可能
export type { ColorTokens } from './colors';
export type { TypographyTokens } from './typography';
export type { SpacingTokens } from './spacing';
export type { ShadowTokens } from './shadows';
export type { RadiiTokens } from './radii';
export type { TransitionTokens } from './transitions';
export type { WCAGLevel, AccessibilityLevels } from './accessibility-levels';
export type { Breakpoints } from './breakpoints';
export type { IconTokens } from './icons';

// 統合オブジェクトとしてもエクスポート
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { shadows } from './shadows';
import { radii } from './radii';
import { transitions } from './transitions';
import { accessibilityLevels } from './accessibility-levels';
import { breakpoints } from './breakpoints';
import { icons } from './icons';

/**
 * すべてのデザイントークンを含むオブジェクト
 * 一括でインポートしたい場合に使用
 */
export const tokens = {
  colors,
  typography,
  spacing,
  shadows,
  radii,
  transitions,
  accessibilityLevels,
  breakpoints,
  icons,
} as const;

export type DesignTokens = typeof tokens;
