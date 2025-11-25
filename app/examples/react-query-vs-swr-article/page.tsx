import { Text } from "@/src/design-system/components/Text";
import { colors, spacing, radii } from "@/src/design-system/tokens";

export default function ReactQueryVsSWRArticlePage() {
  return (
    <article
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: spacing.scale[8],
        lineHeight: "1.8",
      }}
    >
      <Text variant="h1" style={{ marginBottom: spacing.scale[4] }}>
        React Query vs SWR 詳細比較
      </Text>
      <Text
        variant="body"
        color={colors.text.secondary}
        style={{ marginBottom: spacing.scale[12] }}
      >
        6つの実装パターンで理解する両者の違い
      </Text>

      {/* 比較表 */}
      <section style={{ marginBottom: spacing.scale[12] }}>
        <Text variant="h2" style={{ marginBottom: spacing.scale[6] }}>
          SWR vs React Query（核心だけ）
        </Text>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.9rem",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: colors.background.subtle }}>
                <th
                  style={{
                    padding: spacing.scale[3],
                    textAlign: "left",
                    borderBottom: `2px solid ${colors.border.default}`,
                    fontWeight: 600,
                  }}
                >
                  観点
                </th>
                <th
                  style={{
                    padding: spacing.scale[3],
                    textAlign: "left",
                    borderBottom: `2px solid ${colors.border.default}`,
                    fontWeight: 600,
                    color: colors.feedback.info.icon,
                  }}
                >
                  SWR
                </th>
                <th
                  style={{
                    padding: spacing.scale[3],
                    textAlign: "left",
                    borderBottom: `2px solid ${colors.border.default}`,
                    fontWeight: 600,
                    color: colors.brand.primary,
                  }}
                >
                  React Query
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["目的", "データ取得を簡潔に、UI を軽く保つ", "非同期処理を包括的に管理"],
                [
                  "思想",
                  "Stale-While-Revalidate（最新とキャッシュの両立）",
                  "キャッシュ・再フェッチ・更新を体系化",
                ],
                [
                  "状態管理",
                  "data, error, isLoading 程度",
                  "isFetching, isRefetching, status, staleTime, retry, suspense など豊富",
                ],
                [
                  "キャッシュ更新",
                  "mutate 手動管理",
                  "invalidateQueries, setQueryData, refetchOnWindowFocus",
                ],
                ["Mutation (更新系API)", "弱い / 仕組みは薄い", "強い（楽に扱える）"],
                [
                  "依存関係（階層データ）",
                  "自力でキー設計と mutate 制御が必要",
                  "依存クエリで自動管理できる",
                ],
                ["データの楽観的更新", "自前で実装する", "built-in"],
                ["想定規模", "小〜中規模", "中〜大規模"],
                ["学習コスト", "低い", "中〜高（設計力が必要）"],
              ].map(([key, swr, rq], index) => (
                <tr key={index}>
                  <td
                    style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.default}`,
                      fontWeight: 600,
                    }}
                  >
                    {key}
                  </td>
                  <td
                    style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.default}`,
                    }}
                  >
                    {swr}
                  </td>
                  <td
                    style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.default}`,
                    }}
                  >
                    {rq}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 1. Mutation管理 */}
      <section style={{ marginBottom: spacing.scale[12] }}>
        <Text variant="h2" style={{ marginBottom: spacing.scale[6] }}>
          1. Mutation管理
        </Text>

        <div style={{ marginBottom: spacing.scale[8] }}>
          <Text variant="h3" style={{ marginBottom: spacing.scale[4], color: colors.brand.primary }}>
            React Query: 自動で状態管理
          </Text>
          <pre
            style={{
              backgroundColor: "#1e1e1e",
              color: "#d4d4d4",
              padding: spacing.scale[4],
              borderRadius: radii.input.md,
              overflow: "auto",
              fontSize: "0.9rem",
            }}
          >
            {`const deleteMutation = useMutation({
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
</button>`}
          </pre>
          <div
            style={{
              marginTop: spacing.scale[4],
              padding: spacing.scale[4],
              backgroundColor: "#e8f5e9",
              borderRadius: radii.input.md,
            }}
          >
            <Text variant="body-small">
              ✅ <strong>isPending, isError, isSuccess が自動で管理される</strong>
              <br />
              useState で手動管理する必要がない
            </Text>
          </div>
        </div>

        <div style={{ marginBottom: spacing.scale[8] }}>
          <Text
            variant="h3"
            style={{ marginBottom: spacing.scale[4], color: colors.feedback.info.icon }}
          >
            SWR: 手動で状態管理
          </Text>
          <pre
            style={{
              backgroundColor: "#1e1e1e",
              color: "#d4d4d4",
              padding: spacing.scale[4],
              borderRadius: radii.input.md,
              overflow: "auto",
              fontSize: "0.9rem",
            }}
          >
            {`const [isDeleting, setIsDeleting] = useState(false) // ← 手動
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
</button>`}
          </pre>
          <div
            style={{
              marginTop: spacing.scale[4],
              padding: spacing.scale[4],
              backgroundColor: "#fff3e0",
              borderRadius: radii.input.md,
            }}
          >
            <Text variant="body-small">
              ⚠️ <strong>loading/error/success 状態を手動で管理する必要がある</strong>
              <br />
              useState と try-catch を自分で書く必要がある
            </Text>
          </div>
        </div>
      </section>

      {/* 2. 検索パラメータ */}
      <section style={{ marginBottom: spacing.scale[12] }}>
        <Text variant="h2" style={{ marginBottom: spacing.scale[6] }}>
          2. 検索パラメータ
        </Text>

        <div style={{ marginBottom: spacing.scale[8] }}>
          <Text variant="h3" style={{ marginBottom: spacing.scale[4], color: colors.brand.primary }}>
            React Query: queryKey で自動再フェッチ
          </Text>
          <pre
            style={{
              backgroundColor: "#1e1e1e",
              color: "#d4d4d4",
              padding: spacing.scale[4],
              borderRadius: radii.input.md,
              overflow: "auto",
              fontSize: "0.9rem",
            }}
          >
            {`const [params, setParams] = useState({ status: 'all' })

const { data } = useQuery({
  queryKey: ['items', params], // ← params変更で自動再フェッチ
  queryFn: () => getItems(params)
})

// パラメータ変更
setParams({ status: 'active' })`}
          </pre>
          <div
            style={{
              marginTop: spacing.scale[4],
              padding: spacing.scale[4],
              backgroundColor: "#e8f5e9",
              borderRadius: radii.input.md,
            }}
          >
            <Text variant="body-small">
              ✅ <strong>queryKey に params を含めるだけで自動再フェッチ</strong>
              <br />
              URL を構築する必要がない
            </Text>
          </div>
        </div>

        <div style={{ marginBottom: spacing.scale[8] }}>
          <Text
            variant="h3"
            style={{ marginBottom: spacing.scale[4], color: colors.feedback.info.icon }}
          >
            SWR: URL文字列を手動構築
          </Text>
          <pre
            style={{
              backgroundColor: "#1e1e1e",
              color: "#d4d4d4",
              padding: spacing.scale[4],
              borderRadius: radii.input.md,
              overflow: "auto",
              fontSize: "0.9rem",
            }}
          >
            {`const [params, setParams] = useState({ status: 'all' })

// SWR: URL文字列がキーとして機能 ← URL構築が必要
const url = \`/api/items?\${new URLSearchParams(params).toString()}\`
const { data } = useSWR(url, fetcher)

// パラメータ変更
setParams({ status: 'active' })`}
          </pre>
          <div
            style={{
              marginTop: spacing.scale[4],
              padding: spacing.scale[4],
              backgroundColor: "#fff3e0",
              borderRadius: radii.input.md,
            }}
          >
            <Text variant="body-small">
              ⚠️ <strong>URL 文字列を手動で構築する必要がある</strong>
              <br />
              URLSearchParams を使った文字列操作が必要
            </Text>
          </div>
        </div>
      </section>

      {/* 3. キャッシュ無効化 */}
      <section style={{ marginBottom: spacing.scale[12] }}>
        <Text variant="h2" style={{ marginBottom: spacing.scale[6] }}>
          3. キャッシュ無効化
        </Text>

        <div style={{ marginBottom: spacing.scale[8] }}>
          <Text variant="h3" style={{ marginBottom: spacing.scale[4], color: colors.brand.primary }}>
            React Query: 一括無効化
          </Text>
          <pre
            style={{
              backgroundColor: "#1e1e1e",
              color: "#d4d4d4",
              padding: spacing.scale[4],
              borderRadius: radii.input.md,
              overflow: "auto",
              fontSize: "0.9rem",
            }}
          >
            {`// 複数のキャッシュを一括無効化
queryClient.invalidateQueries({ queryKey: ['items'] })
// /api/items
// /api/items/123
// /api/items?status=active
// すべて無効化される`}
          </pre>
          <div
            style={{
              marginTop: spacing.scale[4],
              padding: spacing.scale[4],
              backgroundColor: "#e8f5e9",
              borderRadius: radii.input.md,
            }}
          >
            <Text variant="body-small">
              ✅ <strong>queryKey の前方一致で関連する全キャッシュを一括無効化</strong>
              <br />
              配列ベースのキー管理で階層的に整理しやすい
            </Text>
          </div>
        </div>

        <div style={{ marginBottom: spacing.scale[8] }}>
          <Text
            variant="h3"
            style={{ marginBottom: spacing.scale[4], color: colors.feedback.info.icon }}
          >
            SWR: 個別指定が必要
          </Text>
          <pre
            style={{
              backgroundColor: "#1e1e1e",
              color: "#d4d4d4",
              padding: spacing.scale[4],
              borderRadius: radii.input.md,
              overflow: "auto",
              fontSize: "0.9rem",
            }}
          >
            {`// SWR: URL文字列キーを個別指定して無効化
mutate('/api/items')
mutate('/api/items/123')
mutate((key) => typeof key === 'string' && key.startsWith('/api/items'))`}
          </pre>
          <div
            style={{
              marginTop: spacing.scale[4],
              padding: spacing.scale[4],
              backgroundColor: "#fff3e0",
              borderRadius: radii.input.md,
            }}
          >
            <Text variant="body-small">
              ⚠️ <strong>SWRはURL文字列をキーとして使うため、個別に指定するか関数で前方一致させる必要がある</strong>
              <br />
              React Queryの配列ベースのキーと比べて冗長になりやすい
            </Text>
          </div>
        </div>
      </section>

      {/* 4. 依存クエリ（4階層） */}
      <section style={{ marginBottom: spacing.scale[12] }}>
        <Text variant="h2" style={{ marginBottom: spacing.scale[6] }}>
          4. 依存クエリ（4階層プルダウン）
        </Text>
        <Text variant="body" style={{ marginBottom: spacing.scale[6] }}>
          これが<strong>最も差が出るケース</strong>。地域 → 都道府県 → 市区町村 → 事業所
          の4階層プルダウンを実装する。
        </Text>

        <div style={{ marginBottom: spacing.scale[8] }}>
          <Text variant="h3" style={{ marginBottom: spacing.scale[4], color: colors.brand.primary }}>
            React Query: enabled で宣言的に管理
          </Text>
          <pre
            style={{
              backgroundColor: "#1e1e1e",
              color: "#d4d4d4",
              padding: spacing.scale[4],
              borderRadius: radii.input.md,
              overflow: "auto",
              fontSize: "0.9rem",
            }}
          >
            {`// 1階層目: 地域
const { data: regions } = useQuery({
  queryKey: ['regions'],
  queryFn: getRegions,
})

// 2階層目: 都道府県
const { data: prefectures } = useQuery({
  queryKey: ['prefectures', selectedRegion], // ← 変わると自動で新しいキャッシュキー
  queryFn: () => getPrefectures(selectedRegion),
  enabled: selectedRegion.length > 0, // ← 親が選択されるまで自動的に待機
})

// 3階層目: 市区町村
const { data: cities } = useQuery({
  queryKey: ['cities', selectedPrefecture], // ← 変わると自動で新しいキャッシュキー
  queryFn: () => getCities(selectedPrefecture),
  enabled: selectedPrefecture.length > 0, // ← 親が選択されるまで自動的に待機
})

// 4階層目: 事業所
const { data: offices } = useQuery({
  queryKey: ['offices', selectedCity], // ← 変わると自動で新しいキャッシュキー
  queryFn: () => getOffices(selectedCity),
  enabled: selectedCity.length > 0, // ← 親が選択されるまで自動的に待機
})

const handleRegionChange = (e) => {
  setSelectedRegion(e.target.value)
  setSelectedPrefecture('')
  setSelectedCity('')
  setSelectedOffice('')
  // React Query: queryKeyが変わるだけで古いキャッシュは自動破棄される
  // mutateやinvalidateを呼ぶ必要なし！
}`}
          </pre>
          <div
            style={{
              marginTop: spacing.scale[4],
              padding: spacing.scale[4],
              backgroundColor: "#e8f5e9",
              borderRadius: radii.input.md,
            }}
          >
            <Text variant="body-small">
              ✅ <strong>enabled で依存関係を宣言的に管理</strong>
              <br />
              ✅ <strong>親が選択されたら自動で子を取得</strong>
              <br />
              ✅ <strong>各階層のローディング状態も自動管理</strong>
              <br />
              ✅ <strong>queryKey が変わるだけで自動的に新しいクエリになる</strong>
              <br />
              ✅ <strong>mutate や invalidate を呼ぶ必要なし！</strong>
            </Text>
          </div>
        </div>

        <div style={{ marginBottom: spacing.scale[8] }}>
          <Text
            variant="h3"
            style={{ marginBottom: spacing.scale[4], color: colors.feedback.info.icon }}
          >
            SWR: URL構築 + null条件分岐 + 手動mutate
          </Text>
          <pre
            style={{
              backgroundColor: "#1e1e1e",
              color: "#d4d4d4",
              padding: spacing.scale[4],
              borderRadius: radii.input.md,
              overflow: "auto",
              fontSize: "0.9rem",
            }}
          >
            {`const { mutate: globalMutate } = useSWRConfig() // グローバルmutateを取得

// 1階層目: 地域
const { data: regions } = useSWR('/api/regions', fetcher)

// 2階層目: 都道府県（手動でURL構築 + null チェック）
const prefecturesUrl = selectedRegion
  ? \`/api/prefectures?region=\${selectedRegion}\`
  : null
const { data: prefectures } = useSWR(prefecturesUrl, fetcher)

// 3階層目: 市区町村（手動でURL構築 + null チェック）
const citiesUrl = selectedPrefecture
  ? \`/api/cities?prefecture=\${selectedPrefecture}\`
  : null
const { data: cities } = useSWR(citiesUrl, fetcher)

// 4階層目: 事業所（手動でURL構築 + null チェック）
const officesUrl = selectedCity
  ? \`/api/offices?city=\${selectedCity}\`
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
}`}
          </pre>
          <div
            style={{
              marginTop: spacing.scale[4],
              padding: spacing.scale[4],
              backgroundColor: "#fff3e0",
              borderRadius: radii.input.md,
            }}
          >
            <Text variant="body-small">
              ⚠️ <strong>SWRはURL文字列をキーとして使うため、各階層でURL を手動で構築する必要がある</strong>
              <br />
              ⚠️ <strong>null チェックで依存関係を表現（冗長）</strong>
              <br />
              ⚠️ <strong>各階層で三項演算子を書く必要がある</strong>
              <br />
              ⚠️ <strong>手動で globalMutate を呼んでキャッシュをクリアする必要がある</strong>
            </Text>
          </div>
        </div>
      </section>

      {/* 重要な概念 */}
      <section style={{ marginBottom: spacing.scale[12] }}>
        <Text variant="h2" style={{ marginBottom: spacing.scale[6] }}>
          重要な概念: enabled と mutate の違い
        </Text>

        <div
          style={{
            padding: spacing.scale[6],
            backgroundColor: colors.background.subtle,
            borderRadius: radii.card.md,
            marginBottom: spacing.scale[6],
          }}
        >
          <Text variant="h3" style={{ marginBottom: spacing.scale[4] }}>
            enabled とは（React Query）
          </Text>
          <Text variant="body" style={{ marginBottom: spacing.scale[4] }}>
            <strong>データを取得（fetch）するかどうかの条件</strong>
          </Text>
          <ul style={{ marginLeft: spacing.scale[6], marginBottom: spacing.scale[4] }}>
            <li>
              <Text variant="body">
                <code>enabled: true</code> → API リクエストを送る
              </Text>
            </li>
            <li>
              <Text variant="body">
                <code>enabled: false</code> → API リクエストを送らない（待機状態）
              </Text>
            </li>
          </ul>
        </div>

        <div
          style={{
            padding: spacing.scale[6],
            backgroundColor: colors.background.subtle,
            borderRadius: radii.card.md,
            marginBottom: spacing.scale[6],
          }}
        >
          <Text variant="h3" style={{ marginBottom: spacing.scale[4] }}>
            mutate / invalidateQueries とは
          </Text>
          <Text variant="body" style={{ marginBottom: spacing.scale[4] }}>
            <strong>キャッシュを更新・無効化する関数</strong>
          </Text>
          <Text variant="body">
            ボタンクリック時など、任意のタイミングでキャッシュを手動で無効化・再取得する
          </Text>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: colors.background.subtle }}>
                <th
                  style={{
                    padding: spacing.scale[3],
                    textAlign: "left",
                    borderBottom: `2px solid ${colors.border.default}`,
                  }}
                ></th>
                <th
                  style={{
                    padding: spacing.scale[3],
                    textAlign: "left",
                    borderBottom: `2px solid ${colors.border.default}`,
                  }}
                >
                  用途
                </th>
                <th
                  style={{
                    padding: spacing.scale[3],
                    textAlign: "left",
                    borderBottom: `2px solid ${colors.border.default}`,
                  }}
                >
                  タイミング
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: spacing.scale[3],
                    borderBottom: `1px solid ${colors.border.default}`,
                    fontWeight: 600,
                  }}
                >
                  enabled
                </td>
                <td
                  style={{
                    padding: spacing.scale[3],
                    borderBottom: `1px solid ${colors.border.default}`,
                  }}
                >
                  データを取得するかどうかの<strong>条件</strong>
                </td>
                <td
                  style={{
                    padding: spacing.scale[3],
                    borderBottom: `1px solid ${colors.border.default}`,
                  }}
                >
                  初回レンダー時・依存値が変わった時
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: spacing.scale[3],
                    fontWeight: 600,
                  }}
                >
                  mutate / invalidateQueries
                </td>
                <td style={{ padding: spacing.scale[3] }}>
                  キャッシュを<strong>手動で更新・無効化</strong>
                </td>
                <td style={{ padding: spacing.scale[3] }}>
                  ボタンクリック時など、任意のタイミング
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* enabled の嬉しさ */}
      <section style={{ marginBottom: spacing.scale[12] }}>
        <Text variant="h2" style={{ marginBottom: spacing.scale[6] }}>
          enabled の嬉しさ
        </Text>
        <Text variant="body" style={{ marginBottom: spacing.scale[6] }}>
          <code>enabled</code> は React Query の<strong>最も強力な機能の1つ</strong>
          。SWRの <code>null</code> パターンと比較して、以下の点で優れている。
        </Text>

        <div
          style={{
            padding: spacing.scale[6],
            backgroundColor: "#e8f5e9",
            borderRadius: radii.card.md,
            marginBottom: spacing.scale[6],
          }}
        >
          <Text variant="h3" style={{ marginBottom: spacing.scale[4] }}>
            1. 宣言的で読みやすい
          </Text>
          <pre
            style={{
              backgroundColor: "#1e1e1e",
              color: "#d4d4d4",
              padding: spacing.scale[4],
              borderRadius: radii.input.md,
              overflow: "auto",
              fontSize: "0.9rem",
              marginBottom: spacing.scale[4],
            }}
          >
            {`// React Query: 宣言的で読みやすい
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => getUser(userId),
  enabled: !!userId, // userIdがあるときだけ実行
})

const { data: posts } = useQuery({
  queryKey: ['posts', userId],
  queryFn: () => getPosts(userId),
  enabled: !!user, // userが取得できたら実行
})`}
          </pre>
          <pre
            style={{
              backgroundColor: "#1e1e1e",
              color: "#d4d4d4",
              padding: spacing.scale[4],
              borderRadius: radii.input.md,
              overflow: "auto",
              fontSize: "0.9rem",
            }}
          >
            {`// SWR: 命令的で条件分岐が必要
const { data: user } = useSWR(
  userId ? \`/api/users/\${userId}\` : null, // ← nullで「実行しない」を表現
  fetcher
)

const { data: posts } = useSWR(
  user ? \`/api/posts?userId=\${user.id}\` : null, // ← 三項演算子が増える
  fetcher
)`}
          </pre>
        </div>

        <div
          style={{
            padding: spacing.scale[6],
            backgroundColor: "#e8f5e9",
            borderRadius: radii.card.md,
            marginBottom: spacing.scale[6],
          }}
        >
          <Text variant="h3" style={{ marginBottom: spacing.scale[4] }}>
            2. 複数条件を組み合わせやすい
          </Text>
          <pre
            style={{
              backgroundColor: "#1e1e1e",
              color: "#d4d4d4",
              padding: spacing.scale[4],
              borderRadius: radii.input.md,
              overflow: "auto",
              fontSize: "0.9rem",
              marginBottom: spacing.scale[4],
            }}
          >
            {`// React Query: 複数条件をAND/ORで組み合わせやすい
const { data } = useQuery({
  queryKey: ['data', params],
  queryFn: () => fetchData(params),
  enabled: isAuthenticated && hasPermission && params.id > 0,
})`}
          </pre>
          <pre
            style={{
              backgroundColor: "#1e1e1e",
              color: "#d4d4d4",
              padding: spacing.scale[4],
              borderRadius: radii.input.md,
              overflow: "auto",
              fontSize: "0.9rem",
            }}
          >
            {`// SWR: URL構築に条件を埋め込む必要がある（複雑になりやすい）
const url = (isAuthenticated && hasPermission && params.id > 0)
  ? \`/api/data?id=\${params.id}\`
  : null
const { data } = useSWR(url, fetcher)`}
          </pre>
        </div>

        <div
          style={{
            padding: spacing.scale[6],
            backgroundColor: "#e8f5e9",
            borderRadius: radii.card.md,
            marginBottom: spacing.scale[6],
          }}
        >
          <Text variant="h3" style={{ marginBottom: spacing.scale[4] }}>
            3. 「取得するか」と「何を取得するか」を分離できる
          </Text>
          <pre
            style={{
              backgroundColor: "#1e1e1e",
              color: "#d4d4d4",
              padding: spacing.scale[4],
              borderRadius: radii.input.md,
              overflow: "auto",
              fontSize: "0.9rem",
              marginBottom: spacing.scale[4],
            }}
          >
            {`// React Query: 関心の分離
const { data } = useQuery({
  queryKey: ['items', searchParams], // ← 何を取得するか（キー）
  queryFn: () => getItems(searchParams), // ← どう取得するか
  enabled: searchParams.query.length > 2, // ← いつ取得するか（条件）
})`}
          </pre>
          <pre
            style={{
              backgroundColor: "#1e1e1e",
              color: "#d4d4d4",
              padding: spacing.scale[4],
              borderRadius: radii.input.md,
              overflow: "auto",
              fontSize: "0.9rem",
            }}
          >
            {`// SWR: URL構築とタイミング制御が混在
const url = searchParams.query.length > 2
  ? \`/api/items?query=\${searchParams.query}\` // ← 条件とURL構築が混在
  : null
const { data } = useSWR(url, fetcher)`}
          </pre>
        </div>

        <div
          style={{
            padding: spacing.scale[6],
            backgroundColor: "#e8f5e9",
            borderRadius: radii.card.md,
            marginBottom: spacing.scale[6],
          }}
        >
          <Text variant="h3" style={{ marginBottom: spacing.scale[4] }}>
            4. デバッグしやすい
          </Text>
          <Text variant="body" style={{ marginBottom: spacing.scale[4] }}>
            React Query DevTools で <code>enabled</code> の状態が可視化される。
            <code>disabled</code> と表示されるため、なぜリクエストが送信されないか一目で分かる。
          </Text>
          <Text variant="body">
            SWR では <code>null</code> が渡されているだけなので、デバッグが難しい。
          </Text>
        </div>

        <div
          style={{
            padding: spacing.scale[6],
            backgroundColor: colors.feedback.success.bg,
            borderRadius: radii.card.md,
          }}
        >
          <Text variant="h3" style={{ marginBottom: spacing.scale[4] }}>
            まとめ
          </Text>
          <ul style={{ marginLeft: spacing.scale[6] }}>
            <li>
              <Text variant="body">
                <strong>宣言的で読みやすい</strong>（三項演算子が不要）
              </Text>
            </li>
            <li>
              <Text variant="body">
                <strong>複数条件を組み合わせやすい</strong>
              </Text>
            </li>
            <li>
              <Text variant="body">
                <strong>関心の分離</strong>（キー、フェッチ処理、実行条件を分離）
              </Text>
            </li>
            <li>
              <Text variant="body">
                <strong>デバッグしやすい</strong>（DevToolsで状態が可視化される）
              </Text>
            </li>
          </ul>
          <Text variant="body" style={{ marginTop: spacing.scale[4] }}>
            特に<strong>4階層プルダウンのような複雑な依存関係</strong>がある場合、SWRの{" "}
            <code>null</code> パターンは冗長になりがちだが、React Queryの <code>enabled</code>{" "}
            は<strong>シンプルで保守しやすい</strong>コードになる。
          </Text>
        </div>
      </section>

      {/* 結論 */}
      <section style={{ marginBottom: spacing.scale[12] }}>
        <Text variant="h2" style={{ marginBottom: spacing.scale[6] }}>
          結論
        </Text>
        <div
          style={{
            padding: spacing.scale[6],
            backgroundColor: colors.feedback.success.bg,
            borderRadius: radii.card.md,
            marginBottom: spacing.scale[6],
          }}
        >
          <Text variant="h3" style={{ marginBottom: spacing.scale[4] }}>
            4階層の依存関係がある場合、React Query の方が圧倒的に楽で安全
          </Text>
          <ul style={{ marginLeft: spacing.scale[6] }}>
            <li>
              <Text variant="body">
                <strong>React Query:</strong> enabled + queryKey の自動管理
              </Text>
            </li>
            <li>
              <Text variant="body">
                <strong>SWR:</strong> URL 構築 + null 条件分岐 + 手動 mutate
              </Text>
            </li>
          </ul>
        </div>

        <Text variant="h3" style={{ marginBottom: spacing.scale[4] }}>
          React Query を選ぶべきケース
        </Text>
        <ul style={{ marginLeft: spacing.scale[6], marginBottom: spacing.scale[6] }}>
          <li>
            <Text variant="body">
              <strong>複雑な依存関係がある場合</strong>（4階層プルダウンなど）
            </Text>
          </li>
          <li>
            <Text variant="body">
              <strong>Mutation が多い場合</strong>
            </Text>
          </li>
          <li>
            <Text variant="body">
              <strong>楽観的更新が必要な場合</strong>
            </Text>
          </li>
          <li>
            <Text variant="body">
              <strong>中〜大規模なプロジェクト</strong>
            </Text>
          </li>
        </ul>

        <Text variant="h3" style={{ marginBottom: spacing.scale[4] }}>
          SWR を選ぶべきケース
        </Text>
        <ul style={{ marginLeft: spacing.scale[6], marginBottom: spacing.scale[6] }}>
          <li>
            <Text variant="body">
              <strong>小規模なプロジェクト</strong>
            </Text>
          </li>
          <li>
            <Text variant="body">
              <strong>Vercel / Next.js との親和性を重視する場合</strong>
            </Text>
          </li>
          <li>
            <Text variant="body">
              <strong>軽量さを重視する場合</strong>
            </Text>
          </li>
        </ul>
      </section>

      {/* リンク */}
      <section>
        <Text variant="h2" style={{ marginBottom: spacing.scale[6] }}>
          関連リンク
        </Text>
        <ul style={{ marginLeft: spacing.scale[6] }}>
          <li>
            <a
              href="/examples/react-query-vs-swr"
              style={{ color: colors.brand.primary, textDecoration: "underline" }}
            >
              実装デモ: React Query vs SWR 比較
            </a>
          </li>
          <li>
            <a
              href="https://tanstack.com/query/latest"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: colors.brand.primary, textDecoration: "underline" }}
            >
              React Query 公式ドキュメント
            </a>
          </li>
          <li>
            <a
              href="https://swr.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: colors.brand.primary, textDecoration: "underline" }}
            >
              SWR 公式ドキュメント
            </a>
          </li>
        </ul>
      </section>
    </article>
  );
}
