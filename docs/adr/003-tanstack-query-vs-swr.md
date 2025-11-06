# ADR 003: TanStack Query vs SWR 比較と選定理由

## ステータス

採用 (Accepted) - TanStack Query

## コンテキスト

Next.js App Routerでのデータフェッチライブラリとして、TanStack Query (React Query) と SWR の2大選択肢がある。どちらもキャッシング、再検証、楽観的更新などの機能を提供するが、本プロジェクトに最適なライブラリを選定する必要がある。

### 両者の概要

**TanStack Query (React Query)**:
- Tanner Linsley氏が開発
- 汎用的なデータフェッチ・状態管理ライブラリ
- React以外にもVue、Solid、Svelteに対応

**SWR (stale-while-revalidate)**:
- Vercel社が開発（Next.jsの開発元）
- Next.jsとの親和性が高い
- シンプルで軽量

## 決定事項

**TanStack Query を採用する。**

2025年の最新トレンド、機能の充実度、コミュニティの規模を考慮した結果、TanStack Queryが本プロジェクトに最適と判断。

## 詳細比較

### 1. 基本的なデータフェッチ

#### TanStack Query
```tsx
import { useQuery } from '@tanstack/react-query'

function TodosPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('/api/todos').then(res => res.json()),
  })

  if (isLoading) return <Loading />
  if (error) return <Error />
  return <TodoList todos={data} />
}
```

#### SWR
```tsx
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then(res => res.json())

function TodosPage() {
  const { data, isLoading, error } = useSWR('/api/todos', fetcher)

  if (isLoading) return <Loading />
  if (error) return <Error />
  return <TodoList todos={data} />
}
```

**比較**:
- SWRの方がシンプル（URLベース）
- TanStack Queryは明示的なqueryKey（柔軟性高い）

### 2. パラメータ付きクエリ

#### TanStack Query ✅
```tsx
function TodosPage({ searchParams }) {
  // queryKeyが変わると自動で再フェッチ
  const { data } = useQuery({
    queryKey: ['todos', searchParams],
    queryFn: () => getTodos(searchParams),
  })
}

// 異なるパラメータで複数のクエリを管理
useQuery({ queryKey: ['todos', { status: 'active' }], ... })
useQuery({ queryKey: ['todos', { status: 'completed' }], ... })
```

#### SWR
```tsx
function TodosPage({ searchParams }) {
  // URLを動的に生成
  const url = `/api/todos?${new URLSearchParams(searchParams)}`
  const { data } = useSWR(url, fetcher)
}

// 複数のクエリ
useSWR('/api/todos?status=active', fetcher)
useSWR('/api/todos?status=completed', fetcher)
```

**評価**:
- TanStack Query: queryKeyベースで直感的、オブジェクトでパラメータ管理
- SWR: URLを文字列で管理、パラメータ変更時にURL再構築が必要

### 3. Mutation（データ更新）

#### TanStack Query ✅
```tsx
const updateMutation = useMutation({
  mutationFn: (data) => updateTodo(data),
  onMutate: async (newTodo) => {
    // 楽観的更新
    await queryClient.cancelQueries(['todos'])
    const previous = queryClient.getQueryData(['todos'])
    queryClient.setQueryData(['todos'], old => [...old, newTodo])
    return { previous }
  },
  onError: (err, variables, context) => {
    // ロールバック
    queryClient.setQueryData(['todos'], context.previous)
  },
  onSuccess: () => {
    // 再フェッチ
    queryClient.invalidateQueries(['todos'])
  },
})

// 使用
updateMutation.mutate({ id: 1, title: 'New Title' })
```

#### SWR
```tsx
const { mutate } = useSWR('/api/todos', fetcher)

async function updateTodo(data) {
  // 楽観的更新
  mutate(
    async (currentData) => {
      // API呼び出し
      await fetch('/api/todos', { method: 'POST', body: JSON.stringify(data) })
      // 新しいデータを返す
      return [...currentData, data]
    },
    {
      optimisticData: (currentData) => [...currentData, data],
      rollbackOnError: true,
      revalidate: false,
    }
  )
}
```

**評価**:
- TanStack Query: 専用の`useMutation`フックで明確
- SWR: `mutate`関数で実装（やや複雑）

### 4. キャッシュ管理

#### TanStack Query ✅
```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,       // 1分間はfreshとみなす
      gcTime: 5 * 60 * 1000,      // 5分後にガベージコレクション
      retry: 3,                    // 失敗時のリトライ回数
      refetchOnWindowFocus: true,  // フォーカス時の再フェッチ
    },
  },
})

// 特定のクエリだけ無効化
queryClient.invalidateQueries({ queryKey: ['todos'] })
queryClient.invalidateQueries({ queryKey: ['todos', { id: 1 }] })

// キャッシュを手動設定
queryClient.setQueryData(['todos'], newTodos)

// キャッシュを取得
const todos = queryClient.getQueryData(['todos'])
```

#### SWR
```tsx
const { mutate } = useSWRConfig()

// グローバル設定
<SWRConfig
  value={{
    dedupingInterval: 2000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  }}
>

// 特定のキャッシュを無効化
mutate('/api/todos')
mutate((key) => key.startsWith('/api/todos'))

// キャッシュを手動設定
mutate('/api/todos', newTodos, false)
```

**評価**:
- TanStack Query: より細かい制御、queryKeyベースで直感的
- SWR: シンプルだが、URLベースなので複雑なパターンに弱い

### 5. DevTools

#### TanStack Query ✅
```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<QueryClientProvider client={queryClient}>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

**機能**:
- すべてのクエリの状態を可視化
- キャッシュの内容を確認
- 手動で再フェッチ・invalidate
- Time-travel debugging
- クエリの依存関係を可視化

#### SWR
```tsx
// 公式のDevToolsは存在しない（サードパーティ製はあり）
```

**評価**:
- TanStack Query: 強力なDevToolsを標準提供
- SWR: DevToolsなし（開発体験で劣る）

### 6. 並列クエリ

#### TanStack Query ✅
```tsx
function Dashboard() {
  const todos = useQuery({ queryKey: ['todos'], queryFn: getTodos })
  const user = useQuery({ queryKey: ['user'], queryFn: getUser })
  const stats = useQuery({ queryKey: ['stats'], queryFn: getStats })

  // または useQueries で一括管理
  const results = useQueries({
    queries: [
      { queryKey: ['todos'], queryFn: getTodos },
      { queryKey: ['user'], queryFn: getUser },
      { queryKey: ['stats'], queryFn: getStats },
    ]
  })
}
```

#### SWR
```tsx
function Dashboard() {
  const { data: todos } = useSWR('/api/todos', fetcher)
  const { data: user } = useSWR('/api/user', fetcher)
  const { data: stats } = useSWR('/api/stats', fetcher)

  // 自動で並列実行される
}
```

**評価**:
- 両者とも並列クエリをサポート
- TanStack Query: `useQueries`で一括管理可能

### 7. 依存クエリ（Dependent Queries）

#### TanStack Query ✅
```tsx
function TodoDetail({ id }) {
  // まずTodoを取得
  const { data: todo } = useQuery({
    queryKey: ['todo', id],
    queryFn: () => getTodo(id),
  })

  // Todoが取得できたらコメントを取得
  const { data: comments } = useQuery({
    queryKey: ['comments', todo?.id],
    queryFn: () => getComments(todo.id),
    enabled: !!todo, // todoが存在する時だけ実行
  })
}
```

#### SWR
```tsx
function TodoDetail({ id }) {
  const { data: todo } = useSWR(`/api/todos/${id}`, fetcher)

  // 条件付きフェッチ
  const { data: comments } = useSWR(
    todo ? `/api/todos/${todo.id}/comments` : null,
    fetcher
  )
}
```

**評価**:
- TanStack Query: `enabled`オプションで明示的
- SWR: keyを`null`にすることで制御（やや直感的でない）

### 8. Infinite Queries（無限スクロール）

#### TanStack Query ✅
```tsx
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ['todos'],
  queryFn: ({ pageParam = 0 }) => getTodos(pageParam),
  getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
})

// すべてのページのデータ
const allTodos = data?.pages.flatMap(page => page.todos)
```

#### SWR
```tsx
import useSWRInfinite from 'swr/infinite'

const getKey = (pageIndex, previousPageData) => {
  if (previousPageData && !previousPageData.hasMore) return null
  return `/api/todos?page=${pageIndex}`
}

const { data, size, setSize } = useSWRInfinite(getKey, fetcher)

// すべてのページのデータ
const allTodos = data ? data.flatMap(page => page.todos) : []
```

**評価**:
- TanStack Query: `useInfiniteQuery`で専用フック、直感的
- SWR: `useSWRInfinite`で実装可能だが、やや複雑

### 9. バンドルサイズ

| ライブラリ | サイズ (minified) | サイズ (gzipped) |
|-----------|------------------|------------------|
| TanStack Query | 40.5 KB | 13.1 KB |
| SWR | 12.5 KB | 4.9 KB |

**評価**:
- SWR: より軽量
- TanStack Query: 機能が豊富な分、サイズは大きい

### 10. TypeScript サポート

#### TanStack Query ✅
```tsx
interface Todo {
  id: string
  title: string
  completed: boolean
}

const { data } = useQuery<Todo[], Error>({
  queryKey: ['todos'],
  queryFn: getTodos,
})
// data は Todo[] | undefined

const mutation = useMutation<Todo, Error, CreateTodoInput>({
  mutationFn: createTodo,
})
```

#### SWR
```tsx
interface Todo {
  id: string
  title: string
  completed: boolean
}

const { data } = useSWR<Todo[], Error>('/api/todos', fetcher)
// data は Todo[] | undefined
```

**評価**:
- 両者とも優れたTypeScriptサポート
- TanStack Query: より厳密な型推論

## 比較表まとめ

| 機能 | TanStack Query | SWR | 勝者 |
|------|---------------|-----|------|
| **基本的な使いやすさ** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | SWR |
| **パラメータ付きクエリ** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | TanStack Query |
| **Mutation** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | TanStack Query |
| **キャッシュ管理** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | TanStack Query |
| **DevTools** | ⭐⭐⭐⭐⭐ | ⭐ | TanStack Query |
| **並列クエリ** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 引き分け |
| **依存クエリ** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | TanStack Query |
| **無限スクロール** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | TanStack Query |
| **バンドルサイズ** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | SWR |
| **TypeScript** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | TanStack Query |
| **ドキュメント** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | TanStack Query |
| **コミュニティ** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | TanStack Query |
| **Next.js統合** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | SWR |

## 本プロジェクトでTanStack Queryを選んだ理由

### 1. 複雑な検索パラメータ管理

```tsx
// queryKeyでパラメータを管理
const { data } = useTodos({
  q: "test",
  priority: "high",
  sortBy: "createdAt",
  sortOrder: "desc"
})

// パラメータが変わると自動で再フェッチ
// queryKey: ["todos", { q: "test", priority: "high", ... }]
```

SWRだとURL文字列の構築が煩雑になる。

### 2. 頻繁なMutation操作

Todo作成、更新、削除が頻繁に発生するため、`useMutation`の明確なAPIが有利。

### 3. DevToolsによる開発体験

開発中にクエリの状態、キャッシュの内容を可視化できることは大きなメリット。

### 4. 楽観的更新の実装

チェックボックストグルなど、即座にUIを更新したいケースが多い。TanStack Queryの方が実装が明確。

### 5. 将来の拡張性

- 無限スクロールの実装予定
- リアルタイム更新（WebSocket連携）の可能性
- より複雑なキャッシュ戦略

### 6. 学習価値

2025年現在、TanStack Queryの方がトレンド。学習する価値が高い。

## 2025年のトレンド

### NPMダウンロード数（週間）

- **TanStack Query**: 約500万ダウンロード
- **SWR**: 約250万ダウンロード

### GitHub Stars

- **TanStack Query**: 42k+ stars
- **SWR**: 30k+ stars

### コミュニティ

- TanStack Query: より活発、Discord、Twitter
- SWR: Vercelエコシステムに特化

## いつSWRを選ぶべきか

SWRが適している場合:

1. **シンプルなGETのみのアプリ**: ダッシュボード、ブログなど
2. **バンドルサイズが最重要**: モバイルファーストアプリ
3. **Next.jsに特化**: VercelでホスティングするNext.jsアプリ
4. **学習コストを抑えたい**: 小規模チーム、短期開発

```tsx
// SWRが適した例
function BlogPage() {
  const { data } = useSWR('/api/posts', fetcher)
  return <PostList posts={data} />
}
// シンプルなGET、mutationなし、パラメータなし
```

## トレードオフ

### TanStack Query採用のデメリット

1. **バンドルサイズ**: 13KB (gzipped) - SWRの約2.7倍
2. **学習曲線**: queryKey、キャッシュ戦略の理解が必要
3. **ボイラープレート**: SWRより若干多い

### メリット

1. **機能の豊富さ**: mutation、無限スクロール、依存クエリなど
2. **DevTools**: 開発体験が大幅に向上
3. **拡張性**: 複雑な要件にも対応可能
4. **コミュニティ**: 大規模で活発
5. **将来性**: 2025年のトレンド、継続的な開発

## 結論

本プロジェクトでは以下の理由により **TanStack Query を採用**:

1. ✅ 複雑な検索パラメータ管理
2. ✅ 頻繁なmutation操作
3. ✅ 楽観的更新の実装
4. ✅ DevToolsによる開発体験
5. ✅ 将来の拡張性
6. ✅ 2025年のトレンド

バンドルサイズの増加（約8KB）は許容範囲内と判断。

## 参考資料

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [SWR Documentation](https://swr.vercel.app/)
- [TanStack Query vs SWR 公式比較](https://tanstack.com/query/latest/docs/react/comparison)
- [NPM Trends: react-query vs swr](https://npmtrends.com/@tanstack/react-query-vs-swr)

## 更新履歴

- 2025-11-06: 初版作成
