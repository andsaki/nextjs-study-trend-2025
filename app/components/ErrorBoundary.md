# ErrorBoundary

子コンポーネントでエラーが発生した場合にキャッチして、フォールバックUIを表示するコンポーネントです。

## 実装について

ErrorBoundaryは**クラスコンポーネント**として実装されています。これは、Error Boundaryの実装に必要な以下のライフサイクルメソッドが、クラスコンポーネントでのみ提供されているためです：

- `static getDerivedStateFromError()` - エラーをキャッチしてstateを更新
- `componentDidCatch()` - エラーログの記録などの副作用を実行

関数コンポーネント用のフック（例：`useErrorBoundary`）は、現在のReactには存在しないため、プロジェクト全体を関数コンポーネントで書いていても、Error Boundaryだけはクラスコンポーネントで実装する必要があります。

## 使い方

### 基本的な使い方

```tsx
import { ErrorBoundary } from "@/app/components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

エラーが発生すると、デフォルトのフォールバックUIが表示されます。

### カスタムフォールバックUIを使う

```tsx
<ErrorBoundary
  fallback={(error, reset) => (
    <div>
      <h2>カスタムエラー画面</h2>
      <p>{error.message}</p>
      <button onClick={reset}>もう一度試す</button>
    </div>
  )}
>
  <YourComponent />
</ErrorBoundary>
```

## Props

| プロパティ | 型 | 必須 | 説明 |
|----------|-----|------|------|
| `children` | `ReactNode` | ○ | Error Boundaryで保護する子コンポーネント |
| `fallback` | `(error: Error, reset: () => void) => ReactNode` | × | エラー時に表示するカスタムUI。指定しない場合はデフォルトのUIが表示される |

## 機能

- **エラーキャッチ**: 子コンポーネントツリー内で発生したエラーをキャッチ
- **フォールバックUI**: エラー発生時に代替UIを表示
- **リセット機能**: `reset`関数を呼び出すことで、エラー状態をクリアして子コンポーネントを再レンダリング
- **エラーログ**: コンソールにエラー情報を出力（`componentDidCatch`）

## 注意事項

- Error Boundaryは以下のエラーはキャッチできません：
  - イベントハンドラ内のエラー
  - 非同期コード（`setTimeout`、`Promise`など）
  - サーバーサイドレンダリング
  - Error Boundary自身がスローしたエラー

- これらのケースでは、通常の`try-catch`やPromiseの`.catch()`を使用してください。
