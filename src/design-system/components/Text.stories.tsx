import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./Text";

/**
 * アクセシブルなテキストコンポーネント
 *
 * タイポグラフィトークンを使用したテキスト表示コンポーネントです。
 * セマンティックなHTML要素の選択と柔軟なスタイリングが可能です。
 */
const meta = {
  title: "Design System/Text",
  component: Text,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "body-large",
        "body",
        "body-small",
        "caption",
        "overline",
      ],
      description: "テキストのバリエーション",
    },
    as: {
      control: "text",
      description: "HTML要素のタグ",
    },
    color: {
      control: "color",
      description: "テキストの色",
    },
    align: {
      control: "select",
      options: ["left", "center", "right", "justify"],
      description: "テキストの配置",
    },
    bold: {
      control: "boolean",
      description: "太字にする",
    },
    italic: {
      control: "boolean",
      description: "イタリック体にする",
    },
    underline: {
      control: "boolean",
      description: "下線を引く",
    },
    strikethrough: {
      control: "boolean",
      description: "打ち消し線を引く",
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト（本文）
 */
export const Default: Story = {
  args: {
    children: "これは本文テキストです。",
  },
};

/**
 * すべての見出しレベル
 *
 * h1からh6までの見出しスタイルを確認できます。
 */
export const AllHeadings: Story = {
  args: {
    children: "",
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <Text variant="h1">見出し1 - ページタイトル</Text>
      <Text variant="h2">見出し2 - セクションタイトル</Text>
      <Text variant="h3">見出し3 - サブセクション</Text>
      <Text variant="h4">見出し4 - 小見出し</Text>
      <Text variant="h5">見出し5 - より小さい見出し</Text>
      <Text variant="h6">見出し6 - 最小の見出し</Text>
    </div>
  ),
};

/**
 * 本文のバリエーション
 *
 * 大きめ、標準、小さめの本文スタイルを確認できます。
 */
export const BodyVariants: Story = {
  args: {
    children: "",
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Text variant="body-large">
        大きめの本文テキストです。重要な説明文などに使用します。
      </Text>
      <Text variant="body">
        標準の本文テキストです。最も一般的に使用されるサイズです。
      </Text>
      <Text variant="body-small">
        小さめの本文テキストです。補足情報などに使用します。
      </Text>
    </div>
  ),
};

/**
 * キャプションとオーバーライン
 */
export const SpecialVariants: Story = {
  args: {
    children: "",
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Text variant="caption">キャプションテキスト - 画像の説明などに使用</Text>
      <Text variant="overline">OVERLINE TEXT - ラベルやカテゴリに使用</Text>
    </div>
  ),
};

/**
 * テキストの配置
 */
export const TextAlignment: Story = {
  args: {
    children: "",
  },
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "400px",
      }}
    >
      <Text align="left">左揃えのテキスト（デフォルト）</Text>
      <Text align="center">中央揃えのテキスト</Text>
      <Text align="right">右揃えのテキスト</Text>
      <Text align="justify">
        両端揃えのテキスト。長い文章の場合、左右の端が揃うように単語間のスペースが調整されます。
      </Text>
    </div>
  ),
};

/**
 * テキストの装飾
 */
export const TextDecorations: Story = {
  args: {
    children: "",
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Text>通常のテキスト</Text>
      <Text bold>太字のテキスト</Text>
      <Text italic>イタリック体のテキスト</Text>
      <Text underline>下線付きテキスト</Text>
      <Text strikethrough>打ち消し線付きテキスト</Text>
      <Text bold italic underline>
        太字 + イタリック + 下線の組み合わせ
      </Text>
    </div>
  ),
};

/**
 * カスタムカラー
 */
export const CustomColors: Story = {
  args: {
    children: "",
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Text color="#000000">黒色のテキスト</Text>
      <Text color="#2563eb">青色のテキスト</Text>
      <Text color="#dc2626">赤色のテキスト</Text>
      <Text color="#16a34a">緑色のテキスト</Text>
      <Text color="#9333ea">紫色のテキスト</Text>
    </div>
  ),
};

/**
 * セマンティックHTML要素の上書き
 *
 * variantとは異なるHTML要素を使用できます。
 * 見た目はh1だが、HTML要素はpタグを使いたい場合などに有用です。
 */
export const CustomElement: Story = {
  args: {
    children: "",
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <Text variant="h1">デフォルト（h1要素）</Text>
        <Text
          variant="body-small"
          color="#666"
          style={{ marginTop: "0.5rem" }}
        >
          HTMLタグ: &lt;h1&gt;
        </Text>
      </div>
      <div>
        <Text variant="h1" as="p">
          見た目はh1、実際はp要素
        </Text>
        <Text
          variant="body-small"
          color="#666"
          style={{ marginTop: "0.5rem" }}
        >
          HTMLタグ: &lt;p&gt;
        </Text>
      </div>
    </div>
  ),
};

/**
 * WCAGレベルの違い（A / AA / AAA）
 *
 * Webアクセシビリティガイドラインの3つの適合レベルについて説明します。
 */
export const WCAGLevels: Story = {
  args: {
    children: "",
  },
  render: () => (
    <div style={{ maxWidth: "800px" }}>
      <div
        style={{
          padding: "1rem",
          backgroundColor: "#eff6ff",
          borderRadius: "8px",
          border: "1px solid #bfdbfe",
          marginBottom: "1.5rem",
        }}
      >
        <Text variant="body" color="#1e3a8a">
          <strong>WCAG（Web Content Accessibility Guidelines）</strong>
          は、Webコンテンツをアクセシブルにするための国際的なガイドラインです。
          3つの適合レベル（A、AA、AAA）があり、レベルが上がるほど厳格な基準となります。
        </Text>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* レベルA */}
        <div
          style={{
            padding: "1.5rem",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            border: "2px solid #d1d5db",
          }}
        >
          <Text
            variant="h5"
            color="#111827"
            style={{ marginBottom: "0.5rem" }}
          >
            レベルA（最低限）
          </Text>
          <Text
            variant="body-small"
            color="#4b5563"
            style={{ marginBottom: "0.5rem" }}
          >
            コントラスト比: <strong>3:1</strong>（大きいテキストのみ）
          </Text>
          <Text
            variant="body-small"
            color="#4b5563"
            style={{ marginBottom: "1rem" }}
          >
            最も基本的なアクセシビリティ要件。これを満たさないと多くのユーザーがコンテンツにアクセスできない。
          </Text>
          <div
            style={{
              marginTop: "1rem",
              paddingTop: "1rem",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <Text
              variant="body-small"
              bold
              color="#374151"
              style={{ marginBottom: "0.5rem" }}
            >
              主な要件例：
            </Text>
            <ul
              style={{
                margin: 0,
                paddingLeft: "1.5rem",
                fontSize: "0.875rem",
                lineHeight: "1.625",
                color: "#4b5563",
              }}
            >
              <li>キーボードで操作可能</li>
              <li>画像に代替テキスト（alt属性）を提供</li>
              <li>動画に字幕を提供</li>
              <li>十分な時間を提供（自動更新の制御）</li>
            </ul>
          </div>
        </div>

        {/* レベルAA */}
        <div
          style={{
            padding: "1.5rem",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            border: "2px solid #60a5fa",
          }}
        >
          <Text
            variant="h5"
            color="#1d4ed8"
            style={{ marginBottom: "0.5rem" }}
          >
            レベルAA（推奨）⭐
          </Text>
          <Text
            variant="body-small"
            color="#4b5563"
            style={{ marginBottom: "0.5rem" }}
          >
            コントラスト比: <strong>4.5:1</strong>（通常テキスト）、
            <strong>3:1</strong>（大きいテキスト18px以上）
          </Text>
          <Text
            variant="body-small"
            color="#4b5563"
            style={{ marginBottom: "1rem" }}
          >
            ほとんどのWebサイトが目指すべき標準レベル。法律や規制で要求されることが多い（米国のADA、欧州のEAA、日本のJIS
            X 8341-3など）。
          </Text>
          <div
            style={{
              marginTop: "1rem",
              paddingTop: "1rem",
              borderTop: "1px solid #bfdbfe",
            }}
          >
            <Text
              variant="body-small"
              bold
              color="#1e40af"
              style={{ marginBottom: "0.5rem" }}
            >
              レベルAに加えて：
            </Text>
            <ul
              style={{
                margin: 0,
                paddingLeft: "1.5rem",
                fontSize: "0.875rem",
                lineHeight: "1.625",
                color: "#4b5563",
              }}
            >
              <li>十分なカラーコントラスト（4.5:1以上）</li>
              <li>テキストのリサイズ（200%まで拡大可能）</li>
              <li>キーボードフォーカスの視覚的表示</li>
              <li>明確な見出し構造（h1-h6）</li>
              <li>フォームのエラー識別と説明</li>
            </ul>
          </div>
        </div>

        {/* レベルAAA */}
        <div
          style={{
            padding: "1.5rem",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            border: "2px solid #4ade80",
          }}
        >
          <Text
            variant="h5"
            color="#15803d"
            style={{ marginBottom: "0.5rem" }}
          >
            レベルAAA（最高）
          </Text>
          <Text
            variant="body-small"
            color="#4b5563"
            style={{ marginBottom: "0.5rem" }}
          >
            コントラスト比: <strong>7:1</strong>（通常テキスト）、
            <strong>4.5:1</strong>（大きいテキスト18px以上）
          </Text>
          <Text
            variant="body-small"
            color="#4b5563"
            style={{ marginBottom: "1rem" }}
          >
            最も厳格なアクセシビリティ基準。公共機関、医療、金融、教育機関などで推奨。
            <strong>
              すべてのコンテンツでAAA達成は現実的でない場合が多い
            </strong>
            ため、重要な部分に適用することが推奨される。
          </Text>
          <div
            style={{
              marginTop: "1rem",
              paddingTop: "1rem",
              borderTop: "1px solid #bbf7d0",
            }}
          >
            <Text
              variant="body-small"
              bold
              color="#166534"
              style={{ marginBottom: "0.5rem" }}
            >
              レベルAAに加えて：
            </Text>
            <ul
              style={{
                margin: 0,
                paddingLeft: "1.5rem",
                fontSize: "0.875rem",
                lineHeight: "1.625",
                color: "#4b5563",
              }}
            >
              <li>非常に高いコントラスト比（7:1以上）</li>
              <li>音声のみのコンテンツに代替テキストを提供</li>
              <li>手話動画の提供</li>
              <li>より広い行間隔（1.5倍以上）</li>
              <li>専門用語の説明や読み方の提供</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 実用的な選び方 */}
      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          backgroundColor: "#fef9c3",
          borderRadius: "8px",
          border: "2px solid #fbbf24",
        }}
      >
        <Text variant="body-small" bold color="#92400e">
          💡 実用的な選び方
        </Text>
        <ul
          style={{
            margin: "0.5rem 0 0 0",
            paddingLeft: "1.5rem",
            fontSize: "0.875rem",
            lineHeight: "1.625",
          }}
        >
          <li>
            <strong>一般的なWebサイト</strong>: AA を目指す
          </li>
          <li>
            <strong>公共サービス、医療、金融</strong>: AAA を検討
          </li>
          <li>
            <strong>最低限</strong>: A は避け、少なくとも AA を満たす
          </li>
        </ul>
      </div>
    </div>
  ),
};

/**
 * 実用例
 *
 * 実際のページレイアウトでの使用例です。
 */
export const RealWorldExample: Story = {
  args: {
    children: "",
  },
  render: () => (
    <div style={{ maxWidth: "600px" }}>
      <Text variant="overline" color="#666">
        ニュース
      </Text>
      <Text variant="h2" style={{ marginTop: "0.5rem", marginBottom: "1rem" }}>
        アクセシビリティの重要性
      </Text>
      <Text variant="body" style={{ marginBottom: "1rem" }}>
        ウェブアクセシビリティは、障害の有無に関わらず、すべての人がウェブサイトを利用できるようにするための取り組みです。
      </Text>
      <Text variant="body" style={{ marginBottom: "1rem" }}>
        WCAG
        2.1では、知覚可能、操作可能、理解可能、堅牢という4つの原則が定義されています。
      </Text>
      <Text variant="caption" color="#666">
        公開日: 2025年1月15日
      </Text>
    </div>
  ),
};
