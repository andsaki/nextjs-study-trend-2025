# Button コンポーネント

アクセシビリティに配慮したボタンコンポーネント

## 基本的な使い方

```tsx
import { Button } from './design-system/components';

function App() {
  return (
    <Button onClick={() => console.log('clicked')}>
      クリック
    </Button>
  );
}
```

## Props

| プロパティ | 型 | デフォルト | 説明 |
|----------|-----|----------|------|
| `variant` | `'primary' \| 'secondary' \| 'outline'` | `'primary'` | ボタンのバリエーション |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | ボタンのサイズ |
| `isLoading` | `boolean` | `false` | ローディング状態 |
| `icon` | `React.ReactNode` | - | テキストの前に表示するアイコン |
| `disabled` | `boolean` | `false` | 無効化状態 |

その他、標準の`<button>`要素のプロパティも使用可能です。

## バリエーション

### Primary（プライマリ）
主要なアクションに使用

```tsx
<Button variant="primary">
  保存
</Button>
```

### Secondary（セカンダリ）
副次的なアクションに使用

```tsx
<Button variant="secondary">
  キャンセル
</Button>
```

### Outline（アウトライン）
控えめなアクションに使用

```tsx
<Button variant="outline">
  詳細を見る
</Button>
```

## サイズ

```tsx
<Button size="sm">小さいボタン</Button>
<Button size="md">普通のボタン</Button>
<Button size="lg">大きいボタン</Button>
```

## 状態

### ローディング状態

```tsx
const [isLoading, setIsLoading] = useState(false);

<Button isLoading={isLoading} onClick={handleSubmit}>
  送信
</Button>
```

### 無効化状態

```tsx
<Button disabled>
  無効なボタン
</Button>
```

## アイコン付きボタン

```tsx
<Button icon="🚀">
  ロケットを発射
</Button>

<Button icon={<CustomIcon />}>
  カスタムアイコン
</Button>
```

## アクセシビリティ機能

### 1. キーボード操作
- **Tab**: フォーカス移動
- **Enter / Space**: ボタンをクリック
- フォーカス時に視覚的なインジケーター（青い枠）を表示

### 2. スクリーンリーダー対応
- `aria-busy`: ローディング状態をスクリーンリーダーに伝える
- `aria-disabled`: 無効化状態を明示的に伝える
- `role="status"`: ローディングアイコンの役割を示す
- `aria-label`: ローディング状態の説明（「読み込み中」）
- `aria-hidden="true"`: 装飾的なアイコンをスクリーンリーダーから隠す

### 3. カラーコントラスト
WCAG AA準拠のカラーコントラスト比（4.5:1以上）を確保

### 4. フォーカス表示
- デフォルトのアウトラインではなく、カスタムのフォーカススタイルを使用
- 3pxの青いボックスシャドウで視認性を確保

### 5. 視覚的フィードバック
- ホバー、フォーカス、無効化など、状態に応じた視覚的なフィードバック
- トランジションアニメーションで滑らかな状態変化

## ベストプラクティス

### ✅ 良い例

```tsx
// 明確なラベル
<Button>保存する</Button>

// ローディング状態の適切な使用
<Button isLoading={isSubmitting} onClick={handleSubmit}>
  送信
</Button>

// 適切なバリエーションの使用
<Button variant="primary">保存</Button>
<Button variant="secondary">キャンセル</Button>
```

### ❌ 悪い例

```tsx
// 曖昧なラベル
<Button>OK</Button>

// アイコンのみ（テキストなし）
<Button icon="✕" />  // スクリーンリーダーユーザーには意味不明

// type属性の誤用
<Button type="submit" onClick={handleClick}>送信</Button>  // formの外で使用
```

## デザイントークン

このコンポーネントは以下のデザイントークンを使用しています：

- **colors**: `src/design-system/tokens/colors.ts`
- **spacing**: `src/design-system/tokens/spacing.ts`
- **typography**: `src/design-system/tokens/typography.ts`

カスタマイズする場合は、これらのトークンファイルを編集してください。

## 実装例

### フォームの送信ボタン

```tsx
function Form() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form>
      {/* フォームフィールド */}
      <Button
        type="submit"
        isLoading={isSubmitting}
        onClick={handleSubmit}
      >
        送信
      </Button>
    </form>
  );
}
```

### モーダルのアクションボタン

```tsx
function Modal({ onClose, onConfirm }) {
  return (
    <div>
      <p>本当に削除しますか？</p>
      <div>
        <Button variant="secondary" onClick={onClose}>
          キャンセル
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          削除
        </Button>
      </div>
    </div>
  );
}
```

## 参考リンク

- [WCAG 2.1 ガイドライン](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices - Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [MDN - button 要素](https://developer.mozilla.org/ja/docs/Web/HTML/Element/button)
