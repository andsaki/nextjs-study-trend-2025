/**
 * Border トークン
 *
 * 完全なボーダースタイルを提供します。
 *
 * 使い方:
 * - border: borders.default // "1px solid #e5e7eb"
 * - borderBottom: borders.thick // "3px solid #e5e7eb"
 *
 * カスタム色が必要な場合は、widthを使用:
 * - border: `${borders.width.thin} solid ${customColor}`
 */

import { primitive } from './colors';

export interface BorderTokens {
  // 完全なボーダー文字列（最も一般的な使い方）
  none: string;
  default: string;
  thick: string;
  thicker: string;
  dashed: string;
  dotted: string;

  // 幅のみ（カスタム色を使う場合）
  width: {
    none: string;
    thin: string;
    base: string;
    thick: string;
    thicker: string;
  };
}

export const borders: BorderTokens = {
  // 完全なボーダー（デフォルト色：グレー）
  none: 'none',
  default: `1px solid ${primitive.gray[300]}`,
  thick: `3px solid ${primitive.gray[300]}`,
  thicker: `4px solid ${primitive.gray[300]}`,
  dashed: `1px dashed ${primitive.gray[300]}`,
  dotted: `1px dotted ${primitive.gray[300]}`,

  // 幅のみ（後方互換性とカスタム色用）
  width: {
    none: '0',
    thin: '1px',
    base: '2px',
    thick: '3px',
    thicker: '4px',
  },
} as const;
