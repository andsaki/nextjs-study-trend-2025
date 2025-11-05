import type { Meta, StoryObj } from '@storybook/react';
import { Form, formSchemas } from './Form';
import { z } from 'zod';

/**
 * アクセシブルなフォームコンポーネント
 *
 * WCAG 2.1 AA準拠のフォームコンポーネントです。
 * react-hook-form と Zod を統合し、バリデーション、エラー表示、アクセシビリティが統合されています。
 *
 * アクセシビリティ機能:
 * - Input コンポーネントを使用（WCAG レベル対応）
 * - `aria-invalid` でエラー状態を明示
 * - `aria-describedby` でエラーメッセージを関連付け
 * - `role="alert"` でエラーをスクリーンリーダーに通知
 * - 必須フィールドの明示（`required` 属性と視覚的な *）
 * - フォーカス管理（エラー時に最初のエラーフィールドへフォーカス）
 */
const meta = {
  title: 'Design System/Form',
  component: Form,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'react-hook-form + Zod統合フォームコンポーネント。バリデーション、エラー表示、アクセシビリティが統合されています。',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

// シンプルなログインフォームのスキーマ
const loginSchema = z.object({
  email: formSchemas.email,
  password: formSchemas.required('パスワード'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: Story = {
  args: {
    schema: loginSchema as any,
    fields: [
      {
        name: 'email',
        label: 'メールアドレス',
        type: 'email',
        placeholder: 'example@example.com',
        required: true,
      },
      {
        name: 'password',
        label: 'パスワード',
        type: 'password',
        placeholder: '••••••••',
        required: true,
      },
    ],
    onSubmit: ((data: LoginFormData) => {
      alert(`ログイン成功!\nEmail: ${data.email}`);
      console.log('Login data:', data);
    }) as any,
    submitText: 'ログイン',
  },
  parameters: {
    docs: {
      description: {
        story: 'シンプルなログインフォーム。メールアドレスとパスワードのバリデーションが含まれます。',
      },
    },
  },
};

// 会員登録フォームのスキーマ
const signupSchema = z.object({
  username: formSchemas.minLength(3, 'ユーザー名'),
  email: formSchemas.email,
  password: formSchemas.password,
  confirmPassword: formSchemas.required('パスワード（確認）'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export const SignupForm: Story = {
  args: {
    schema: signupSchema as any,
    fields: [
      {
        name: 'username',
        label: 'ユーザー名',
        type: 'text',
        placeholder: 'yamada_taro',
        helperText: '3文字以上で入力してください',
        required: true,
      },
      {
        name: 'email',
        label: 'メールアドレス',
        type: 'email',
        placeholder: 'example@example.com',
        required: true,
      },
      {
        name: 'password',
        label: 'パスワード',
        type: 'password',
        helperText: '8文字以上、大文字・小文字・数字を含む',
        required: true,
      },
      {
        name: 'confirmPassword',
        label: 'パスワード（確認）',
        type: 'password',
        required: true,
      },
    ],
    onSubmit: ((data: SignupFormData) => {
      alert(`会員登録成功!\nユーザー名: ${data.username}\nEmail: ${data.email}`);
      console.log('Signup data:', data);
    }) as any,
    submitText: '会員登録',
  },
  parameters: {
    docs: {
      description: {
        story: '複雑なバリデーションを含む会員登録フォーム。パスワードの強度チェックと確認フィールドの一致検証が含まれます。',
      },
    },
  },
};

// お問い合わせフォームのスキーマ
const contactSchema = z.object({
  name: formSchemas.required('お名前'),
  email: formSchemas.email,
  subject: formSchemas.required('件名'),
  message: formSchemas.minLength(10, 'お問い合わせ内容'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactForm: Story = {
  args: {
    schema: contactSchema as any,
    fields: [
      {
        name: 'name',
        label: 'お名前',
        type: 'text',
        placeholder: '山田 太郎',
        required: true,
      },
      {
        name: 'email',
        label: 'メールアドレス',
        type: 'email',
        placeholder: 'example@example.com',
        helperText: '返信先のメールアドレスを入力してください',
        required: true,
      },
      {
        name: 'subject',
        label: '件名',
        type: 'text',
        placeholder: 'お問い合わせの件名',
        required: true,
      },
      {
        name: 'message',
        label: 'お問い合わせ内容',
        type: 'text',
        placeholder: 'お問い合わせ内容を入力してください',
        helperText: '10文字以上で入力してください',
        required: true,
      },
    ],
    onSubmit: ((data: ContactFormData) => {
      alert(`お問い合わせを受け付けました!\n件名: ${data.subject}`);
      console.log('Contact data:', data);
    }) as any,
    submitText: '送信',
  },
  parameters: {
    docs: {
      description: {
        story: 'お問い合わせフォーム。複数のフィールドとヘルプテキストが含まれます。',
      },
    },
  },
};

// WCAGレベル比較
const simpleSchema = z.object({
  name: formSchemas.required('お名前'),
  email: formSchemas.email,
});

type SimpleFormData = z.infer<typeof simpleSchema>;

export const WCAGLevels: Story = {
  args: {
    schema: simpleSchema as any,
    fields: [],
    onSubmit: (() => {}) as any,
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      <div>
        <h3 style={{ marginBottom: '16px' }}>レベルA - 最小限のフォーカススタイル</h3>
        <Form
          schema={simpleSchema}
          fields={[
            { name: 'name', label: 'お名前', required: true },
            { name: 'email', label: 'メールアドレス', type: 'email', required: true },
          ]}
          onSubmit={(data: SimpleFormData) => console.log('Level A:', data)}
          wcagLevel="A"
          submitText="送信（レベルA）"
        />
      </div>

      <div>
        <h3 style={{ marginBottom: '16px' }}>レベルAA - 標準のフォーカススタイル（推奨）</h3>
        <Form
          schema={simpleSchema}
          fields={[
            { name: 'name', label: 'お名前', required: true },
            { name: 'email', label: 'メールアドレス', type: 'email', required: true },
          ]}
          onSubmit={(data: SimpleFormData) => console.log('Level AA:', data)}
          wcagLevel="AA"
          submitText="送信（レベルAA）"
        />
      </div>

      <div>
        <h3 style={{ marginBottom: '16px' }}>レベルAAA - 最大限のフォーカス表示</h3>
        <Form
          schema={simpleSchema}
          fields={[
            { name: 'name', label: 'お名前', required: true },
            { name: 'email', label: 'メールアドレス', type: 'email', required: true },
          ]}
          onSubmit={(data: SimpleFormData) => console.log('Level AAA:', data)}
          wcagLevel="AAA"
          submitText="送信（レベルAAA）"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'WCAGレベル（A/AA/AAA）によるフォーカススタイルの違い。Tabキーでフォーカスを移動して確認してください。',
      },
    },
  },
};

// サイズバリエーション
export const Sizes: Story = {
  args: {
    schema: simpleSchema as any,
    fields: [],
    onSubmit: (() => {}) as any,
  },
  render: () => {
    const sizeSchema = z.object({
      field: formSchemas.required('フィールド'),
    });

    type SizeFormData = z.infer<typeof sizeSchema>;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        <div>
          <h3 style={{ marginBottom: '16px' }}>Small</h3>
          <Form
            schema={sizeSchema}
            fields={[
              { name: 'field', label: 'フィールド', size: 'sm', required: true },
            ]}
            onSubmit={(data: SizeFormData) => console.log('Small:', data)}
            submitSize="sm"
            submitText="送信"
          />
        </div>

        <div>
          <h3 style={{ marginBottom: '16px' }}>Medium（デフォルト）</h3>
          <Form
            schema={sizeSchema}
            fields={[
              { name: 'field', label: 'フィールド', size: 'md', required: true },
            ]}
            onSubmit={(data: SizeFormData) => console.log('Medium:', data)}
            submitSize="md"
            submitText="送信"
          />
        </div>

        <div>
          <h3 style={{ marginBottom: '16px' }}>Large</h3>
          <Form
            schema={sizeSchema}
            fields={[
              { name: 'field', label: 'フィールド', size: 'lg', required: true },
            ]}
            onSubmit={(data: SizeFormData) => console.log('Large:', data)}
            submitSize="lg"
            submitText="送信"
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'フォームのサイズバリエーション（sm/md/lg）。フィールドとボタンのサイズを統一できます。',
      },
    },
  },
};

// バリデーションエラーの表示
export const ValidationErrors: Story = {
  args: {
    schema: signupSchema as any,
    fields: [
      {
        name: 'username',
        label: 'ユーザー名',
        helperText: '3文字以上で入力してください',
        required: true,
      },
      {
        name: 'email',
        label: 'メールアドレス',
        type: 'email',
        required: true,
      },
      {
        name: 'password',
        label: 'パスワード',
        type: 'password',
        helperText: '8文字以上、大文字・小文字・数字を含む',
        required: true,
      },
      {
        name: 'confirmPassword',
        label: 'パスワード（確認）',
        type: 'password',
        required: true,
      },
    ],
    onSubmit: ((data: SignupFormData) => {
      console.log('Form submitted:', data);
    }) as any,
    submitText: '送信',
  },
  parameters: {
    docs: {
      description: {
        story: 'バリデーションエラーの表示例。空欄で送信したり、無効な値を入力するとエラーメッセージが表示されます。エラーはaria-liveで支援技術にも伝達されます。',
      },
    },
  },
};

// ローディング状態
export const LoadingState: Story = {
  args: {
    schema: loginSchema as any,
    fields: [
      {
        name: 'email',
        label: 'メールアドレス',
        type: 'email',
        required: true,
      },
      {
        name: 'password',
        label: 'パスワード',
        type: 'password',
        required: true,
      },
    ],
    onSubmit: ((data: LoginFormData) => {
      console.log('Submitting:', data);
    }) as any,
    submitText: '送信中...',
    isSubmitting: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'フォーム送信中の状態。送信ボタンが無効化され、ローディング表示になります。',
      },
    },
  },
};

// 使用例とコードサンプル
export const UsageExample: Story = {
  args: {
    schema: simpleSchema as any,
    fields: [],
    onSubmit: (() => {}) as any,
  },
  render: () => {
    const exampleSchema = z.object({
      email: formSchemas.email,
      password: formSchemas.required('パスワード'),
    });

    type ExampleFormData = z.infer<typeof exampleSchema>;

    return (
      <div>
        <h3 style={{ marginBottom: '16px' }}>基本的な使い方</h3>
        <Form
          schema={exampleSchema}
          fields={[
            { name: 'email', label: 'メールアドレス', type: 'email', required: true },
            { name: 'password', label: 'パスワード', type: 'password', required: true },
          ]}
          onSubmit={(data: ExampleFormData) => {
            alert('送信成功!');
            console.log(data);
          }}
          submitText="送信"
        />

        <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '12px' }}>コード例</h4>
          <pre style={{ overflow: 'auto', fontSize: '14px' }}>
            {`import { Form, formSchemas } from './Form';
import { z } from 'zod';

// 1. Zodスキーマを定義
const schema = z.object({
  email: formSchemas.email,
  password: formSchemas.required('パスワード'),
});

type FormData = z.infer<typeof schema>;

// 2. フォームを使用
<Form
  schema={schema}
  fields={[
    { name: 'email', label: 'メールアドレス', type: 'email', required: true },
    { name: 'password', label: 'パスワード', type: 'password', required: true },
  ]}
  onSubmit={(data: FormData) => {
    console.log('送信データ:', data);
  }}
  submitText="送信"
/>`}
          </pre>
        </div>

        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#e6f7ff', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '12px' }}>機能</h4>
          <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
            <li><strong>Zodスキーマ統合</strong>: 型安全なバリデーション</li>
            <li><strong>react-hook-form</strong>: 高パフォーマンスなフォーム管理</li>
            <li><strong>アクセシブルなエラー表示</strong>: aria-invalid, aria-describedby, role="alert"</li>
            <li><strong>WCAGレベル対応</strong>: A/AA/AAA のフォーカススタイル</li>
            <li><strong>ヘルパースキーマ</strong>: よく使うバリデーションを簡単に利用</li>
          </ul>
        </div>

        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#fff7e6', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '12px' }}>ヘルパースキーマ</h4>
          <pre style={{ overflow: 'auto', fontSize: '14px' }}>
            {`formSchemas.email              // メールアドレス
formSchemas.required('名前')    // 必須項目
formSchemas.minLength(3, '名前') // 最小文字数
formSchemas.maxLength(100, '名前') // 最大文字数
formSchemas.password            // パスワード強度
formSchemas.url                 // URL
formSchemas.phone               // 電話番号`}
          </pre>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
### 使用方法

このコンポーネントは、react-hook-formとZodを統合したフォームコンポーネントです。

**メリット:**
- 型安全なバリデーション（Zod + TypeScript）
- 高パフォーマンス（react-hook-form）
- アクセシブルなエラー表示
- 再利用可能なスキーマ定義
- カスタマイズ可能なフィールド設定

**Props:**
- \`schema\`: Zodスキーマ（バリデーションルール）
- \`fields\`: フィールド設定配列
- \`onSubmit\`: 送信時のコールバック
- \`submitText\`: 送信ボタンのテキスト
- \`wcagLevel\`: WCAGレベル（A/AA/AAA）
- \`defaultValues\`: デフォルト値
- \`isSubmitting\`: 送信中の状態
        `,
      },
    },
  },
};
