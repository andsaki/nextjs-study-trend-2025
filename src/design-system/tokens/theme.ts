/**
 * テーマトークン（Light/Dark Mode）
 *
 * ライトモードとダークモードのカラー定義
 * システムのprefers-color-schemeに対応し、ユーザーが手動で切り替えることも可能
 */

import { primitive } from './colors';

export type ThemeMode = 'light' | 'dark';

/**
 * ライトモード用カラー
 */
export const lightTheme = {
  background: {
    default: primitive.white,
    paper: primitive.gray[50],
    subtle: primitive.gray[100],
  },
  text: {
    primary: primitive.gray[900],
    secondary: primitive.gray[700],
    tertiary: primitive.gray[600],
    disabled: primitive.gray[400],
  },
  border: {
    default: primitive.gray[300],
    subtle: primitive.gray[200],
  },
} as const;

/**
 * ダークモード用カラー
 */
export const darkTheme = {
  background: {
    default: '#1a1a1a',
    paper: '#2d2d2d',
    subtle: '#242424',
  },
  text: {
    primary: '#ffffff',
    secondary: primitive.gray[300],
    tertiary: primitive.gray[400],
    disabled: primitive.gray[600],
  },
  border: {
    default: primitive.gray[700],
    subtle: primitive.gray[800],
  },
} as const;

/**
 * テーマの統合型
 */
export type Theme = typeof lightTheme | typeof darkTheme;

/**
 * テーマを取得する関数
 */
export const getTheme = (mode: ThemeMode): Theme => {
  return mode === 'light' ? lightTheme : darkTheme;
};

export const theme = {
  light: lightTheme,
  dark: darkTheme,
  getTheme,
} as const;
