import type { Meta, StoryObj } from "@storybook/react";
import { TextArea } from "./TextArea";
import { useState } from "react";

/**
 * アクセシブルなテキストエリアコンポーネント
 *
 * WCAG 2.1 AA準拠のテキストエリアです。
 * キーボード操作、スクリーンリーダー対応、エラー表示を備えています。
 */
const meta = {
  title: "Design System/TextArea",
  component: TextArea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "ラベルテキスト",
    },
    disabled: {
      control: "boolean",
      description: "無効化状態",
    },
    required: {
      control: "boolean",
      description: "必須項目",
    },
    error: {
      control: "text",
      description: "エラーメッセージ",
    },
    helpText: {
      control: "text",
      description: "ヘルプテキスト",
    },
    showCount: {
      control: "boolean",
      description: "文字数カウント表示",
    },
    maxLength: {
      control: "number",
      description: "最大文字数",
    },
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト
 */
export const Default: Story = {
  args: { label: "" } as any,
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div style={{ width: "400px" }}>
        <TextArea
          label="コメント"
          placeholder="コメントを入力してください"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

/**
 * ヘルプテキスト付き
 */
export const WithHelpText: Story = {
  args: { label: "" } as any,
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div style={{ width: "400px" }}>
        <TextArea
          label="お問い合わせ内容"
          helpText="できるだけ詳しくご記入ください"
          placeholder="お問い合わせ内容を入力してください"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

/**
 * 必須項目
 */
export const Required: Story = {
  args: { label: "" } as any,
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div style={{ width: "400px" }}>
        <TextArea
          label="自己紹介"
          required
          placeholder="自己紹介を入力してください"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

/**
 * エラー状態
 */
export const WithError: Story = {
  args: { label: "" } as any,
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div style={{ width: "400px" }}>
        <TextArea
          label="レビュー"
          error={!value ? "レビューの入力が必要です" : undefined}
          placeholder="レビューを入力してください"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

/**
 * 文字数カウント付き
 */
export const WithCharacterCount: Story = {
  args: { label: "" } as any,
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div style={{ width: "400px" }}>
        <TextArea
          label="ツイート"
          showCount
          maxLength={280}
          placeholder="いまどうしてる？"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

/**
 * 無効化状態
 */
export const Disabled: Story = {
  args: { label: "" } as any,
  render: () => (
    <div style={{ width: "400px" }}>
      <TextArea
        label="編集不可"
        disabled
        value="この内容は編集できません"
      />
    </div>
  ),
};

/**
 * カスタム高さ
 */
export const CustomHeight: Story = {
  args: { label: "" } as any,
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div style={{ width: "400px" }}>
        <TextArea
          label="長文テキスト"
          placeholder="長文を入力してください"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ minHeight: "200px" }}
        />
      </div>
    );
  },
};

/**
 * リサイズ不可
 */
export const NoResize: Story = {
  args: { label: "" } as any,
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div style={{ width: "400px" }}>
        <TextArea
          label="固定サイズ"
          placeholder="リサイズできません"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ resize: "none" }}
        />
      </div>
    );
  },
};

/**
 * 複数のテキストエリア
 */
export const MultipleTextAreas: Story = {
  args: { label: "" } as any,
  render: () => {
    const [values, setValues] = useState({
      title: "",
      description: "",
      notes: "",
    });

    return (
      <div style={{ width: "500px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <TextArea
          label="タイトル"
          placeholder="記事のタイトル"
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          style={{ minHeight: "80px" }}
        />
        <TextArea
          label="説明"
          required
          showCount
          maxLength={200}
          placeholder="記事の説明"
          value={values.description}
          onChange={(e) => setValues({ ...values, description: e.target.value })}
        />
        <TextArea
          label="備考"
          helpText="任意の追加情報を入力してください"
          placeholder="備考"
          value={values.notes}
          onChange={(e) => setValues({ ...values, notes: e.target.value })}
          style={{ minHeight: "150px" }}
        />
      </div>
    );
  },
};

/**
 * キーボード操作
 *
 * Tabキーでフォーカス移動ができます。
 */
export const KeyboardInteraction: Story = {
  args: { label: "" } as any,
  render: () => {
    const [value1, setValue1] = useState("");
    const [value2, setValue2] = useState("");
    const [value3, setValue3] = useState("");

    return (
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
            💡 操作方法
          </h3>
          <ul style={{ margin: 0, paddingLeft: "1.5rem", fontSize: "14px", lineHeight: "1.8" }}>
            <li><strong>Tab</strong>: 次のテキストエリアにフォーカス移動</li>
            <li><strong>Shift + Tab</strong>: 前のテキストエリアにフォーカス移動</li>
            <li><strong>マウスクリック</strong>: フォーカススタイルは表示されない</li>
          </ul>
        </div>

        <div style={{ width: "500px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <TextArea
            label="テキストエリア1"
            placeholder="最初のテキストエリア"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
          />
          <TextArea
            label="テキストエリア2"
            placeholder="2番目のテキストエリア"
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
          />
          <TextArea
            label="テキストエリア3"
            placeholder="3番目のテキストエリア"
            value={value3}
            onChange={(e) => setValue3(e.target.value)}
          />
        </div>
      </div>
    );
  },
};

/**
 * WCAGレベル比較
 *
 * A/AA/AAAの3つのアクセシビリティレベルのフォーカス表示の違いを確認できます。
 * Tabキーでフォーカスを移動して確認してください。
 */
export const WCAGLevels: Story = {
  args: {
    label: "",
  },
  render: () => {
    const [valueA, setValueA] = useState("");
    const [valueAA, setValueAA] = useState("");
    const [valueAAA, setValueAAA] = useState("");

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#fff3cd",
            borderRadius: "8px",
            marginBottom: "1rem",
            border: "2px solid #ffc107",
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: "16px", fontWeight: "bold" }}>
            ⚠️ 動作確認方法
          </h3>
          <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6" }}>
            Tabキーでフォーカスを移動すると、各WCAGレベルのフォーカス表示の違いを確認できます。
            マウスクリックではフォーカススタイルは表示されません。
          </p>
        </div>

        <div style={{ width: "500px" }}>
          <h3 style={{ marginBottom: "0.5rem", fontSize: "14px", fontWeight: "bold" }}>
            レベルA（最低限）
          </h3>
          <p style={{ marginBottom: "1rem", fontSize: "12px", color: "#666" }}>
            薄いアウトラインのみ
          </p>
          <TextArea
            label="レベルAのテキストエリア"
            wcagLevel="A"
            placeholder="テキストを入力..."
            value={valueA}
            onChange={(e) => setValueA(e.target.value)}
          />
        </div>

        <div style={{ width: "500px" }}>
          <h3 style={{ marginBottom: "0.5rem", fontSize: "14px", fontWeight: "bold" }}>
            レベルAA（推奨）⭐
          </h3>
          <p style={{ marginBottom: "1rem", fontSize: "12px", color: "#666" }}>
            背景色 + 太めのアウトライン
          </p>
          <TextArea
            label="レベルAAのテキストエリア"
            wcagLevel="AA"
            placeholder="テキストを入力..."
            value={valueAA}
            onChange={(e) => setValueAA(e.target.value)}
          />
        </div>

        <div style={{ width: "500px" }}>
          <h3 style={{ marginBottom: "0.5rem", fontSize: "14px", fontWeight: "bold" }}>
            レベルAAA（最高）
          </h3>
          <p style={{ marginBottom: "1rem", fontSize: "12px", color: "#666" }}>
            黄色背景 + 黒の太いアウトライン（最も目立つ）
          </p>
          <TextArea
            label="レベルAAAのテキストエリア"
            wcagLevel="AAA"
            placeholder="テキストを入力..."
            value={valueAAA}
            onChange={(e) => setValueAAA(e.target.value)}
          />
        </div>
      </div>
    );
  },
};
