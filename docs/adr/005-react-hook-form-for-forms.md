# ADR 005: React Hook Formによるフォーム管理

## ステータス

採用 (Accepted)

## コンテキスト

Next.js App Routerを使用したTodoアプリケーションにおいて、フォームの状態管理とバリデーション方法を決定する必要がある。

### 技術的背景

Reactエコシステムには複数のフォームライブラリが存在する:

- **React Hook Form**: フックベース、非制御コンポーネント、パフォーマンス重視
- **Formik**: 老舗ライブラリ、制御コンポーネント、機能豊富
- **ネイティブReact (useState)**: 追加依存なし、手動実装が必要

### アプリケーション要件

本アプリケーションのフォーム要件:

1. **型安全性**: TypeScript + Zodスキーマによる厳密なバリデーション
2. **パフォーマンス**: 不要な再レンダリングを避ける
3. **ユーザー体験**: リアルタイムバリデーション、明確なエラー表示
4. **開発体験**: シンプルなAPI、ボイラープレート削減
5. **アクセシビリティ**: フォームコントロールとエラーの適切な関連付け

## 決定事項

**React Hook Form + Zod + @hookform/resolvers を採用し、フォーム管理を行う。**

すでにプロジェクトに導入済みであり、TodoFormとデザインシステムのFormコンポーネントで実装されている。

## 理由

### 1. 非制御コンポーネントによる高パフォーマンス

**問題**: 制御コンポーネントは入力のたびに再レンダリングが発生する。

```tsx
// ❌ useState のみの場合（制御コンポーネント）
function Form() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  // 入力のたびにコンポーネント全体が再レンダリング

  return (
    <input value={title} onChange={(e) => setTitle(e.target.value)} />
  )
}

// ✅ React Hook Form（非制御コンポーネント）
function Form() {
  const { register, handleSubmit } = useForm()
  // refを使った非制御コンポーネント、再レンダリング最小限

  return <input {...register('title')} />
}
```

**実装例** (`app/todos/TodoForm.tsx:17-29`):

```tsx
const {
  register,
  handleSubmit,
  formState: { errors },
  reset,
} = useForm<CreateTodoInput>({
  resolver: zodResolver(createTodoSchema),
  defaultValues: defaultValues || {
    title: "",
    description: "",
    priority: "medium",
  },
});
```

### 2. Zodスキーマによる型安全なバリデーション

**統合の利点**:

- スキーマからTypeScript型を自動生成
- サーバー側と同じバリデーションロジックを共有可能
- エラーメッセージの一元管理

```tsx
// スキーマ定義
const createTodoSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
})

// 型を自動生成
type CreateTodoInput = z.infer<typeof createTodoSchema>

// React Hook Formと統合
const { register } = useForm<CreateTodoInput>({
  resolver: zodResolver(createTodoSchema), // Zodでバリデーション
})
```

**実装例** (`app/todos/TodoForm.tsx:3-5`):

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTodoSchema, type CreateTodoInput, type Todo } from "@/lib/types/todo";
```

### 3. デザインシステムとの統合

**再利用可能なFormコンポーネント**: デザインシステムに2種類のFormコンポーネントを実装:

#### 3.1 宣言的Form (`src/design-system/components/Form.tsx:61-125`)

シンプルなフォーム向け、設定ベースで構築:

```tsx
<Form
  schema={loginSchema}
  fields={[
    { name: 'email', label: 'メールアドレス', type: 'email', required: true },
    { name: 'password', label: 'パスワード', type: 'password', required: true },
  ]}
  onSubmit={handleLogin}
  submitText="ログイン"
/>
```

#### 3.2 FormWithHook (`src/design-system/components/Form.tsx:145-163`)

複雑なフォーム向け、フルカスタマイズ可能:

```tsx
const form = useForm({ resolver: zodResolver(schema) })

<FormWithHook form={form} onSubmit={handleSubmit}>
  {({ register, formState: { errors } }) => (
    <>
      <Input {...register('title')} error={errors.title?.message} />
      <CustomComponent />
    </>
  )}
</FormWithHook>
```

### 4. register APIによるシンプルな統合

**スプレッド構文で簡単に統合**:

```tsx
// ❌ Formikの場合
<Input
  name="title"
  value={formik.values.title}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  error={formik.touched.title && formik.errors.title}
/>

// ✅ React Hook Formの場合
<Input
  {...register('title')}
  error={errors.title?.message}
/>
```

**実装例** (`app/todos/TodoForm.tsx:50-74`):

```tsx
<Input
  label="タイトル"
  required
  error={errors.title?.message}
  {...register("title")}
/>

<TextArea
  label="説明"
  rows={3}
  error={errors.description?.message}
  {...register("description")}
/>

<Select
  label="優先度"
  options={[
    { value: "low", label: "低" },
    { value: "medium", label: "中" },
    { value: "high", label: "高" },
  ]}
  {...register("priority")}
/>
```

### 5. よく使うバリデーションスキーマのヘルパー

**再利用可能なスキーマ** (`src/design-system/components/Form.tsx:166-181`):

```tsx
export const formSchemas = {
  email: z.string().email('有効なメールアドレスを入力してください'),
  required: (fieldName: string) => z.string().min(1, `${fieldName}は必須です`),
  minLength: (min: number, fieldName: string) =>
    z.string().min(min, `${fieldName}は${min}文字以上で入力してください`),
  maxLength: (max: number, fieldName: string) =>
    z.string().max(max, `${fieldName}は${max}文字以内で入力してください`),
  password: z.string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(/[A-Z]/, 'パスワードには大文字を含めてください')
    .regex(/[a-z]/, 'パスワードには小文字を含めてください')
    .regex(/[0-9]/, 'パスワードには数字を含めてください'),
  urlString: z.string().url('有効なURLを入力してください'),
  phone: z.string().regex(/^[0-9-]+$/, '電話番号は数字とハイフンのみで入力してください'),
};
```

### 6. アクセシビリティ

React Hook Formは自動的に:

- `name`属性を設定
- `ref`を適切に管理
- エラーメッセージとフォームコントロールを関連付け（`aria-describedby`）

デザインシステムのInputコンポーネントと組み合わせることで、WCAG準拠のフォームを構築可能。

### 7. TanStack Queryとの統合

**mutation時の連携** (`app/todos/TodoForm.tsx:16,31-34`):

```tsx
export function TodoForm({ onSubmit, onCancel, defaultValues, isLoading }: TodoFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: defaultValues || { title: "", description: "", priority: "medium" },
  });

  const onSubmitForm = (data: CreateTodoInput) => {
    onSubmit(data); // TanStack Queryのmutationを実行
    reset();        // フォームをリセット
  };

  return <form onSubmit={handleSubmit(onSubmitForm)}>...</form>
}
```

親コンポーネントでTanStack Queryのmutationと連携:

```tsx
function TodoCreatePage() {
  const createMutation = useCreateTodo()

  return (
    <TodoForm
      onSubmit={createMutation.mutate}
      isLoading={createMutation.isPending}
    />
  )
}
```

## ライブラリ比較

### React Hook Form vs Formik

| 項目 | React Hook Form | Formik |
|------|----------------|--------|
| **バンドルサイズ** | 8.5KB (gzip) | 15KB (gzip) |
| **パフォーマンス** | ⭐⭐⭐⭐⭐ 非制御コンポーネント | ⭐⭐⭐ 制御コンポーネント |
| **API** | シンプル（`register`, `handleSubmit`） | やや複雑（`formik.values`, `formik.handleChange`） |
| **Zodサポート** | 公式resolver（`@hookform/resolvers`） | サードパーティ連携 |
| **TypeScript** | ⭐⭐⭐⭐⭐ 優れた型推論 | ⭐⭐⭐⭐ 良好 |
| **学習曲線** | 緩やか | やや急 |
| **npm週間DL** | 8M+ (2025) | 2M+ (2025) |
| **メンテナンス** | ⭐⭐⭐⭐⭐ 活発 | ⭐⭐⭐ 減速傾向 |

### React Hook Form vs ネイティブReact (useState)

| 項目 | React Hook Form | useState |
|------|----------------|----------|
| **追加依存** | あり | なし |
| **ボイラープレート** | 少ない | 多い |
| **バリデーション** | Zod統合 | 手動実装 |
| **パフォーマンス** | 最適化済み | 手動最適化が必要 |
| **エラー管理** | 自動 | 手動実装 |
| **開発速度** | 速い | 遅い |

**useStateのみの実装例**:

```tsx
// ❌ 冗長で保守性が低い
function Form() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!title) newErrors.title = 'タイトルは必須です'
    if (title.length > 100) newErrors.title = '100文字以内で入力してください'
    // ...各フィールドのバリデーション
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({ title, description, priority })
    }
  }

  // 大量のボイラープレート...
}
```

## トレードオフ

### デメリット

1. **追加の依存関係**: `react-hook-form` + `@hookform/resolvers` のインストールが必要
2. **学習コスト**: `register`, `control`, `watch` などのAPIの理解が必要
3. **非制御コンポーネントの制約**: リアルタイムで値に基づくUIを動的に変更する場合は`watch`が必要

### メリット

1. **パフォーマンス**: 最小限の再レンダリング
2. **型安全性**: Zodスキーマとの完璧な統合
3. **開発速度**: ボイラープレート削減
4. **保守性**: 一貫したフォーム実装パターン
5. **エコシステム**: 豊富なサードパーティ連携

## 代替案

### 1. Formik

**却下理由**:
- バンドルサイズが大きい（15KB vs 8.5KB）
- パフォーマンスが劣る（制御コンポーネント）
- npmダウンロード数が減少傾向（2M/週 vs 8M/週）
- React Hook Formの方がモダンでシンプル

### 2. ネイティブReact (useState)

**却下理由**:
- ボイラープレートが膨大
- バリデーションロジックを手動実装
- エラー管理、タッチ状態の手動管理
- 小規模フォーム以外では開発・保守コストが高い

### 3. Remix Form / Server Actions のみ

**却下理由**:
- クライアント側のリアルタイムバリデーションが弱い
- ユーザー体験が劣る（サーバーラウンドトリップ必須）
- 本プロジェクトはクライアント側の操作性を重視

## 実装パターン

### パターン1: TodoFormのような専用フォーム

複雑なレイアウトやカスタムロジックが必要な場合:

```tsx
export function TodoForm({ onSubmit }: TodoFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('title')} error={errors.title?.message} />
      <TextArea {...register('description')} error={errors.description?.message} />
      <Select {...register('priority')} />
      <Button type="submit">作成</Button>
    </form>
  )
}
```

### パターン2: デザインシステムのFormコンポーネント

シンプルなフォームの場合:

```tsx
<Form
  schema={schema}
  fields={[
    { name: 'email', label: 'メールアドレス', type: 'email' },
    { name: 'password', label: 'パスワード', type: 'password' },
  ]}
  onSubmit={handleSubmit}
/>
```

## 結果

React Hook Form + Zodの採用により以下を実現:

1. ✅ 型安全なフォームバリデーション
2. ✅ 高パフォーマンス（非制御コンポーネント）
3. ✅ デザインシステムとの統合
4. ✅ TanStack Queryとのシームレスな連携
5. ✅ ボイラープレート削減、開発速度向上
6. ✅ 一貫したフォーム実装パターン

## 参考資料

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [@hookform/resolvers](https://github.com/react-hook-form/resolvers)
- [Performance Comparison](https://react-hook-form.com/advanced-usage#PerformanceComparison)

## 更新履歴

- 2025-11-11: 初版作成
