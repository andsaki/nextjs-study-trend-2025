# ADR 001: TanStack Query採用によるクライアント側データ管理

## ステータス

採用 (Accepted)

## コンテキスト

Next.js App Routerを使用したTodoアプリケーションにおいて、サーバーデータの取得・管理方法を決定する必要がある。

### 技術的背景

Next.js App Routerには以下の特徴がある:

- デフォルトでサーバーコンポーネント
- `fetch`による自動キャッシング機能
- Server Actions対応
- しかし、クライアント側のインタラクティブな操作には限界がある

### アプリケーション要件

本アプリケーションには以下の要件がある:

1. **リアルタイム性**: Todo完了状態のトグル、検索フィルタ変更時の即座な更新
2. **ユーザー体験**: ローディング状態の明示、楽観的更新によるスムーズなUI
3. **状態管理**: 検索パラメータ、フィルタ、ソート条件の管理
4. **データ同期**: mutation後の自動再取得、キャッシュの一貫性維持

## 決定事項

**TanStack Query (React Query) を採用し、クライアント側のサーバー状態管理を行う。**

App Router の `fetch` は初期レンダリング時のみ使用し、クライアント側のインタラクションはすべてTanStack Queryで管理する。

## 理由

### 1. クライアント側のインタラクティブ性

**問題**: App Router fetchはサーバーコンポーネントで実行されるため、クライアント側の動的な操作に対応しづらい。

```tsx
// ❌ App Router fetchのみの場合
async function TodosPage() {
  const todos = await fetch('/api/todos')
  // ユーザーがチェックボックスをクリック→どうやって更新？
  // router.refresh()? → 全ページ再レンダリング（非効率）
}

// ✅ TanStack Query
function TodosPage() {
  const { data: todos } = useTodos()
  const updateMutation = useUpdateTodo()

  const handleToggle = (id, completed) => {
    updateMutation.mutate({ id, data: { completed } }) // 即座に更新
  }
}
```

### 2. 自動キャッシング・再検証戦略

**TanStack Queryの利点**:
- クエリキーベースの細かいキャッシュ制御
- 条件付き再取得（Window Focus、Interval、Manual）
- staleTime、gcTimeによる柔軟なキャッシュライフサイクル

```tsx
const { data } = useTodos(searchParams, {
  staleTime: 60 * 1000,        // 1分間はキャッシュを使用
  refetchOnWindowFocus: false,  // タブ切り替え時の再取得を制御
})

// 検索パラメータが変わると自動で新しいクエリを実行
const { data } = useTodos({ q: "test", priority: "high" })
// queryKey: ["todos", { q: "test", priority: "high" }]
```

### 3. 楽観的更新（Optimistic Updates）

**ユーザー体験の向上**:
- APIレスポンスを待たずにUIを即座に更新
- エラー時は自動ロールバック

```tsx
const updateMutation = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    // 即座にUIを更新
    await queryClient.cancelQueries(['todos'])
    const previousTodos = queryClient.getQueryData(['todos'])
    queryClient.setQueryData(['todos'], old =>
      old.map(t => t.id === newTodo.id ? { ...t, ...newTodo } : t)
    )
    return { previousTodos }
  },
  onError: (err, newTodo, context) => {
    // エラー時はロールバック
    queryClient.setQueryData(['todos'], context.previousTodos)
  },
  onSuccess: () => {
    // 成功時は再フェッチで確認
    queryClient.invalidateQueries(['todos'])
  }
})
```

### 4. ローディング・エラー状態の自動管理

**比較**:

```tsx
// ❌ App Router fetchのみ
async function Page() {
  try {
    const data = await fetch(...) // ローディング状態は？
    return <TodoList todos={data} />
  } catch (error) {
    return <Error /> // エラーバウンダリー必須
  }
}

// ✅ TanStack Query
function Page() {
  const { data, isLoading, error, isFetching } = useTodos()

  if (isLoading) return <Loading />
  if (error) return <Error message={error.message} />

  return <TodoList todos={data} />
}
```

### 5. Mutation後の自動再取得

```tsx
const deleteMutation = useDeleteTodo()

// mutation定義
useMutation({
  mutationFn: deleteTodo,
  onSuccess: () => {
    // 関連するすべてのtodosクエリを自動で再取得
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  }
})
```

### 6. DevToolsによる開発体験

- すべてのクエリ状態をリアルタイムで可視化
- キャッシュの内容を確認
- 手動で再フェッチ・invalidate可能

```tsx
<QueryClientProvider client={queryClient}>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

## App Router fetchとの使い分け

| 用途 | 技術 | 理由 |
|------|------|------|
| 初期データ取得（SEO重要） | App Router fetch | サーバー側で実行、初期HTMLに含まれる |
| 静的コンテンツ | App Router fetch | ビルド時キャッシュ、CDN配信可能 |
| クライアント側の検索・フィルタ | TanStack Query | パラメータ変更に即座に対応 |
| CRUD操作 | TanStack Query | 楽観的更新、自動再取得 |
| リアルタイム更新が必要 | TanStack Query | refetchInterval、WebSocket連携 |

## ベストプラクティス実装例

```tsx
// サーバーコンポーネント（初期データ）
async function TodosPage() {
  const initialTodos = await fetch('/api/todos', {
    cache: 'no-store' // または revalidate: 60
  })

  return <ClientTodoList initialData={initialTodos} />
}

// クライアントコンポーネント（インタラクション）
'use client'
function ClientTodoList({ initialData }) {
  const { data, isLoading } = useTodos({
    initialData,      // サーバーデータを初期値に
    staleTime: 0,     // すぐにクライアント側で再検証
  })

  // 以降はTanStack Queryが管理
}
```

## 実装詳細

### カスタムフック (`lib/hooks/useTodos.ts`)

```tsx
// データ取得
export function useTodos(searchParams?: TodoSearchParams) {
  return useQuery({
    queryKey: ["todos", searchParams],
    queryFn: () => getTodos(searchParams),
  })
}

// Mutation
export function useUpdateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateTodo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    },
  })
}
```

### グローバル設定 (`app/providers/QueryProvider.tsx`)

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,        // 1分
      gcTime: 5 * 60 * 1000,       // 5分
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

## トレードオフ

### デメリット

1. **追加の依存関係**: `@tanstack/react-query` のインストールが必要
2. **学習コスト**: queryKey、キャッシュ戦略の理解が必要
3. **バンドルサイズ**: 約13KB (gzip後)

### メリット

1. **開発速度**: ボイラープレート削減、自動化された状態管理
2. **ユーザー体験**: 高速なUI更新、楽観的更新
3. **保守性**: 一貫したデータフェッチパターン
4. **デバッグ**: DevToolsによる可視化

## 代替案

### 1. App Router fetch + Server Actions のみ

**却下理由**:
- クライアント側の動的な操作に対応しづらい
- `router.refresh()` は全ページ再レンダリングで非効率
- ローディング状態の管理が複雑

### 2. SWR

**却下理由**:
- TanStack Queryと機能は類似
- しかしTanStack Queryの方がmutation、DevTools、型サポートが強力
- 2025年のトレンドはTanStack Query

### 3. Redux + RTK Query

**却下理由**:
- 本アプリケーションにはオーバースペック
- グローバル状態管理はZustandで対応
- RTK QueryよりTanStack Queryの方がシンプル

## 結果

TanStack Queryの採用により以下を実現:

1. ✅ 検索パラメータ変更時の即座なデータ再取得
2. ✅ Todo完了トグルの楽観的更新
3. ✅ mutation後の自動再フェッチ
4. ✅ ローディング・エラー状態の自動管理
5. ✅ DevToolsによる開発体験向上

## 参考資料

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [React Query vs SWR](https://tanstack.com/query/latest/docs/react/comparison)

## 更新履歴

- 2025-11-06: 初版作成
