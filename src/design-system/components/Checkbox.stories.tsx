import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";
import { useState } from "react";

/**
 * アクセシブルなチェックボックスコンポーネント
 *
 * WCAG 2.1 AA準拠のチェックボックスです。
 * キーボード操作、スクリーンリーダー対応、エラー表示を備えています。
 */
const meta = {
  title: "Design System/Checkbox",
  component: Checkbox,
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
    indeterminate: {
      control: "boolean",
      description: "不確定状態",
    },
    error: {
      control: "text",
      description: "エラーメッセージ",
    },
    helpText: {
      control: "text",
      description: "ヘルプテキスト",
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト
 */
export const Default: Story = {
  args: { label: "" } as any,
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        label="利用規約に同意する"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    );
  },
};

/**
 * ヘルプテキスト付き
 */
export const WithHelpText: Story = {
  args: { label: "" } as any,
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        label="ニュースレターを購読する"
        helpText="最新情報やお得な情報をお届けします"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    );
  },
};

/**
 * エラー状態
 */
export const WithError: Story = {
  args: { label: "" } as any,
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        label="利用規約に同意する"
        error="利用規約への同意が必要です"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    );
  },
};

/**
 * 無効化状態
 */
export const Disabled: Story = {
  args: { label: "" } as any,
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Checkbox label="無効化（未チェック）" disabled={true} checked={false} />
      <Checkbox label="無効化（チェック済み）" disabled={true} checked={true} />
    </div>
  ),
};

/**
 * 不確定状態
 *
 * 親チェックボックスで子チェックボックスの一部のみが選択されている状態を表現します。
 */
export const Indeterminate: Story = {
  args: { label: "" } as any,
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        label="すべて選択"
        indeterminate={true}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        helpText="一部のアイテムが選択されています"
      />
    );
  },
};

/**
 * チェックボックスグループ
 *
 * 複数のチェックボックスをグループ化した例です。
 */
export const CheckboxGroup: Story = {
  args: { label: "" } as any,
  render: () => {
    const [items, setItems] = useState({
      option1: false,
      option2: false,
      option3: false,
    });

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Checkbox
          label="オプション1"
          checked={items.option1}
          onChange={(e) => setItems({ ...items, option1: e.target.checked })}
        />
        <Checkbox
          label="オプション2"
          checked={items.option2}
          onChange={(e) => setItems({ ...items, option2: e.target.checked })}
        />
        <Checkbox
          label="オプション3"
          checked={items.option3}
          onChange={(e) => setItems({ ...items, option3: e.target.checked })}
        />
      </div>
    );
  },
};

/**
 * 親子チェックボックス
 *
 * 親チェックボックスで子チェックボックスを一括選択できる例です。
 */
export const ParentChild: Story = {
  args: { label: "" } as any,
  render: () => {
    const [parent, setParent] = useState(false);
    const [children, setChildren] = useState({
      child1: false,
      child2: false,
      child3: false,
    });

    const allChecked = children.child1 && children.child2 && children.child3;
    const someChecked =
      (children.child1 || children.child2 || children.child3) && !allChecked;

    const handleParentChange = (checked: boolean) => {
      setParent(checked);
      setChildren({
        child1: checked,
        child2: checked,
        child3: checked,
      });
    };

    const handleChildChange = (key: keyof typeof children, checked: boolean) => {
      const newChildren = { ...children, [key]: checked };
      setChildren(newChildren);
      setParent(
        newChildren.child1 && newChildren.child2 && newChildren.child3
      );
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Checkbox
          label="すべて選択"
          checked={parent}
          indeterminate={someChecked}
          onChange={(e) => handleParentChange(e.target.checked)}
        />
        <div style={{ marginLeft: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Checkbox
            label="項目1"
            checked={children.child1}
            onChange={(e) => handleChildChange("child1", e.target.checked)}
          />
          <Checkbox
            label="項目2"
            checked={children.child2}
            onChange={(e) => handleChildChange("child2", e.target.checked)}
          />
          <Checkbox
            label="項目3"
            checked={children.child3}
            onChange={(e) => handleChildChange("child3", e.target.checked)}
          />
        </div>
      </div>
    );
  },
};

/**
 * キーボード操作
 *
 * Tabキーでフォーカス移動、Spaceキーでチェック切り替えができます。
 */
export const KeyboardInteraction: Story = {
  args: { label: "" } as any,
  render: () => {
    const [items, setItems] = useState({
      option1: false,
      option2: false,
      option3: false,
    });

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
            <li><strong>Tab</strong>: 次のチェックボックスにフォーカス移動</li>
            <li><strong>Shift + Tab</strong>: 前のチェックボックスにフォーカス移動</li>
            <li><strong>Space</strong>: チェックの切り替え</li>
            <li><strong>マウスクリック</strong>: フォーカススタイルは表示されない</li>
          </ul>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Checkbox
            label="オプション1"
            checked={items.option1}
            onChange={(e) => setItems({ ...items, option1: e.target.checked })}
          />
          <Checkbox
            label="オプション2"
            checked={items.option2}
            onChange={(e) => setItems({ ...items, option2: e.target.checked })}
          />
          <Checkbox
            label="オプション3"
            checked={items.option3}
            onChange={(e) => setItems({ ...items, option3: e.target.checked })}
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
    const [checkedA, setCheckedA] = useState(false);
    const [checkedAA, setCheckedAA] = useState(false);
    const [checkedAAA, setCheckedAAA] = useState(false);

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

        <div>
          <h3 style={{ marginBottom: "0.5rem", fontSize: "14px", fontWeight: "bold" }}>
            レベルA（最低限）
          </h3>
          <p style={{ marginBottom: "1rem", fontSize: "12px", color: "#666" }}>
            薄いアウトラインのみ
          </p>
          <Checkbox
            label="レベルAのチェックボックス"
            wcagLevel="A"
            checked={checkedA}
            onChange={(e) => setCheckedA(e.target.checked)}
          />
        </div>

        <div>
          <h3 style={{ marginBottom: "0.5rem", fontSize: "14px", fontWeight: "bold" }}>
            レベルAA（推奨）⭐
          </h3>
          <p style={{ marginBottom: "1rem", fontSize: "12px", color: "#666" }}>
            背景色 + 太めのアウトライン
          </p>
          <Checkbox
            label="レベルAAのチェックボックス"
            wcagLevel="AA"
            checked={checkedAA}
            onChange={(e) => setCheckedAA(e.target.checked)}
          />
        </div>

        <div>
          <h3 style={{ marginBottom: "0.5rem", fontSize: "14px", fontWeight: "bold" }}>
            レベルAAA（最高）
          </h3>
          <p style={{ marginBottom: "1rem", fontSize: "12px", color: "#666" }}>
            黄色背景 + 黒の太いアウトライン（最も目立つ）
          </p>
          <Checkbox
            label="レベルAAAのチェックボックス"
            wcagLevel="AAA"
            checked={checkedAAA}
            onChange={(e) => setCheckedAAA(e.target.checked)}
          />
        </div>
      </div>
    );
  },
};
