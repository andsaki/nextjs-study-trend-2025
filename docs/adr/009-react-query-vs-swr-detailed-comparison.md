# ADR 009: React Query vs SWR 詳細比較 - 6つの実装パターンで理解する

## ステータス

採用 (Accepted) - React Query

## コンテキスト

ADR 003 で React Query を採用する決定をしたが、実装レベルでの具体的な違いを可視化する必要があった。本ドキュメントでは、6つの実装パターンを通じて、React Query と SWR の違いを詳細に比較する。

## 実装デモ

以下の6つのデモを `/examples/react-query-vs-swr` に実装し、両者の違いを体験できるようにした：

1. **Mutation管理**
2. **検索パラメータ**
3. **キャッシュ無効化**
4. **楽観的更新**
5. **ウィンドウフォーカス時の再取得**
6. **依存クエリ（4階層）**

## 比較表: SWR vs React Query（核心だけ）

| 観点 | SWR | React Query |
|---|---|---|
| **目的** | データ取得を簡潔に、UI を軽く保つ | 非同期処理を包括的に管理 |
| **思想** | Stale-While-Revalidate（最新とキャッシュの両立） | キャッシュ・再フェッチ・更新を体系化 |
| **状態管理** | data, error, isLoading 程度 | isFetching, isRefetching, status, staleTime, retry, suspense など豊富 |
| **キャッシュ更新** | mutate 手動管理 | invalidateQueries, setQueryData, refetchOnWindowFocus |
| **Mutation (更新系API)** | 弱い / 仕組みは薄い | 強い（楽に扱える） |
| **依存関係（階層データ）** | 自力でキー設計と mutate 制御が必要 | 依存クエリで自動管理できる |
| **データの楽観的更新** | 自前で実装する | built-in |
| **想定規模** | 小〜中規模 | 中〜大規模 |
| **学習コスト** | 低い | 中〜高（設計力が必要） |

---

## 1. Mutation管理

### React Query: 自動で状態管理

```tsx
const deleteMutation = useMutation({
  mutationFn: deleteItem,
  onSuccess: () => {
    queryClient.invalidateQueries(['items'])
  }
})

<button
  onClick={() => deleteMutation.mutate(id)}
  disabled={deleteMutation.isPending} // ← 自動
>
  {deleteMutation.isPending ? '削除中...' : '削除'}
</button>
```

**嬉しさ:**
- `isPending`, `isError`, `isSuccess` が**自動で管理**される
- useState で手動管理する必要がない

### SWR: 手動で状態管理

```tsx
const [isDeleting, setIsDeleting] = useState(false) // ← 手動
const { mutate } = useSWR('/api/items', fetcher)

async function handleDelete() {
  setIsDeleting(true) // ← 手動
  try {
    await deleteItem(id)
    mutate()
  } finally {
    setIsDeleting(false) // ← 手動
  }
}

<button onClick={handleDelete} disabled={isDeleting}>
  {isDeleting ? '削除中...' : '削除'}
</button>
```

**課題:**
- loading/error/success 状態を**手動で管理**する必要がある
- useState と try-catch を自分で書く必要がある

---

## 2. 検索パラメータ

### React Query: queryKey で自動再フェッチ

```tsx
const [params, setParams] = useState({ status: 'all' })

const { data } = useQuery({
  queryKey: ['items', params], // ← params変更で自動再フェッチ
  queryFn: () => getItems(params)
})

// パラメータ変更
setParams({ status: 'active' })
```

**嬉しさ:**
- `queryKey` に params を含めるだけで**自動再フェッチ**
- URL を構築する必要がない

### SWR: URL文字列を手動構築

```tsx
const [params, setParams] = useState({ status: 'all' })

// SWR: URL文字列がキーとして機能 ← URL構築が必要
const url = `/api/items?${new URLSearchParams(params).toString()}`
const { data } = useSWR(url, fetcher)

// パラメータ変更
setParams({ status: 'active' })
```

**課題:**
- URL 文字列を**手動で構築**する必要がある
- URLSearchParams を使った文字列操作が必要

---

## 3. キャッシュ無効化

### React Query: 一括無効化

```tsx
// 複数のキャッシュを一括無効化
queryClient.invalidateQueries({ queryKey: ['items'] })
// /api/items
// /api/items/123
// /api/items?status=active
// すべて無効化される
```

**嬉しさ:**
- `queryKey` の前方一致で**関連する全キャッシュを一括無効化**
- 配列ベースのキー管理で階層的に整理しやすい

### SWR: 個別指定が必要

```tsx
// SWR: URL文字列キーを個別指定して無効化
mutate('/api/items')
mutate('/api/items/123')
mutate((key) => typeof key === 'string' && key.startsWith('/api/items'))
```

**課題:**
- SWRはURL文字列をキーとして使うため、**個別に指定**するか、関数で前方一致させる必要がある
- React Queryの配列ベースのキーと比べて冗長になりやすい

---

## 4. 楽観的更新

### React Query: setQueryData で即座に更新

```tsx
const updateMutation = useMutation({
  mutationFn: updateItem,
  onMutate: async (newItem) => {
    // 即座にUIを更新 ← built-in
    queryClient.setQueryData(['items'], (old) =>
      old.map(item => item.id === newItem.id ? newItem : item)
    )
  }
})

// クリック時、UIは即座に更新される
<button onClick={() => updateMutation.mutate(newData)}>
  更新
</button>
```

**嬉しさ:**
- `setQueryData` で**即座にUIを更新**
- エラー時は自動ロールバック
- built-in で提供される

### SWR: 手動で実装

```tsx
const { data, mutate } = useSWR('/api/items', fetcher)

async function handleUpdate(newItem) {
  // 手動で楽観的更新を実装 ← 面倒
  const optimisticData = data.map(item =>
    item.id === newItem.id ? newItem : item
  )

  mutate(
    updateItem(newItem), // API呼び出し
    {
      optimisticData, // 楽観的データ
      rollbackOnError: true // エラー時ロールバック
    }
  )
}
```

**課題:**
- `optimisticData` を**手動で構築**する必要がある
- mutate の第2引数に渡す必要がある

---

## 5. ウィンドウフォーカス時の再取得

### React Query: デフォルトで有効

```tsx
const { data } = useQuery({
  queryKey: ['items'],
  queryFn: getItems,
  refetchOnWindowFocus: true // ← デフォルトで有効
})

// ブラウザタブに戻るだけで自動的に再取得
// 設定不要！
```

**嬉しさ:**
- `refetchOnWindowFocus` で**常に最新データを保持**（デフォルト有効）
- 細かい制御が可能（refetchOnMount, refetchOnReconnect, etc.）

### SWR: 同様の機能はあるが

```tsx
const { data } = useSWR('/api/items', fetcher, {
  revalidateOnFocus: true // ← デフォルトで有効
})

// SWRも同じ機能を持っているが、
// React Queryはより細かく制御可能
```

**課題:**
- SWR も同様の機能を持つが、React Query ほど細かい制御はできない

---

## 6. 依存クエリ（4階層プルダウン）

これが**最も差が出るケース**。地域 → 都道府県 → 市区町村 → 事業所 の4階層プルダウンを実装する。

### React Query: enabled で宣言的に管理

```tsx
// 1階層目: 地域
const { data: regions } = useQuery({
  queryKey: ['regions'], // 嬉しさ: 配列でキーを管理、階層的に整理しやすい
  queryFn: getRegions,
})

// 2階層目: 都道府県
const { data: prefectures } = useQuery({
  queryKey: ['prefectures', selectedRegion], // 嬉しさ: selectedRegionが変わると自動で新しいキャッシュキーになる
  queryFn: () => getPrefectures(selectedRegion),
  enabled: selectedRegion.length > 0, // 嬉しさ: 親が選択されるまで自動的にリクエストを待機
})

// 3階層目: 市区町村
const { data: cities } = useQuery({
  queryKey: ['cities', selectedPrefecture], // 嬉しさ: selectedPrefectureが変わると自動で新しいキャッシュキーになる
  queryFn: () => getCities(selectedPrefecture),
  enabled: selectedPrefecture.length > 0, // 嬉しさ: 親が選択されるまで自動的にリクエストを待機
})

// 4階層目: 事業所
const { data: offices } = useQuery({
  queryKey: ['offices', selectedCity], // 嬉しさ: selectedCityが変わると自動で新しいキャッシュキーになる
  queryFn: () => getOffices(selectedCity),
  enabled: selectedCity.length > 0, // 嬉しさ: 親が選択されるまで自動的にリクエストを待機
})

const handleRegionChange = (e) => {
  setSelectedRegion(e.target.value)
  setSelectedPrefecture('')
  setSelectedCity('')
  setSelectedOffice('')
  // React Query: queryKeyが変わるだけで古いキャッシュは自動破棄される
  // mutateやinvalidateを呼ぶ必要なし！
}
```

**嬉しさ:**
- `enabled` で**依存関係を宣言的に管理**
- 親が選択されたら自動で子を取得
- 各階層のローディング状態も自動管理
- `queryKey` が変わるだけで自動的に新しいクエリになる
- **mutate や invalidate を呼ぶ必要なし！**

### SWR: URL構築 + null条件分岐 + 手動mutate

```tsx
const { mutate: globalMutate } = useSWRConfig() // SWR: グローバルmutateを取得

// 1階層目: 地域
const { data: regions } = useSWR('/api/regions', fetcher)

// 2階層目: 都道府県（手動でURL構築 + null チェック）
const prefecturesUrl = selectedRegion
  ? `/api/prefectures?region=${selectedRegion}`
  : null
const { data: prefectures } = useSWR(prefecturesUrl, fetcher)

// 3階層目: 市区町村（手動でURL構築 + null チェック）
const citiesUrl = selectedPrefecture
  ? `/api/cities?prefecture=${selectedPrefecture}`
  : null
const { data: cities } = useSWR(citiesUrl, fetcher)

// 4階層目: 事業所（手動でURL構築 + null チェック）
const officesUrl = selectedCity
  ? `/api/offices?city=${selectedCity}`
  : null
const { data: offices } = useSWR(officesUrl, fetcher)

const handleRegionChange = (e) => {
  setSelectedRegion(e.target.value)
  setSelectedPrefecture('')
  setSelectedCity('')
  setSelectedOffice('')
  // SWR: 手動でキャッシュをクリア（React Queryは自動）
  globalMutate((key) => typeof key === 'string' && key.startsWith('/api/prefectures'))
  globalMutate((key) => typeof key === 'string' && key.startsWith('/api/cities'))
  globalMutate((key) => typeof key === 'string' && key.startsWith('/api/offices'))
}
```

**課題:**
- SWRはURL文字列をキーとして使うため、各階層でURL を**手動で構築**する必要がある
- `null` チェックで依存関係を表現（冗長）
- 各階層で三項演算子を書く必要がある
- **手動で `globalMutate` を呼んでキャッシュをクリアする必要がある**

---

## キー管理の違い

React Query と SWR の最も根本的な違いは、**キャッシュキーの管理方法**にある。

### React Query: 配列ベースのキー

```tsx
// 配列でキーを構成
queryKey: ['items', { status: 'active', page: 1 }]
queryKey: ['users', userId, 'posts']
```

- **階層的に管理しやすい**
- **前方一致で一括無効化できる**
- オブジェクトや配列を直接含められる

### SWR: URL文字列ベースのキー

```tsx
// URL文字列がキーとして機能
const url = `/api/items?status=active&page=1`
useSWR(url, fetcher)
```

- **URL構築が必要**
- URLSearchParamsなどで文字列化が必要
- 前方一致には関数を使う必要がある

この違いが、依存クエリやキャッシュ無効化の実装に大きく影響する。

---

## enabled の嬉しさ

`enabled` は React Query の**最も強力な機能の1つ**。SWRの `null` パターンと比較して、以下の点で優れている。

### 1. 宣言的で読みやすい

```tsx
// React Query: 宣言的で読みやすい
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => getUser(userId),
  enabled: !!userId, // userIdがあるときだけ実行
})

const { data: posts } = useQuery({
  queryKey: ['posts', userId],
  queryFn: () => getPosts(userId),
  enabled: !!user, // userが取得できたら実行
})
```

```tsx
// SWR: 命令的で条件分岐が必要
const { data: user } = useSWR(
  userId ? `/api/users/${userId}` : null, // ← nullで「実行しない」を表現
  fetcher
)

const { data: posts } = useSWR(
  user ? `/api/posts?userId=${user.id}` : null, // ← 三項演算子が増える
  fetcher
)
```

### 2. 複数条件を組み合わせやすい

```tsx
// React Query: 複数条件をAND/ORで組み合わせやすい
const { data } = useQuery({
  queryKey: ['data', params],
  queryFn: () => fetchData(params),
  enabled: isAuthenticated && hasPermission && params.id > 0,
})
```

```tsx
// SWR: URL構築に条件を埋め込む必要がある（複雑になりやすい）
const url = (isAuthenticated && hasPermission && params.id > 0)
  ? `/api/data?id=${params.id}`
  : null
const { data } = useSWR(url, fetcher)
```

### 3. 「取得するか」と「何を取得するか」を分離できる

```tsx
// React Query: 関心の分離
const { data } = useQuery({
  queryKey: ['items', searchParams], // ← 何を取得するか（キー）
  queryFn: () => getItems(searchParams), // ← どう取得するか
  enabled: searchParams.query.length > 2, // ← いつ取得するか（条件）
})
```

```tsx
// SWR: URL構築とタイミング制御が混在
const url = searchParams.query.length > 2
  ? `/api/items?query=${searchParams.query}` // ← 条件とURL構築が混在
  : null
const { data } = useSWR(url, fetcher)
```

### 4. デバッグしやすい

React Query DevTools で `enabled` の状態が可視化される。`disabled` と表示されるため、なぜリクエストが送信されないか一目で分かる。

SWR では `null` が渡されているだけなので、デバッグが難しい。

### まとめ

`enabled` の嬉しさ：

1. **宣言的で読みやすい**（三項演算子が不要）
2. **複数条件を組み合わせやすい**
3. **関心の分離**（キー、フェッチ処理、実行条件を分離）
4. **デバッグしやすい**（DevToolsで状態が可視化される）

特に**4階層プルダウンのような複雑な依存関係**がある場合、SWRの `null` パターンは冗長になりがちだが、React Queryの `enabled` は**シンプルで保守しやすい**コードになる。

---

## 重要な概念: enabled と mutate の違い

### `enabled` とは（React Query）

**データを取得（fetch）するかどうかの条件**。

```tsx
const { data } = useQuery({
  queryKey: ['prefectures', selectedRegion],
  queryFn: () => getPrefectures(selectedRegion),
  enabled: selectedRegion.length > 0, // ← trueの時だけ実行、falseの時は待機
})
```

- `enabled: true` → API リクエストを送る
- `enabled: false` → API リクエストを送らない（待機状態）

### `mutate` / `invalidateQueries` とは

**キャッシュを更新・無効化する**関数。

```tsx
// SWR
const { mutate } = useSWR('/api/items', fetcher)
mutate() // ← キャッシュを無効化して再取得

// React Query
queryClient.invalidateQueries(['items']) // ← キャッシュを無効化して再取得
```

### まとめ

| | 用途 | タイミング |
|---|---|---|
| **enabled** | データを取得するかどうかの**条件** | 初回レンダー時・依存値が変わった時 |
| **mutate / invalidateQueries** | キャッシュを**手動で更新・無効化** | ボタンクリック時など、任意のタイミング |

---

## invalidateQueries が必要なケース

依存クエリでは `invalidateQueries` を**使わなくていい**。理由：

**`queryKey` が変わると、React Query は自動的に新しいクエリとして扱う**から。

```tsx
// 東京を選択した時
queryKey: ["cities", "tokyo"] // ← このキャッシュを使う

// 大阪に変更した時
queryKey: ["cities", "osaka"] // ← 全く別のキャッシュとして扱われる
```

古い "tokyo" のキャッシュは**自動的に無視**される（GCで削除される）。

### `invalidateQueries` が必要なケース

**同じ queryKey のデータを更新した時**。

```tsx
const deleteMutation = useMutation({
  mutationFn: deleteItem,
  onSuccess: () => {
    // 削除後、同じqueryKeyのキャッシュを無効化して再取得
    queryClient.invalidateQueries({ queryKey: ["items"] })
  }
})
```

この場合：
- queryKey は `["items"]` のまま変わらない
- でもサーバー側のデータは変わった（削除された）
- だから `invalidateQueries` で「キャッシュは古いよ、再取得して」と伝える必要がある

| ケース | invalidateQueries 必要？ | 理由 |
|---|---|---|
| **依存クエリ（4階層プルダウン）** | **不要** | queryKey が変わるので自動的に新しいクエリになる |
| **Mutation後のリスト更新** | **必要** | queryKey は同じだがサーバー側のデータが変わった |

---

## 決定事項の根拠

### React Query を選ぶべきケース

1. **複雑な依存関係がある場合**（4階層プルダウンなど）
   - `enabled` で宣言的に依存関係を管理できる
   - `queryKey` が変わるだけで自動的に新しいクエリになる
   - 手動で mutate を呼ぶ必要がない

2. **Mutation が多い場合**
   - `useMutation` で状態管理が自動化される
   - `invalidateQueries` で関連キャッシュを一括無効化できる

3. **楽観的更新が必要な場合**
   - `setQueryData` で即座に UI を更新できる
   - エラー時の自動ロールバック

4. **中〜大規模なプロジェクト**
   - 豊富な状態管理（isFetching, isRefetching, status など）
   - 細かい制御が可能

### SWR を選ぶべきケース

1. **小規模なプロジェクト**
   - シンプルで学習コストが低い
   - 基本的なデータフェッチには十分

2. **Vercel / Next.js との親和性を重視する場合**
   - Vercel 社が開発している
   - Next.js のドキュメントで推奨されている

3. **軽量さを重視する場合**
   - バンドルサイズが小さい

---

## 結論

**4階層の依存関係がある場合、React Query の方が圧倒的に楽で安全**。

- React Query: `enabled` + `queryKey` の自動管理
- SWR: URL 構築 + null 条件分岐 + 手動 mutate

本プロジェクトでは、複雑なデータフェッチパターンが想定されるため、**React Query を採用する**。

---

## 参考リンク

- [実装デモ: /examples/react-query-vs-swr](/examples/react-query-vs-swr)
- [ADR 003: TanStack Query vs SWR 比較と選定理由](./003-tanstack-query-vs-swr.md)
- [ADR 008: React Query data fetching patterns and best practices](./008-react-query-data-fetching-patterns.md)
- [React Query 公式ドキュメント](https://tanstack.com/query/latest)
- [SWR 公式ドキュメント](https://swr.vercel.app/)
