import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { colors as lightColors, darkColors } from '../tokens/colors';

/**
 * テーマのタイプ
 */
export type ThemeMode = 'light' | 'dark';

/**
 * テーマコンテキストの型
 */
export interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  colors: typeof lightColors | typeof darkColors;
}

/**
 * テーマコンテキスト
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProviderのProps
 */
export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeMode;
}

/**
 * ThemeProvider
 *
 * アプリケーション全体でテーマを管理するProvider
 *
 * 機能:
 * - ライトモード/ダークモードの切り替え
 * - localStorageに設定を保存
 * - システムの設定を自動検出
 *
 * @example
 * <ThemeProvider defaultTheme="light">
 *   <App />
 * </ThemeProvider>
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light',
}) => {
  // システムのテーマ設定を検出
  const getSystemTheme = (): ThemeMode => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // 初期テーマを決定（localStorage > defaultTheme > system）
  const getInitialTheme = (): ThemeMode => {
    if (typeof window === 'undefined') return defaultTheme;

    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    if (savedTheme) return savedTheme;

    return defaultTheme === 'light' ? getSystemTheme() : defaultTheme;
  };

  const [mode, setMode] = useState<ThemeMode>(getInitialTheme);

  // テーマが変更されたらlocalStorageに保存
  useEffect(() => {
    localStorage.setItem('theme', mode);

    // documentのdata属性を更新（CSS変数で使用可能）
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  // システムのテーマ設定変更を監視
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      // localStorageに保存されていない場合のみシステム設定に従う
      if (!localStorage.getItem('theme')) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    // Safari対応: addListenerとaddEventListenerの両方をサポート
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // 古いブラウザ向け
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  // テーマに応じてカラートークンを切り替え
  const colors = mode === 'light' ? lightColors : darkColors;

  const value: ThemeContextType = {
    mode,
    toggleTheme,
    setTheme,
    colors,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * useTheme
 *
 * テーマコンテキストを取得するカスタムフック
 *
 * @throws ThemeProvider外で使用した場合にエラー
 *
 * @example
 * const { mode, toggleTheme, colors } = useTheme();
 *
 * <button onClick={toggleTheme}>
 *   {mode === 'light' ? '🌙' : '☀️'}
 * </button>
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
