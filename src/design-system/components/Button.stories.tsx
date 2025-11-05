import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

/**
 * アクセシブルなボタンコンポーネント
 *
 * WCAG 2.1 AA準拠のボタンコンポーネントです。
 * キーボード操作、スクリーンリーダー対応、適切なカラーコントラストを備えています。
 */
const meta = {
  title: 'Design System/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    // a11yアドオンの設定
    a11y: {
      config: {
        rules: [
          {
            // ボタンの名前が必須
            id: 'button-name',
            enabled: true,
          },
          {
            // カラーコントラスト
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
      description: 'ボタンのバリエーション',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'ボタンのサイズ',
    },
    wcagLevel: {
      control: 'select',
      options: ['A', 'AA', 'AAA'],
      description: 'WCAGアクセシビリティレベル',
    },
    isLoading: {
      control: 'boolean',
      description: 'ローディング状態',
    },
    disabled: {
      control: 'boolean',
      description: '無効化状態',
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * プライマリボタン（デフォルト）
 *
 * 主要なアクションに使用します。
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: '保存',
  },
};

/**
 * セカンダリボタン
 *
 * 副次的なアクションに使用します。
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'キャンセル',
  },
};

/**
 * アウトラインボタン
 *
 * 控えめなアクションに使用します。
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: '詳細を見る',
  },
};

/**
 * 小サイズ
 */
export const Small: Story = {
  args: {
    size: 'sm',
    children: '小さいボタン',
  },
};

/**
 * 中サイズ（デフォルト）
 */
export const Medium: Story = {
  args: {
    size: 'md',
    children: '普通のボタン',
  },
};

/**
 * 大サイズ
 */
export const Large: Story = {
  args: {
    size: 'lg',
    children: '大きいボタン',
  },
};

/**
 * ローディング状態
 *
 * 非同期処理中の状態を示します。
 * aria-busy属性でスクリーンリーダーに状態を伝えます。
 */
export const Loading: Story = {
  args: {
    isLoading: true,
    children: '送信中...',
  },
};

/**
 * 無効化状態
 *
 * ボタンが使用できない状態を示します。
 * aria-disabled属性でスクリーンリーダーに状態を伝えます。
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: '無効なボタン',
  },
};

/**
 * アイコン付きボタン
 *
 * アイコンは装飾的なのでaria-hidden="true"を設定しています。
 */
export const WithIcon: Story = {
  args: {
    icon: '🚀',
    children: 'ロケットを発射',
  },
};

/**
 * すべてのバリエーション
 *
 * 各バリエーションを並べて比較できます。
 */
export const AllVariants: Story = {
  args: {},
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
    </div>
  ),
};

/**
 * すべてのサイズ
 *
 * 各サイズを並べて比較できます。
 */
export const AllSizes: Story = {
  args: {},
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

/**
 * すべての状態
 *
 * 通常、ローディング、無効化の状態を比較できます。
 */
export const AllStates: Story = {
  args: {},
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button>通常</Button>
      <Button isLoading>ローディング</Button>
      <Button disabled>無効化</Button>
    </div>
  ),
};

/**
 * WCAGレベル比較
 *
 * A/AA/AAAの3つのアクセシビリティレベルを比較できます。
 * - レベルA: 最低限（大きいテキストのみ推奨）
 * - レベルAA: 標準（ほとんどのサイトで推奨）★
 * - レベルAAA: 最高（公共機関・医療・金融など）
 */
export const WCAGLevels: Story = {
  args: {},
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 'bold' }}>
          レベルA（最低限）
        </h3>
        <p style={{ marginBottom: '1rem', fontSize: '12px', color: '#666' }}>
          コントラスト比: 3:1 | 大きいテキストのみ推奨
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button wcagLevel="A" variant="primary">Primary</Button>
          <Button wcagLevel="A" variant="secondary">Secondary</Button>
          <Button wcagLevel="A" variant="outline">Outline</Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 'bold' }}>
          レベルAA（推奨）★
        </h3>
        <p style={{ marginBottom: '1rem', fontSize: '12px', color: '#666' }}>
          コントラスト比: 4.5:1 | ほとんどのサイトで推奨
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button wcagLevel="AA" variant="primary">Primary</Button>
          <Button wcagLevel="AA" variant="secondary">Secondary</Button>
          <Button wcagLevel="AA" variant="outline">Outline</Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 'bold' }}>
          レベルAAA（最高）
        </h3>
        <p style={{ marginBottom: '1rem', fontSize: '12px', color: '#666' }}>
          コントラスト比: 7:1 | 公共機関・医療・金融など
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button wcagLevel="AAA" variant="primary">Primary</Button>
          <Button wcagLevel="AAA" variant="secondary">Secondary</Button>
          <Button wcagLevel="AAA" variant="outline">Outline</Button>
        </div>
      </div>
    </div>
  ),
};

/**
 * フォーカス表示の比較
 *
 * 各WCAGレベルでのフォーカス表示の違いを確認できます。
 * Tabキーでフォーカスを移動して確認してください。
 */
export const FocusComparison: Story = {
  args: {},
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 'bold' }}>
          レベルA: 薄い青アウトライン（コントラスト比 3:1）
        </h3>
        <Button wcagLevel="A">フォーカスしてみてください</Button>
      </div>

      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 'bold' }}>
          レベルAA: 青背景 + 濃い青アウトライン（コントラスト比 4.5:1）
        </h3>
        <Button wcagLevel="AA">フォーカスしてみてください</Button>
      </div>

      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 'bold' }}>
          レベルAAA: 黄色背景 + 黒アウトライン（コントラスト比 19.56:1）
        </h3>
        <Button wcagLevel="AAA">フォーカスしてみてください</Button>
      </div>
    </div>
  ),
};

/**
 * キーボード操作の一覧
 *
 * キーボードのみでフォーカス表示が有効になる実装です。
 * マウスクリックではフォーカススタイルが表示されません。
 *
 * ## 操作方法
 * - **Tab**: 次のボタンにフォーカス移動
 * - **Shift + Tab**: 前のボタンにフォーカス移動
 * - **Enter または Space**: ボタンを実行
 * - **マウスクリック**: フォーカススタイルは表示されません
 *
 * ## 動作確認
 * 1. **右上の「Open canvas in new tab」ボタンをクリック**してキャンバスを新しいタブで開く
 * 2. マウスでボタンをクリック → フォーカススタイルは表示されない
 * 3. Tabキーでフォーカス移動 → WCAGレベルに応じたフォーカススタイルが表示される
 *
 * ※ Storybook内のiframeではTabキーが正しく動作しない場合があるため、
 *   新しいタブで開いて確認することを推奨します。
 */
export const KeyboardInteraction: Story = {
  args: {},
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{
        padding: '1rem',
        backgroundColor: '#fff3cd',
        borderRadius: '8px',
        marginBottom: '1rem',
        border: '2px solid #ffc107'
      }}>
        <h3 style={{ marginTop: 0, fontSize: '16px', fontWeight: 'bold', color: '#856404' }}>
          ⚠️ 動作確認方法
        </h3>
        <p style={{ margin: '0.5rem 0', fontSize: '14px', lineHeight: '1.6', color: '#856404' }}>
          Storybook内ではTabキーが正しく動作しない場合があります。<br />
          <strong>右上の「Open canvas in new tab」ボタンで新しいタブを開いて確認してください。</strong>
        </p>
      </div>

      <div style={{
        padding: '1rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        marginBottom: '1rem'
      }}>
        <h3 style={{ marginTop: 0, fontSize: '16px', fontWeight: 'bold' }}>
          💡 操作ヒント
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '14px', lineHeight: '1.8' }}>
          <li><strong>Tab</strong>: 次のボタンにフォーカス移動</li>
          <li><strong>Shift + Tab</strong>: 前のボタンにフォーカス移動</li>
          <li><strong>Enter または Space</strong>: ボタンを実行</li>
          <li><strong>マウスクリック</strong>: フォーカススタイルは表示されない</li>
        </ul>
      </div>

      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 'bold' }}>
          レベルA（最低限のフォーカス表示）
        </h3>
        <p style={{ marginBottom: '1rem', fontSize: '12px', color: '#666' }}>
          薄い青のアウトライン（2px）のみ
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button wcagLevel="A" variant="primary">Primary</Button>
          <Button wcagLevel="A" variant="secondary">Secondary</Button>
          <Button wcagLevel="A" variant="outline">Outline</Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 'bold' }}>
          レベルAA（推奨）★
        </h3>
        <p style={{ marginBottom: '1rem', fontSize: '12px', color: '#666' }}>
          薄い青背景 + 濃い青アウトライン（3px）+ オフセット（2px）
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button wcagLevel="AA" variant="primary">Primary</Button>
          <Button wcagLevel="AA" variant="secondary">Secondary</Button>
          <Button wcagLevel="AA" variant="outline">Outline</Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 'bold' }}>
          レベルAAA（最高レベル）
        </h3>
        <p style={{ marginBottom: '1rem', fontSize: '12px', color: '#666' }}>
          黄色背景 + 黒アウトライン（4px）+ オフセット（2px）
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button wcagLevel="AAA" variant="primary">Primary</Button>
          <Button wcagLevel="AAA" variant="secondary">Secondary</Button>
          <Button wcagLevel="AAA" variant="outline">Outline</Button>
        </div>
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
        borderLeft: '4px solid #2196f3'
      }}>
        <h4 style={{ marginTop: 0, fontSize: '14px', fontWeight: 'bold' }}>
          🎯 実装のポイント
        </h4>
        <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6' }}>
          このボタンは <code>:focus-visible</code> の動作を再現しています。
          マウスクリックでは視覚的なフォーカス表示を行わず、
          キーボード操作（Tab/Shift+Tab）時のみフォーカスインジケーターを表示します。
          これにより、キーボードユーザーには明確なフォーカス位置を示しながら、
          マウスユーザーには不要な視覚的ノイズを与えない設計になっています。
        </p>
      </div>
    </div>
  ),
};
