import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Input } from './Input';

/**
 * アクセシブルな入力フィールドコンポーネント
 *
 * WCAG 2.1 AA準拠の入力フィールドです。
 * ラベルとの関連付け、エラー表示、ヘルプテキストをサポートしています。
 */
const meta = {
  title: 'Design System/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    // a11yアドオンの設定
    a11y: {
      config: {
        rules: [
          {
            // ラベルが必須
            id: 'label',
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
    label: {
      control: 'text',
      description: 'ラベルテキスト（必須）',
    },
    error: {
      control: 'text',
      description: 'エラーメッセージ',
    },
    helperText: {
      control: 'text',
      description: 'ヘルプテキスト',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '入力欄のサイズ',
    },
    required: {
      control: 'boolean',
      description: '必須項目かどうか',
    },
    disabled: {
      control: 'boolean',
      description: '無効化状態',
    },
    wcagLevel: {
      control: 'select',
      options: ['A', 'AA', 'AAA'],
      description: 'WCAGアクセシビリティレベル',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的な入力欄
 */
export const Default: Story = {
  args: {
    label: 'お名前',
    placeholder: '山田太郎',
  },
};

/**
 * 必須項目
 *
 * required属性とaria-required属性が設定されます。
 */
export const Required: Story = {
  args: {
    label: 'メールアドレス',
    type: 'email',
    placeholder: 'example@example.com',
    required: true,
  },
};

/**
 * ヘルプテキスト付き
 *
 * aria-describedby属性でヘルプテキストと関連付けられます。
 */
export const WithHelperText: Story = {
  args: {
    label: 'パスワード',
    type: 'password',
    helperText: '8文字以上の英数字を入力してください',
    placeholder: '••••••••',
  },
};

/**
 * エラー状態
 *
 * role="alert"とaria-live="polite"でエラーが即座に読み上げられます。
 */
export const WithError: Story = {
  args: {
    label: 'メールアドレス',
    type: 'email',
    value: 'invalid-email',
    error: '正しいメールアドレスを入力してください',
  },
};

/**
 * エラー状態（ヘルプテキストあり）
 *
 * エラーがある場合、ヘルプテキストの代わりにエラーメッセージが表示されます。
 */
export const ErrorWithHelperText: Story = {
  args: {
    label: 'パスワード',
    type: 'password',
    value: 'short',
    helperText: '8文字以上で入力してください',
    error: 'パスワードは8文字以上で入力してください',
  },
};

/**
 * 小サイズ
 */
export const Small: Story = {
  args: {
    label: '小サイズ',
    size: 'sm',
    placeholder: '小さい入力欄',
  },
};

/**
 * 中サイズ（デフォルト）
 */
export const Medium: Story = {
  args: {
    label: '中サイズ',
    size: 'md',
    placeholder: '標準の入力欄',
  },
};

/**
 * 大サイズ
 */
export const Large: Story = {
  args: {
    label: '大サイズ',
    size: 'lg',
    placeholder: '大きい入力欄',
  },
};

/**
 * 無効化状態
 *
 * aria-disabled属性が設定されます。
 */
export const Disabled: Story = {
  args: {
    label: '無効な入力欄',
    value: '編集できません',
    disabled: true,
    helperText: 'この項目は編集できません',
  },
};

/**
 * 各種input type
 *
 * 様々なタイプの入力欄を表示します。
 */
export const InputTypes: Story = {
  args: {
    label: '',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input label="テキスト" type="text" placeholder="テキストを入力" />
      <Input label="メール" type="email" placeholder="example@example.com" />
      <Input label="パスワード" type="password" placeholder="••••••••" />
      <Input label="電話番号" type="tel" placeholder="090-1234-5678" />
      <Input label="URL" type="url" placeholder="https://example.com" />
      <Input label="数値" type="number" placeholder="0" />
      <Input label="日付" type="date" />
    </div>
  ),
};

/**
 * インタラクティブな例（制御されたコンポーネント）
 *
 * リアルタイムバリデーションのデモです。
 */
export const Interactive: Story = {
  args: {
    label: '',
  },
  render: () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (value: string) => {
      if (!value) {
        setError('メールアドレスを入力してください');
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        setError('正しいメールアドレスを入力してください');
      } else {
        setError('');
      }
    };

    return (
      <Input
        label="メールアドレス"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          validateEmail(e.target.value);
        }}
        error={error}
        helperText="ログイン時に使用します"
        required
      />
    );
  },
};

/**
 * フォームの例
 *
 * 複数の入力欄を組み合わせたフォームのデモです。
 */
export const FormExample: Story = {
  args: {
    label: '',
  },
  render: () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
    });

    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <Input
          label="お名前"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          label="メールアドレス"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          helperText="ログイン時に使用します"
          required
        />
        <Input
          label="パスワード"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          helperText="8文字以上の英数字を入力してください"
          required
        />
      </form>
    );
  },
};

/**
 * すべてのサイズ比較
 */
export const AllSizes: Story = {
  args: {
    label: '',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input label="小サイズ" size="sm" placeholder="小さい入力欄" />
      <Input label="中サイズ" size="md" placeholder="標準の入力欄" />
      <Input label="大サイズ" size="lg" placeholder="大きい入力欄" />
    </div>
  ),
};

/**
 * すべての状態比較
 */
export const AllStates: Story = {
  args: {
    label: '',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input label="通常" placeholder="テキストを入力" />
      <Input label="必須" placeholder="必須項目" required />
      <Input
        label="ヘルプテキスト"
        placeholder="テキストを入力"
        helperText="これはヘルプテキストです"
      />
      <Input
        label="エラー"
        value="invalid"
        error="エラーメッセージが表示されます"
      />
      <Input label="無効化" value="編集不可" disabled />
    </div>
  ),
};

/**
 * WCAGレベル比較
 *
 * A/AA/AAAの3つのアクセシビリティレベルを比較できます。
 * Tabキーでフォーカスを移動して、各レベルのフォーカススタイルを確認してください。
 */
export const WCAGLevels: Story = {
  args: {
    label: 'WCAG Levels',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div
        style={{
          padding: '1rem',
          backgroundColor: '#fff3cd',
          borderRadius: '8px',
          border: '2px solid #ffc107',
        }}
      >
        <h3 style={{ marginTop: 0, color: '#856404' }}>⚠️ テスト方法</h3>
        <p style={{ margin: '0.5rem 0', color: '#856404' }}>
          <strong>Tabキーでフォーカス移動</strong> → WCAGレベルに応じたフォーカススタイルが表示される
          <br />
          マウスクリックではフォーカススタイルは表示されません
        </p>
      </div>

      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 'bold' }}>
          レベルA（最低限のフォーカス表示）
        </h3>
        <p style={{ marginBottom: '1rem', fontSize: '12px', color: '#666' }}>
          薄い青のアウトライン（2px）+ 黒文字
        </p>
        <Input wcagLevel="A" label="お名前" placeholder="山田太郎" />
      </div>

      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 'bold' }}>
          レベルAA（推奨）★
        </h3>
        <p style={{ marginBottom: '1rem', fontSize: '12px', color: '#666' }}>
          薄い青背景 + 濃い青アウトライン（3px）+ 黒文字 + オフセット（2px）
        </p>
        <Input wcagLevel="AA" label="メールアドレス" type="email" placeholder="example@example.com" />
      </div>

      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 'bold' }}>
          レベルAAA（最高レベル）
        </h3>
        <p style={{ marginBottom: '1rem', fontSize: '12px', color: '#666' }}>
          黄色背景 + 黒アウトライン（4px）+ 黒文字 + オフセット（2px）
        </p>
        <Input wcagLevel="AAA" label="パスワード" type="password" placeholder="••••••••" />
      </div>
    </div>
  ),
};
