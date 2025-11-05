# Input コンポーネント

アクセシビリティに配慮した入力フィールドコンポーネント

## 基本的な使い方

```tsx
import { Input } from './design-system/components';

function App() {
  const [name, setName] = useState('');

  return (
    <Input
      label="お名前"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
}
```

## Props

| プロパティ | 型 | デフォルト | 説明 |
|----------|-----|----------|------|
| `label` | `string` | **必須** | ラベルテキスト |
| `error` | `string` | - | エラーメッセージ |
| `helperText` | `string` | - | ヘルプテキスト（説明文） |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 入力欄のサイズ |
| `required` | `boolean` | `false` | 必須項目かどうか |
| `disabled` | `boolean` | `false` | 無効化状態 |
| `id` | `string` | 自動生成 | input要素のID |

その他、標準の`<input>`要素のプロパティ（`type`, `placeholder`, `value`, `onChange`など）も使用可能です。

## 基本例

### シンプルな入力欄

```tsx
<Input
  label="メールアドレス"
  type="email"
  placeholder="example@example.com"
/>
```

### 必須項目

```tsx
<Input
  label="お名前"
  required
  placeholder="山田太郎"
/>
```

### ヘルプテキスト付き

```tsx
<Input
  label="パスワード"
  type="password"
  helperText="8文字以上の英数字を入力してください"
/>
```

### エラー表示

```tsx
const [email, setEmail] = useState('');
const [error, setError] = useState('');

const validate = () => {
  if (!/\S+@\S+\.\S+/.test(email)) {
    setError('正しいメールアドレスを入力してください');
  } else {
    setError('');
  }
};

<Input
  label="メールアドレス"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  onBlur={validate}
  error={error}
/>
```

## サイズ

```tsx
<Input label="小サイズ" size="sm" />
<Input label="中サイズ" size="md" />
<Input label="大サイズ" size="lg" />
```

## 状態

### 無効化状態

```tsx
<Input
  label="無効な入力欄"
  value="編集できません"
  disabled
  helperText="この項目は編集できません"
/>
```

## フォームでの使用

```tsx
function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const validateForm = () => {
    const newErrors = { email: '', password: '' };

    if (!formData.email) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '正しいメールアドレスを入力してください';
    }

    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください';
    } else if (formData.password.length < 8) {
      newErrors.password = 'パスワードは8文字以上で入力してください';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // フォーム送信処理
      console.log('送信データ:', formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="メールアドレス"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
        required
      />

      <Input
        label="パスワード"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        error={errors.password}
        helperText="8文字以上で入力してください"
        required
      />

      <button type="submit">ログイン</button>
    </form>
  );
}
```

## アクセシビリティ機能

### 1. ラベルとinputの関連付け

```tsx
// ✅ 正しい実装（自動で関連付け）
<Input label="お名前" />

// 内部実装:
// <label htmlFor="auto-generated-id">お名前</label>
// <input id="auto-generated-id" />
```

**利点:**
- スクリーンリーダーがラベルを読み上げ
- ラベルをクリックすると入力欄にフォーカス

### 2. エラーの適切な伝達

```tsx
<Input
  label="メールアドレス"
  error="正しいメールアドレスを入力してください"
/>
```

**内部実装:**
```tsx
<input
  aria-invalid={true}
  aria-describedby="input-id-error"
/>
<div
  id="input-id-error"
  role="alert"
  aria-live="polite"
>
  正しいメールアドレスを入力してください
</div>
```

**利点:**
- `aria-invalid`: 入力エラーをスクリーンリーダーに伝える
- `role="alert"`: エラーメッセージを即座に読み上げ
- `aria-live="polite"`: ユーザーの操作を邪魔せずに通知
- `aria-describedby`: エラーメッセージと入力欄を関連付け

### 3. 必須項目の明示

```tsx
<Input label="お名前" required />
```

**内部実装:**
```tsx
<label>
  お名前 <span aria-label="必須">*</span>
</label>
<input aria-required={true} required />
```

**利点:**
- 視覚的に「*」マークで必須を示す
- `aria-required`: スクリーンリーダーに必須項目を伝える
- `required`: HTML5のバリデーション

### 4. ヘルプテキストの関連付け

```tsx
<Input
  label="パスワード"
  helperText="8文字以上で入力してください"
/>
```

**内部実装:**
```tsx
<input aria-describedby="input-id-helper" />
<div id="input-id-helper">
  8文字以上で入力してください
</div>
```

**利点:**
- `aria-describedby`: ヘルプテキストと入力欄を関連付け
- スクリーンリーダーがフォーカス時にヘルプテキストを読み上げ

### 5. フォーカスインジケーター

- キーボード操作でフォーカスした際に、3pxのボーダーとシャドウで明確に表示
- WCAG 2.1の「2.4.7 フォーカスの可視化」に準拠

### 6. カラーコントラスト

- ラベル、入力テキスト: WCAG AA準拠（4.5:1以上）
- エラーメッセージ: 赤色 `#f44336`（コントラスト比 4.8:1）
- プレースホルダー: 適切なコントラスト

## ベストプラクティス

### ✅ 良い例

```tsx
// 明確なラベル
<Input label="メールアドレス" type="email" />

// エラー時にヘルプテキストを上書き
<Input
  label="パスワード"
  helperText="8文字以上"
  error={error || undefined}  // エラーがある場合のみ表示
/>

// 適切なtype属性
<Input label="電話番号" type="tel" />
<Input label="誕生日" type="date" />
<Input label="ウェブサイト" type="url" />
```

### ❌ 悪い例

```tsx
// ラベルなし（必ずlabelを指定）
<Input placeholder="お名前を入力" />  // ❌

// プレースホルダーをラベル代わりに使用
<Input label="" placeholder="メールアドレス" />  // ❌

// エラーとヘルプテキストを同時に表示
// （コンポーネント内部でエラー優先になっているが、混乱を招く可能性）
<Input
  label="入力欄"
  helperText="これはヘルプ"
  error="これはエラー"  // エラーのみ表示される
/>
```

## よくあるパターン

### リアルタイムバリデーション

```tsx
const [email, setEmail] = useState('');
const [error, setError] = useState('');

const validateEmail = (value: string) => {
  if (value && !/\S+@\S+\.\S+/.test(value)) {
    setError('正しいメールアドレスを入力してください');
  } else {
    setError('');
  }
};

<Input
  label="メールアドレス"
  type="email"
  value={email}
  onChange={(e) => {
    setEmail(e.target.value);
    validateEmail(e.target.value);
  }}
  error={error}
/>
```

### onBlurでのバリデーション

```tsx
const [password, setPassword] = useState('');
const [error, setError] = useState('');

<Input
  label="パスワード"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  onBlur={() => {
    if (password && password.length < 8) {
      setError('パスワードは8文字以上で入力してください');
    } else {
      setError('');
    }
  }}
  error={error}
  helperText="8文字以上で入力してください"
/>
```

### カスタムバリデーション

```tsx
const validateUsername = (value: string) => {
  if (!value) return 'ユーザー名を入力してください';
  if (value.length < 3) return 'ユーザー名は3文字以上で入力してください';
  if (!/^[a-zA-Z0-9_]+$/.test(value)) return '使用できるのは英数字とアンダースコアのみです';
  return '';
};

const [username, setUsername] = useState('');
const [error, setError] = useState('');

<Input
  label="ユーザー名"
  value={username}
  onChange={(e) => {
    setUsername(e.target.value);
    setError(validateUsername(e.target.value));
  }}
  error={error}
  helperText="3文字以上の英数字とアンダースコア"
/>
```

## デザイントークン

このコンポーネントは以下のデザイントークンを使用しています：

- **colors**: エラー色、ボーダー色、テキスト色
- **spacing**: パディング、マージン
- **typography**: フォントサイズ、フォントウェイト、行の高さ

カスタマイズする場合は、`src/design-system/tokens/` のファイルを編集してください。

## キーボード操作

| キー | 動作 |
|------|------|
| Tab | 次の入力欄にフォーカス移動 |
| Shift + Tab | 前の入力欄にフォーカス移動 |
| Enter | フォーム送信（form内の場合） |
| Esc | （ブラウザデフォルト） |

## スクリーンリーダーの読み上げ例

### 通常の入力欄

```
「お名前、編集、テキスト入力欄」
```

### 必須項目

```
「メールアドレス、必須、編集、テキスト入力欄」
```

### ヘルプテキスト付き

```
「パスワード、必須、編集、テキスト入力欄、8文字以上で入力してください」
```

### エラーあり

```
「メールアドレス、無効な入力、編集、テキスト入力欄」
「警告: 正しいメールアドレスを入力してください」
```

## 技術的な詳細

### useIdフック

React 18の`useId`フックを使用して、ユニークなIDを自動生成しています。

```tsx
const autoId = useId();  // "r:0:"のような値
const inputId = id || autoId;
```

これにより、同じページに複数のInputコンポーネントがあっても、IDの衝突を防ぎます。

### aria-describedbyの構築

エラーとヘルプテキストの両方がある場合、エラーを優先して表示します。

```tsx
const getAriaDescribedBy = () => {
  const ids: string[] = [];
  if (error) ids.push(errorId);
  if (helperText && !error) ids.push(helperId);
  return ids.length > 0 ? ids.join(' ') : undefined;
};
```

## 参考リンク

- [WCAG 2.1 - 3.3.1 エラーの特定](https://waic.jp/docs/WCAG21/#error-identification)
- [WCAG 2.1 - 3.3.2 ラベルまたは説明](https://waic.jp/docs/WCAG21/#labels-or-instructions)
- [ARIA Authoring Practices - Text Input](https://www.w3.org/WAI/ARIA/apg/patterns/input/)
- [MDN - input 要素](https://developer.mozilla.org/ja/docs/Web/HTML/Element/input)
- [MDN - label 要素](https://developer.mozilla.org/ja/docs/Web/HTML/Element/label)
