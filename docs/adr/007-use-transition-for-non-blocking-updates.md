# ADR 007: useTransitionによる非ブロッキング状態更新

## ステータス

採用 (Accepted)

## コンテキスト

Next.js App Routerを使用したアプリケーションにおいて、重い処理（フィルタリング、API呼び出し、データ変換など）を行う際にUIがブロックされる問題が発生する。

### 技術的背景

Reactの状態更新には優先度の概念がある:

- **緊急な更新 (Urgent Updates)**: ユーザー入力、クリック、キーボード操作など、即座に反映すべき更新
- **非緊急な更新 (Non-Urgent Updates)**: 検索結果の表示、フィルタリング結果など、やや遅れても問題ない更新

従来、すべての状態更新は同じ優先度で処理されるため、重い処理中はUIがブロックされていた。

### アプリケーション要件

本アプリケーションのUI要件:

1. **応答性の高いUI**: 入力やクリックが常にスムーズに動作
2. **視覚的フィードバック**: 処理中であることをユーザーに通知
3. **ユーザー体験**: 重い処理中でも他の操作が可能
4. **シンプルな実装**: 複雑な状態管理を避ける

## 決定事項

**React 18のuseTransition Hookを採用し、非緊急な状態更新をマークすることでUIの応答性を保つ。**

お問い合わせフォーム (`app/examples/contact/page.tsx`) で実装済み。

## 理由

### 1. UIをブロックしない状態更新

**問題**: 重い処理中は他の操作ができない。

```tsx
// ❌ 通常の状態更新（ブロッキング）
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value); // 入力が引っかかる
    setResults(heavyFilter(value, items)); // 重い処理でUIがブロック
  };

  return <input value={query} onChange={handleSearch} />;
}

// ✅ useTransition使用（非ブロッキング）
function SearchComponent() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value); // 即座に更新（緊急）

    startTransition(() => {
      setResults(heavyFilter(value, items)); // 非緊急として遅延可能
    });
  };

  return (
    <>
      <input value={query} onChange={handleSearch} /> {/* スムーズ！ */}
      {isPending && <span>検索中...</span>}
    </>
  );
}
```

**実装例** (`app/examples/contact/page.tsx:48-65`):

```tsx
const handleSubmit = async (data: ContactInput) => {
  setResult(null);

  // useTransitionで非緊急な更新としてマーク
  startTransition(async () => {
    // APIコールのシミュレーション
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("お問い合わせ内容:", data);
    setResult({
      success: true,
      message: "お問い合わせを送信しました。ご連絡ありがとうございます！",
    });

    // フォームをリセット
    form.reset();
  });
};
```

### 2. isPendingによる処理状態の取得

**自動的に処理中の状態を管理**:

```tsx
const [isPending, startTransition] = useTransition();

// isPendingを使ってローディング表示
{isPending && (
  <span style={{ color: "#1976d2", fontWeight: 500 }}>
    ⏳ 送信処理中...（でも他の操作ができます！）
  </span>
)}

// ボタンの状態制御
<Button
  isLoading={isPending}
  disabled={isPending}
>
  送信する
</Button>
```

**実装例** (`app/examples/contact/page.tsx:96-100`):

```tsx
{isPending && (
  <span style={{ display: "block", marginTop: "0.5rem", color: "#1976d2", fontWeight: 500 }}>
    ⏳ 送信処理中...（でも他の操作ができます！）
  </span>
)}
```

### 3. シンプルなAPI

**必要なコードはわずか**:

```tsx
// 1. import
import { useTransition } from "react";

// 2. 宣言
const [isPending, startTransition] = useTransition();

// 3. 使用
startTransition(() => {
  // 非緊急な状態更新
  setHeavyData(processData());
});
```

**従来の方法との比較**:

```tsx
// ❌ 手動でローディング状態を管理
function Component() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true); // 手動でtrue
    await heavyProcess();
    setIsLoading(false); // 手動でfalse（エラー時の考慮も必要）
  };
}

// ✅ useTransitionで自動管理
function Component() {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await heavyProcess(); // isPendingが自動で切り替わる
    });
  };
}
```

### 4. React Hook Formとの統合

**フォーム送信との連携**:

```tsx
export default function ContactPage() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const handleSubmit = async (data: ContactInput) => {
    startTransition(async () => {
      await apiCall(data);
      form.reset();
    });
  };

  return (
    <FormWithHook form={form} onSubmit={handleSubmit}>
      {({ register, formState: { errors } }) => (
        <>
          <Input {...register('name')} error={errors.name?.message} />
          <Button isLoading={isPending} disabled={isPending}>
            送信する
          </Button>
        </>
      )}
    </FormWithHook>
  );
}
```

### 5. 適用シーン

useTransitionが効果を発揮する場面:

1. **検索・フィルタリング**: 大量データの検索結果表示
2. **フォーム送信**: API呼び出しを伴うフォーム送信
3. **タブ切り替え**: 重いコンテンツの切り替え
4. **ページネーション**: 大量データのページ遷移
5. **データ変換**: 複雑な計算やデータ整形

**実装例の効果**:

| シーン | 通常の状態更新 | useTransition使用 |
|--------|---------------|------------------|
| 入力中の反応 | 引っかかる | スムーズ |
| 処理中の操作 | ブロックされる | 可能 |
| 状態管理 | 手動 | 自動 |

## useTransitionの使い方

### 基本構文

```tsx
const [isPending, startTransition] = useTransition();

// 緊急な更新は外に
setQuery(value);

// 非緊急な更新をstartTransitionでラップ
startTransition(() => {
  setResults(heavyFilter(value, items));
});
```

### isPendingの活用パターン

```tsx
// パターン1: ローディングメッセージ
{isPending && <span>処理中...</span>}

// パターン2: オーバーレイ表示
<div style={{ opacity: isPending ? 0.5 : 1 }}>
  {content}
</div>

// パターン3: ボタン状態制御
<Button isLoading={isPending} disabled={isPending}>
  送信
</Button>

// パターン4: プログレスバー
{isPending && <ProgressBar />}
```

### 緊急・非緊急の分類

```tsx
const handleChange = (e) => {
  const value = e.target.value;

  // ✅ 緊急: ユーザー入力の即時反映
  setQuery(value);

  startTransition(() => {
    // ✅ 非緊急: 検索結果の更新
    setResults(search(value));

    // ✅ 非緊急: URLの更新
    router.push(`/search?q=${value}`);

    // ✅ 非緊急: 分析イベントの送信
    analytics.track('search', { query: value });
  });
};
```

## useTransition vs useDeferredValue

React 18にはもう一つの似た機能として`useDeferredValue`がある:

| 項目 | useTransition | useDeferredValue |
|------|--------------|------------------|
| **用途** | 状態更新を遅延 | 値の更新を遅延 |
| **isPending** | あり | なし |
| **制御** | 更新をラップ | 値を渡すだけ |
| **適用シーン** | イベントハンドラ | propsの受け取り |

```tsx
// useTransition: 自分で状態更新を制御
const [isPending, startTransition] = useTransition();
startTransition(() => {
  setState(newValue);
});

// useDeferredValue: 外部から受け取った値を遅延
const deferredValue = useDeferredValue(value);
<HeavyComponent data={deferredValue} />
```

**選択基準**:
- 自分で状態更新を行う → `useTransition`
- 親から受け取ったpropsを遅延 → `useDeferredValue`
- ローディング表示が必要 → `useTransition` (isPendingあり)

## トレードオフ

### デメリット

1. **遅延の不確実性**: 更新がいつ完了するか正確には制御できない
2. **React 18限定**: React 18以降でのみ使用可能
3. **学習コスト**: 緊急・非緊急の分類を理解する必要がある
4. **過度な使用**: すべてをstartTransitionで囲むのは不適切

### メリット

1. **UIの応答性向上**: 重い処理中でも操作可能
2. **自動状態管理**: isPendingで処理中を自動検出
3. **シンプルなAPI**: 最小限のコードで実装
4. **ユーザー体験向上**: 引っかかりのないUI

## 代替案

### 1. setTimeout / requestIdleCallback

**却下理由**:
- 手動でタイミング制御が必要
- ローディング状態の管理が複雑
- Reactの内部スケジューラーと協調しない

```tsx
// ❌ 複雑で保守性が低い
const [isLoading, setIsLoading] = useState(false);

const handleChange = (e) => {
  const value = e.target.value;
  setQuery(value);

  setIsLoading(true);
  setTimeout(() => {
    setResults(filter(value));
    setIsLoading(false); // エラー時の考慮が必要
  }, 0);
};
```

### 2. Web Worker

**却下理由**:
- セットアップが複雑
- データのシリアライズが必要
- React状態との統合が困難
- 小〜中規模の処理にはオーバーキル

### 3. useStateのみ（何もしない）

**却下理由**:
- UIがブロックされる
- ユーザー体験が悪い
- モダンなReactアプリとして不適切

## ベストプラクティス

### 1. 緊急・非緊急を正しく分類

```tsx
// ✅ Good
const handleSearch = (e) => {
  setQuery(e.target.value); // 緊急: 入力の即時反映

  startTransition(() => {
    setResults(search(e.target.value)); // 非緊急: 検索結果
  });
};

// ❌ Bad: すべてをstartTransitionに入れる
const handleSearch = (e) => {
  startTransition(() => {
    setQuery(e.target.value); // 入力が遅延してしまう
    setResults(search(e.target.value));
  });
};
```

### 2. isPendingで適切なフィードバック

```tsx
// ✅ Good: ユーザーに処理中であることを通知
{isPending && <Spinner />}
<div style={{ opacity: isPending ? 0.6 : 1 }}>
  {results.map(item => <Item key={item.id} {...item} />)}
</div>

// ❌ Bad: フィードバックなし
<div>
  {results.map(item => <Item key={item.id} {...item} />)}
</div>
```

### 3. 本当に重い処理にのみ使用

```tsx
// ✅ Good: 重い処理に使用
startTransition(() => {
  setResults(items.filter(item => heavyCalculation(item, query)));
});

// ❌ Bad: 軽い処理に使用（不要）
startTransition(() => {
  setCount(count + 1); // オーバーヘッドのみ発生
});
```

## 実装例

### 検索フィルタリング

```tsx
function SearchList({ items }: { items: Item[] }) {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value); // 緊急: 入力欄の更新

    startTransition(() => {
      // 非緊急: 重いフィルタリング処理
      setFilteredItems(
        items.filter(item =>
          item.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    });
  };

  return (
    <>
      <input value={query} onChange={handleSearch} />
      {isPending && <Spinner />}
      <div style={{ opacity: isPending ? 0.6 : 1 }}>
        {filteredItems.map(item => <ItemCard key={item.id} {...item} />)}
      </div>
    </>
  );
}
```

### タブ切り替え

```tsx
function TabPanel({ tabs }: { tabs: Tab[] }) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index: number) => {
    startTransition(() => {
      setActiveTab(index); // 重いコンテンツの切り替え
    });
  };

  return (
    <>
      <div>
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => handleTabChange(i)}
            disabled={isPending}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {isPending && <ProgressBar />}
      <div style={{ opacity: isPending ? 0.5 : 1 }}>
        {tabs[activeTab].content}
      </div>
    </>
  );
}
```

### フォーム送信（実装済み）

```tsx
export default function ContactPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState(null);
  const form = useForm({ resolver: zodResolver(contactSchema) });

  const handleSubmit = async (data: ContactInput) => {
    setResult(null);

    startTransition(async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult({ success: true, message: "送信完了！" });
      form.reset();
    });
  };

  return (
    <FormWithHook form={form} onSubmit={handleSubmit}>
      {({ register }) => (
        <>
          <Input {...register('name')} />
          {isPending && <span>送信中...</span>}
          <Button isLoading={isPending}>送信</Button>
        </>
      )}
    </FormWithHook>
  );
}
```

## 結果

useTransitionの採用により以下を実現:

1. ✅ UIの応答性向上（重い処理中でも操作可能）
2. ✅ 自動的な処理状態管理（isPending）
3. ✅ シンプルな実装（最小限のコード）
4. ✅ ユーザー体験の向上（引っかかりのないUI）
5. ✅ React Hook Formとのシームレスな連携

## 参考資料

- [React Documentation - useTransition](https://react.dev/reference/react/useTransition)
- [React 18 Working Group - Transitions](https://github.com/reactwg/react-18/discussions/41)
- [useDeferredValue vs useTransition](https://react.dev/reference/react/useDeferredValue#how-is-deferring-a-value-different-from-debouncing-and-throttling)

## 更新履歴

- 2025-11-15: 初版作成
