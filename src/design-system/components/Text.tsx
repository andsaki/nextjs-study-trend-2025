import React from "react";
import { colors, typography } from "../tokens";

export interface TextProps {
  /** テキストのバリエーション */
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body-large"
    | "body"
    | "body-small"
    | "caption"
    | "overline";
  /** HTML要素のタグ */
  as?: keyof React.JSX.IntrinsicElements;
  /** テキストの色 */
  color?: string;
  /** テキストの配置 */
  align?: "left" | "center" | "right" | "justify";
  /** 太字にする */
  bold?: boolean;
  /** イタリック体にする */
  italic?: boolean;
  /** 下線を引く */
  underline?: boolean;
  /** 打ち消し線を引く */
  strikethrough?: boolean;
  /** テキストの内容 */
  children: React.ReactNode;
  /** 追加のクラス名 */
  className?: string;
  /** 追加のスタイル */
  style?: React.CSSProperties;
}

/**
 * アクセシブルなテキストコンポーネント
 *
 * 機能:
 * - セマンティックなHTML要素の選択
 * - タイポグラフィトークンの適用
 * - 柔軟なスタイリング
 * - アクセシブルな色のコントラスト
 */
export const Text: React.FC<TextProps> = ({
  variant = "body",
  as,
  color = colors.text.primary,
  align = "left",
  bold = false,
  italic = false,
  underline = false,
  strikethrough = false,
  children,
  className,
  style: externalStyle,
}) => {
  // variantに応じたデフォルトのHTML要素を決定
  const defaultElement =
    variant === "h1"
      ? "h1"
      : variant === "h2"
      ? "h2"
      : variant === "h3"
      ? "h3"
      : variant === "h4"
      ? "h4"
      : variant === "h5"
      ? "h5"
      : variant === "h6"
      ? "h6"
      : variant === "caption" || variant === "overline"
      ? "span"
      : "p";

  // 実際に使用するHTML要素
  const Component = (as || defaultElement) as React.ElementType;

  // variantに応じたタイポグラフィスタイルを取得
  const getTypographyStyle = (): React.CSSProperties => {
    switch (variant) {
      case "h1":
        return typography.heading.h1;
      case "h2":
        return typography.heading.h2;
      case "h3":
        return typography.heading.h3;
      case "h4":
        return typography.heading.h4;
      case "h5":
        return typography.heading.h5;
      case "h6":
        return typography.heading.h6;
      case "body-large":
        return typography.body.large;
      case "body":
        return typography.body.base;
      case "body-small":
        return typography.body.small;
      case "caption":
        return typography.textStyle.caption;
      case "overline":
        return typography.textStyle.overline;
      default:
        return typography.body.base;
    }
  };

  const typographyStyle = getTypographyStyle();

  // スタイルの構築
  const styles: React.CSSProperties = {
    ...typographyStyle,
    color,
    textAlign: align,
    fontWeight: bold
      ? typography.fontWeight.bold
      : (typographyStyle.fontWeight as number),
    fontStyle: italic ? "italic" : "normal",
    textDecoration: underline
      ? "underline"
      : strikethrough
      ? "line-through"
      : "none",
    margin: 0, // デフォルトのマージンをリセット
    ...externalStyle,
  };

  return React.createElement(
    Component,
    {
      className,
      style: styles,
    },
    children
  );
};
