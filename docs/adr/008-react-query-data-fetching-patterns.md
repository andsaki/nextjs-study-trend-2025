# ADR 008: React Query におけるデータフェッチの仕組みとベストプラクティス

## ステータス

採用 (Accepted)

## コンテキスト

React Queryを採用したが、以下の疑問が開発中に生じた:

1. **URLクエリが変わると自動でフェッチされるのはなぜ？** mutateしなくても良いのか？
2. **fetchと何が違うのか？** キャッシュが不要ならfetchで十分では？
3. **NuxtのuseFetchとの違いは？** Nuxtならこんなことにならないのに
4. **基幹システムでも使えるのか？** 古いキャッシュを表示すると業務に支障が出る
5. **楽観的更新とは何か？** なぜ必要なのか？

これらの疑問に答え、React Queryの正しい使い方を整理する必要がある。

## 決定事項

React Queryの**queryKeyベースのキャッシュ管理**を理解し、以下のパターンを確立する:

1. **検索条件変更時**: queryKeyに含める → 自動フェッチ
2. **データ変更時**: invalidateQueriesで手動再フェッチ
3. **基幹システム**: staleTime: 0でキャッシュを無効化
4. **楽観的更新**: UX向上が必要な箇所で採用

## 理由

### 1. URLクエリが変わると自動フェッチされる仕組み

**React Queryは queryKey が変わると別のクエリとして扱う**

```tsx
// 検索ワード: "test"
queryKey: ['todos', { q: 'test' }]  // キャッシュキーA

// 検索ワード: "work"
queryKey: ['todos', { q: 'work' }]  // キャッシュキーB（別物！）
```

→ React Queryは「キャッシュキーBのデータがない」と判断 → **自動フェッチ**

**実際のコード（lib/hooks/useTodos.ts:31）**:
```tsx
export function useTodos(searchParams?: TodoSearchParams) {
  return useSuspenseQuery({
    queryKey: ["todos", searchParams],  // ← searchParamsが変わると別のキャッシュ
    queryFn: () => getTodos(searchParams),
  });
}
```

**フロー**:
```
1. URLクエリ変更 (/todos?q=test)
2. useEffectが検知 (page.tsx:190-214)
3. setSearchParams(params) ← Zustandに保存
4. searchParamsが更新
5. queryKey変化: ["todos", {}] → ["todos", {q: "test"}]
6. React Queryが新しいクエリとして認識 → フェッチ
```

### 2. mutateが必要なケース vs 自動フェッチ

| 操作 | queryKey変化 | 再フェッチ方法 | 理由 |
|------|--------------|----------------|------|
| 検索ワード変更 | ✅ 変わる | **自動**（queryKey変更） | 別のデータを見る |
| フィルタ変更 | ✅ 変わる | **自動**（queryKey変更） | 別のデータを見る |
| ソート変更 | ✅ 変わる | **自動**（queryKey変更） | 別のデータを見る |
| Todo削除 | ❌ 変わらない | **手動**（invalidateQueries） | 同じ条件で中身が変わった |
| Todo作成 | ❌ 変わらない | **手動**（invalidateQueries） | 同じ条件で中身が変わった |
| Todo更新 | ❌ 変わらない | **手動**（invalidateQueries） | 同じ条件で中身が変わった |

**mutateが必要な例（useTodos.ts:57, 73, 89）**:
```tsx
export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      // 同じqueryKeyだが、サーバー側のデータが変わっている
      // → 手動で無効化して再フェッチ
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}
```

### 3. NuxtのuseFetchとの違い

**Nuxt/VueのリアクティビティとReactの違い**

#### Nuxt（useFetch）
```ts
const searchQuery = ref('test')

const { data } = await useFetch('/api/todos', {
  query: { q: searchQuery }  // ← リアクティブ
})

// searchQueryが変わると自動で再フェッチ
searchQuery.value = 'work'  // 何もしなくても再フェッチされる
```

→ **Vueのリアクティビティシステムが依存を自動追跡**

#### React Query
```tsx
const [searchQuery, setSearchQuery] = useState('test')

const { data } = useQuery({
  queryKey: ['todos', searchQuery],  // ← 手動でkeyに含める
  queryFn: () => fetchTodos(searchQuery)
})

// setSearchQueryでqueryKeyが変わる → 再フェッチ
setSearchQuery('work')
```

→ **queryKeyの変更を手動で管理する必要がある**

**なぜこうなるのか**:

| フレームワーク | 仕組み | 自動追跡 |
|----------------|--------|----------|
| Nuxt/Vue | リアクティビティシステム（Proxy） | ✅ 自動 |
| React | 再レンダリング + useEffect | ❌ 手動 |

**結論**: NuxtのuseFetchの方がDX（開発者体験）は良いが、これは**Reactの設計思想**の違い。React Queryの問題ではない。

### 4. fetchと何が違うのか？

**素のfetchでも依存追跡は可能（useEffectで）**

```tsx
const [searchQuery, setSearchQuery] = useState('test')
const [todos, setTodos] = useState([])
const [loading, setLoading] = useState(false)

useEffect(() => {
  setLoading(true)
  fetch(`/api/todos?q=${searchQuery}`)
    .then(res => res.json())
    .then(setTodos)
    .finally(() => setLoading(false))
}, [searchQuery])  // ← 依存配列に手動で追加
```

**比較表**:

| 機能 | fetch + useEffect | React Query | SWR |
|------|-------------------|-------------|-----|
| 依存追跡 | useEffect依存配列 | queryKey | key配列 |
| キャッシュ | 自分で実装 | 自動 | 自動 |
| ローディング状態 | 自分で管理 | `isLoading` | `isLoading` |
| エラー状態 | 自分で管理 | `isError` | `isError` |
| 重複排除 | 自分で実装 | 自動 | 自動 |
| リトライ | 自分で実装 | 自動 | 自動 |
| コード量 | 多い | 少ない | 少ない |

**fetchで十分なケース**:
- 小規模・1画面だけ
- 1回だけデータを取得すれば十分
- キャッシュやリトライ機能が不要

**React Query/SWRが役立つケース**:
1. **戻るボタン対応**: キャッシュから即表示
2. **重複リクエスト排除**: 同じAPIを複数コンポーネントが呼んでも1回だけ
3. **リトライ・エラーハンドリング**: 自動
4. **コード量**: ローディング・エラー・リフェッチを毎回書く必要なし

### 5. 基幹システムでのキャッシュ設定

**基幹システムの要件**:
- データの鮮度が最重要（在庫数、受注状態など）
- 古いキャッシュを表示すると業務に支障
- でも、重複リクエスト排除やローディング管理は欲しい

**推奨設定**:
```tsx
// 基幹システム用の設定
useQuery({
  queryKey: ['inventory', productId],
  queryFn: fetchInventory,
  staleTime: 0,          // ← キャッシュを即座に古いと見なす
  gcTime: 0,             // ← メモリにも残さない（React Query v5）
  refetchOnWindowFocus: true,  // ← タブ切り替えで再取得
  refetchInterval: 30000,      // ← 30秒ごとに自動更新（オプション）
})
```

**fetchとの比較**:

| 機能 | fetch + useEffect | React Query (staleTime: 0) |
|------|-------------------|---------------------------|
| データ鮮度 | ✅ 常に最新 | ✅ 常に最新 |
| 重複排除 | ❌ なし | ✅ あり（同時リクエストを1つに） |
| ローディング管理 | 手動 | 自動 |
| エラーハンドリング | 手動 | 自動 |
| リトライ | 手動 | 自動 |
| コード量 | 多い | 少ない |

**結論**: 基幹システムでも**React Queryを使い、キャッシュを無効化**するのがベスト。

### 6. 楽観的更新（Optimistic Update）とは

**定義**: サーバーのレスポンスを待たずに、**先にUIを更新**してしまう手法。

#### 通常の更新（悲観的更新）
```
1. ボタンクリック
2. API送信 ⏳（ローディング中...）
3. サーバーからOK
4. UIを更新 ✅
```
→ ユーザーは2〜3秒待つ

#### 楽観的更新
```
1. ボタンクリック
2. 即座にUIを更新 ✅（たぶん成功するだろう）
3. バックグラウンドでAPI送信
4. サーバーからOK → そのまま
   失敗 → UIをロールバック ❌
```
→ ユーザーは待たない（体感速度が速い）

**具体例（いいねボタン）**:
```tsx
const likeMutation = useMutation({
  mutationFn: likeTodo,
  onMutate: async (todoId) => {
    // 1. 即座にUIを更新（楽観的）
    queryClient.setQueryData(['todos'], (old) =>
      old.map(todo =>
        todo.id === todoId ? { ...todo, likes: todo.likes + 1 } : todo
      )
    )
  },
  onError: () => {
    // 2. 失敗したら元に戻す
    queryClient.invalidateQueries(['todos'])
  }
})
```

**メリット**:
- 体感速度が爆速（Twitterのいいね、Notionの編集など）
- ネットワークが遅くても快適

**デメリット**:
- 失敗時の処理が複雑
- データ不整合のリスク

**このプロジェクトでの実装例**:
`app/examples/server-actions-optimistic/page.tsx`

### 7. SWRとReact Queryの仕組みは同じ

**基本的な仕組みは同じ**:

```tsx
// SWR
useSWR(['/api/todos', searchParams], ([url, params]) => fetchTodos(params))

// React Query
useQuery({
  queryKey: ['todos', searchParams],
  queryFn: () => fetchTodos(searchParams)
})
```

どちらも:
- **keyが変わると再フェッチ**
- **キャッシュ管理**
- **重複排除**
- **自動リトライ**

**違いは機能の豊富さ**:

| 機能 | SWR | React Query |
|------|-----|-------------|
| 基本フェッチ | ✅ | ✅ |
| キャッシュ | ✅ | ✅ |
| Mutation | △（手動実装） | ✅（useMutation） |
| 楽観的更新 | △（手動実装） | ✅（構造化されたAPI） |
| 無限スクロール | △（useSWRInfinite） | ✅（useInfiniteQuery） |
| DevTools | ❌ | ✅ |
| 関連キャッシュ無効化 | △（個別にmutate） | ✅（invalidateQueries） |

**基幹システムでの比較**:

```tsx
// SWR: 関連キャッシュを個別に無効化
const updateInventory = async (id, newQty) => {
  await fetch(`/api/inventory/${id}`, { method: 'PUT', body: JSON.stringify(newQty) })

  mutate('/api/inventory')           // 一覧
  mutate(`/api/inventory/${id}`)     // 詳細
  mutate('/api/orders')              // 受注一覧も更新が必要
}

// React Query: 前方一致で一括無効化
const mutation = useMutation({
  mutationFn: updateInventory,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['inventory'] })  // inventory/* 全部
    queryClient.invalidateQueries({ queryKey: ['orders'] })
  }
})
```

**結論**: 基幹システムは**CRUD操作が頻繁**なので、Mutation管理が強力な**React Query一択**。

## トレードオフ

### メリット

1. **queryKeyベースのキャッシュ管理**: 検索条件変更時は自動フェッチ
2. **構造化されたMutation API**: useMutationで明確
3. **楽観的更新のサポート**: onMutateで実装しやすい
4. **基幹システムでも使える**: staleTime: 0で鮮度を保証
5. **関連キャッシュの一括無効化**: invalidateQueriesで前方一致

### デメリット

1. **手動でqueryKeyに含める必要**: Nuxt useFetchのような自動追跡なし
2. **学習コスト**: queryKey、キャッシュ戦略の理解が必要
3. **fetchより複雑**: シンプルな1回きりのフェッチには過剰

## 代替案

### 案1: 素のfetch + useEffect

```tsx
useEffect(() => {
  setLoading(true)
  fetch(`/api/todos?q=${searchQuery}`)
    .then(res => res.json())
    .then(setTodos)
    .finally(() => setLoading(false))
}, [searchQuery])
```

**却下理由**:
- キャッシュ、重複排除、リトライを自分で実装する必要
- コード量が多い
- 複数画面で同じような処理を書く羽目に

### 案2: SWR

**却下理由**:
- Mutation管理が手動
- 関連キャッシュの無効化が煩雑
- DevToolsなし
- 詳細は [ADR 003](./003-tanstack-query-vs-swr.md) 参照

## 実装パターン

### パターン1: 検索条件変更（自動フェッチ）

```tsx
// ❌ mutate不要
const { data } = useTodos({ q: 'test', priority: 'high' })

// 検索条件を変更
setSearchParams({ q: 'work', priority: 'low' })
// → queryKeyが変わる → 自動フェッチ
```

### パターン2: データ変更（手動invalidate）

```tsx
// ✅ invalidateQueries必要
const deleteMutation = useMutation({
  mutationFn: deleteTodo,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  }
})
```

### パターン3: 基幹システム（キャッシュ無効化）

```tsx
const { data } = useQuery({
  queryKey: ['inventory', productId],
  queryFn: fetchInventory,
  staleTime: 0,  // 常に最新
  refetchOnWindowFocus: true,
})
```

### パターン4: 楽観的更新（UX向上）

```tsx
const mutation = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    // UIを先に更新
    queryClient.setQueryData(['todos'], old => [...old, newTodo])
  },
  onError: () => {
    // 失敗時はロールバック
    queryClient.invalidateQueries(['todos'])
  }
})
```

## 結果

React Queryの仕組みを正しく理解することで:

1. **無駄なmutateを書かなくなった**: queryKeyに含めれば自動フェッチ
2. **キャッシュ戦略が明確に**: staleTimeで制御可能
3. **基幹システムでも採用可能**: staleTime: 0で鮮度を保証
4. **楽観的更新でUX向上**: Twitter/Notionライクな体験

## 参考資料

- [TanStack Query Documentation - Query Keys](https://tanstack.com/query/latest/docs/react/guides/query-keys)
- [TanStack Query Documentation - Optimistic Updates](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)
- [TanStack Query Documentation - Important Defaults](https://tanstack.com/query/latest/docs/react/guides/important-defaults)
- [ADR 003: TanStack Query vs SWR 比較と選定理由](./003-tanstack-query-vs-swr.md)

## 更新履歴

- 2025-11-23: 初版作成
