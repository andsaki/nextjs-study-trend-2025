import type { Meta, StoryObj } from "@storybook/react";
import { Loading, InlineLoading } from "./Loading";
import { useState } from "react";
import { Button } from "./Button";

/**
 * アクセシブルなローディングスピナーコンポーネント
 *
 * WCAG 2.1 AA準拠のローディング表示です。
 * スクリーンリーダー対応、複数のサイズとカラーバリエーションを備えています。
 */
const meta = {
  title: "Design System/Loading",
  component: Loading,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "スピナーのサイズ",
    },
    color: {
      control: "select",
      options: ["primary", "secondary", "white"],
      description: "スピナーの色",
    },
    label: {
      control: "text",
      description: "ラベルテキスト",
    },
    fullscreen: {
      control: "boolean",
      description: "フルスクリーンオーバーレイ表示",
    },
  },
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト
 */
export const Default: Story = {
  args: {},
};

/**
 * サイズバリエーション
 */
export const Sizes: Story = {
  args: { label: "" } as any,
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
      <Loading size="sm" label="Small" />
      <Loading size="md" label="Medium" />
      <Loading size="lg" label="Large" />
      <Loading size="xl" label="XLarge" />
    </div>
  ),
};

/**
 * カラーバリエーション
 */
export const Colors: Story = {
  args: { label: "" } as any,
  render: () => (
    <div style={{ display: "flex", gap: "3rem" }}>
      <Loading color="primary" label="Primary" />
      <Loading color="secondary" label="Secondary" />
      <div style={{ backgroundColor: "#1976d2", padding: "2rem", borderRadius: "8px" }}>
        <Loading color="white" label="White" />
      </div>
    </div>
  ),
};

/**
 * ラベルなし
 */
export const NoLabel: Story = {
  args: { label: "" } as any,
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
      <Loading size="sm" label="" />
      <Loading size="md" label="" />
      <Loading size="lg" label="" />
      <Loading size="xl" label="" />
    </div>
  ),
};

/**
 * フルスクリーンオーバーレイ
 */
export const Fullscreen: Story = {
  args: { label: "" } as any,
  render: () => {
    const [isLoading, setIsLoading] = useState(false);

    return (
      <div>
        <Button
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 3000);
          }}
        >
          ローディングを表示（3秒間）
        </Button>
        {isLoading && <Loading fullscreen label="データを読み込んでいます..." />}
      </div>
    );
  },
};

/**
 * インラインローディング
 */
export const Inline: Story = {
  args: { label: "" } as any,
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
        <InlineLoading size="sm" color="primary" />
        <span>データを読み込んでいます...</span>
      </div>
      <div style={{ fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
        <InlineLoading size="md" color="primary" />
        <span>処理中です...</span>
      </div>
      <div style={{ fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
        <InlineLoading size="sm" color="secondary" />
        <span>保存しています...</span>
      </div>
    </div>
  ),
};

/**
 * ボタン内でのローディング
 */
export const InButton: Story = {
  args: { label: "" } as any,
  render: () => {
    const [isLoading, setIsLoading] = useState(false);

    return (
      <div style={{ display: "flex", gap: "1rem" }}>
        <Button
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 2000);
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <InlineLoading size="sm" color="primary" />
              送信中...
            </span>
          ) : (
            "送信"
          )}
        </Button>

        <Button variant="secondary">
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <InlineLoading size="sm" color="secondary" />
            読み込み中
          </span>
        </Button>
      </div>
    );
  },
};

/**
 * カード内でのローディング
 */
export const InCard: Story = {
  args: { label: "" } as any,
  render: () => {
    const [isLoading, setIsLoading] = useState(true);

    return (
      <div>
        <Button
          onClick={() => setIsLoading(!isLoading)}
          style={{ marginBottom: "1rem" }}
        >
          ローディング切り替え
        </Button>

        <div
          style={{
            width: "400px",
            minHeight: "200px",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fafafa",
          }}
        >
          {isLoading ? (
            <Loading size="lg" label="データを読み込んでいます..." />
          ) : (
            <div>
              <h3 style={{ marginTop: 0 }}>コンテンツ</h3>
              <p>データの読み込みが完了しました。</p>
            </div>
          )}
        </div>
      </div>
    );
  },
};

/**
 * 複数のローディング状態
 */
export const MultipleStates: Story = {
  args: { label: "" } as any,
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", width: "600px" }}>
      <div
        style={{
          padding: "1.5rem",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Loading size="md" label="" />
        <div>
          <h4 style={{ margin: 0, marginBottom: "0.5rem" }}>プロフィールを読み込んでいます</h4>
          <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
            ユーザー情報を取得しています...
          </p>
        </div>
      </div>

      <div
        style={{
          padding: "1.5rem",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Loading size="md" label="" color="secondary" />
        <div>
          <h4 style={{ margin: 0, marginBottom: "0.5rem" }}>画像をアップロード中</h4>
          <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
            ファイルを処理しています...
          </p>
        </div>
      </div>

      <div
        style={{
          padding: "1.5rem",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Loading size="md" label="" />
        <div>
          <h4 style={{ margin: 0, marginBottom: "0.5rem" }}>設定を保存中</h4>
          <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
            変更を適用しています...
          </p>
        </div>
      </div>
    </div>
  ),
};

/**
 * アクセシビリティ機能
 *
 * スクリーンリーダー対応のデモ
 */
export const Accessibility: Story = {
  args: { label: "" } as any,
  render: () => (
    <div>
      <div
        style={{
          padding: "1rem",
          backgroundColor: "#eff6ff",
          borderRadius: "8px",
          marginBottom: "1.5rem",
          border: "2px solid #3b82f6",
        }}
      >
        <h3 style={{ marginTop: 0, fontSize: "16px", fontWeight: "bold" }}>
          💡 アクセシビリティ機能
        </h3>
        <ul style={{ margin: 0, paddingLeft: "1.5rem", fontSize: "14px", lineHeight: "1.8" }}>
          <li><strong>role="status"</strong>: ローディング状態をスクリーンリーダーに通知</li>
          <li><strong>aria-label</strong>: ローディングの説明を提供</li>
          <li><strong>aria-live="polite"</strong>: 状態変化を穏やかに通知</li>
          <li><strong>視覚的フィードバック</strong>: アニメーションで処理中を明確に表示</li>
        </ul>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div>
          <h4>デフォルト（ラベル付き）</h4>
          <Loading label="データを読み込んでいます" />
        </div>

        <div>
          <h4>カスタムラベル</h4>
          <Loading label="画像を処理しています。しばらくお待ちください。" />
        </div>

        <div>
          <h4>ラベルなし（aria-labelのみ）</h4>
          <Loading label="" />
          <p style={{ fontSize: "12px", color: "#666", marginTop: "0.5rem" }}>
            ※ スクリーンリーダーには「読み込み中」と読み上げられます
          </p>
        </div>
      </div>
    </div>
  ),
};
