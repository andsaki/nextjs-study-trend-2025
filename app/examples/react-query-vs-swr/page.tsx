"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Text } from "@/src/design-system/components/Text";
import { colors, spacing, radii } from "@/src/design-system/tokens";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SWRConfig } from "swr";
import { ReactQueryDemo } from "./ReactQueryDemo";
import { SWRDemo } from "./SWRDemo";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

type DemoType = "mutation" | "params" | "cache" | "optimistic" | "refetch" | "dependent";

function PageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeDemo = (searchParams.get("demo") as DemoType) || "mutation";

  const setActiveDemo = (demo: DemoType) => {
    router.push(`/examples/react-query-vs-swr?demo=${demo}`);
  };

  const demos: { type: DemoType; title: string; description: string }[] = [
    {
      type: "mutation",
      title: "1. Mutation管理",
      description: "loading/error状態の管理がReact Queryは自動、SWRは手動",
    },
    {
      type: "params",
      title: "2. 検索パラメータ",
      description: "パラメータ変更時の再フェッチの扱い方の違い",
    },
    {
      type: "cache",
      title: "3. キャッシュ無効化",
      description: "invalidateQueries vs mutate の違い",
    },
    {
      type: "optimistic",
      title: "4. 楽観的更新",
      description: "setQueryDataで即座にUIを更新、SWRは手動実装が必要",
    },
    {
      type: "refetch",
      title: "5. ウィンドウフォーカス時の再取得",
      description: "refetchOnWindowFocusで常に最新データを保つ",
    },
    {
      type: "dependent",
      title: "6. 依存クエリ（4階層）",
      description: "地域→都道府県→市区町村→事業所の4階層プルダウン",
    },
  ];

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: spacing.scale[8] }}>
      <Text variant="h1" style={{ marginBottom: spacing.scale[4] }}>
        React Query vs SWR 比較デモ
      </Text>
      <Text
        variant="body-large"
        color={colors.text.secondary}
        style={{ marginBottom: spacing.scale[8] }}
      >
        実際のコードで両者の違いを体験する
      </Text>

      {/* デモ選択タブ */}
      <div
        style={{
          display: "flex",
          gap: spacing.scale[4],
          marginBottom: spacing.scale[8],
          borderBottom: `1px solid ${colors.border.default}`,
        }}
      >
        {demos.map((demo) => (
          <button
            key={demo.type}
            onClick={() => setActiveDemo(demo.type)}
            style={{
              padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
              border: "none",
              borderBottom: `3px solid ${
                activeDemo === demo.type ? colors.brand.primary : "transparent"
              }`,
              backgroundColor: "transparent",
              color: activeDemo === demo.type ? colors.brand.primary : colors.text.secondary,
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: activeDemo === demo.type ? 600 : 400,
              transition: "all 0.2s",
            }}
          >
            {demo.title}
          </button>
        ))}
      </div>

      {/* 説明 */}
      <div
        style={{
          padding: spacing.scale[6],
          backgroundColor: colors.background.subtle,
          borderRadius: radii.card.md,
          marginBottom: spacing.scale[8],
        }}
      >
        <Text variant="body">
          {demos.find((d) => d.type === activeDemo)?.description}
        </Text>
      </div>

      {/* 比較デモ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: spacing.scale[8],
        }}
      >
        <QueryClientProvider client={queryClient}>
          <div
            style={{
              border: `2px solid ${colors.brand.primary}`,
              borderRadius: radii.card.lg,
              padding: spacing.scale[6],
            }}
          >
            <Text
              variant="h3"
              color={colors.brand.primary}
              style={{ marginBottom: spacing.scale[6] }}
            >
              React Query
            </Text>
            <ReactQueryDemo demoType={activeDemo} />
          </div>
        </QueryClientProvider>

        <SWRConfig
          value={{
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
          }}
        >
          <div
            style={{
              border: `2px solid ${colors.feedback.info.icon}`,
              borderRadius: radii.card.lg,
              padding: spacing.scale[6],
            }}
          >
            <Text
              variant="h3"
              color={colors.feedback.info.icon}
              style={{ marginBottom: spacing.scale[6] }}
            >
              SWR
            </Text>
            <SWRDemo demoType={activeDemo} />
          </div>
        </SWRConfig>
      </div>

      {/* 比較表 */}
      <div style={{ marginTop: spacing.scale[12] }}>
        <Text variant="h2" style={{ marginBottom: spacing.scale[6] }}>
          SWR vs React Query 比較（核心だけ）
        </Text>
        <div
          style={{
            overflowX: "auto",
            marginBottom: spacing.scale[8],
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: colors.background.default,
              borderRadius: radii.card.md,
            }}
          >
            <thead>
              <tr style={{ backgroundColor: colors.background.subtle }}>
                <th
                  style={{
                    padding: spacing.scale[4],
                    textAlign: "left",
                    borderBottom: `2px solid ${colors.border.default}`,
                    fontWeight: 600,
                  }}
                >
                  観点
                </th>
                <th
                  style={{
                    padding: spacing.scale[4],
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
                    padding: spacing.scale[4],
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
              <tr>
                <td
                  style={{
                    padding: spacing.scale[4],
                    borderBottom: `1px solid ${colors.border.default}`,
                    fontWeight: 600,
                  }}
                >
                  目的
                </td>
                <td style={{ padding: spacing.scale[4], borderBottom: `1px solid ${colors.border.default}` }}>
                  データ取得を簡潔に、UI を軽く保つ
                </td>
                <td style={{ padding: spacing.scale[4], borderBottom: `1px solid ${colors.border.default}` }}>
                  非同期処理を包括的に管理
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: spacing.scale[4],
                    borderBottom: `1px solid ${colors.border.default}`,
                    fontWeight: 600,
                  }}
                >
                  思想
                </td>
                <td style={{ padding: spacing.scale[4], borderBottom: `1px solid ${colors.border.default}` }}>
                  Stale-While-Revalidate（最新とキャッシュの両立）
                </td>
                <td style={{ padding: spacing.scale[4], borderBottom: `1px solid ${colors.border.default}` }}>
                  キャッシュ・再フェッチ・更新を体系化
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: spacing.scale[4],
                    borderBottom: `1px solid ${colors.border.default}`,
                    fontWeight: 600,
                  }}
                >
                  状態管理
                </td>
                <td style={{ padding: spacing.scale[4], borderBottom: `1px solid ${colors.border.default}` }}>
                  data, error, isLoading 程度
                </td>
                <td style={{ padding: spacing.scale[4], borderBottom: `1px solid ${colors.border.default}` }}>
                  isFetching, isRefetching, status, staleTime, retry, suspense など豊富
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: spacing.scale[4],
                    borderBottom: `1px solid ${colors.border.default}`,
                    fontWeight: 600,
                  }}
                >
                  キャッシュ更新
                </td>
                <td style={{ padding: spacing.scale[4], borderBottom: `1px solid ${colors.border.default}` }}>
                  mutate 手動管理
                </td>
                <td style={{ padding: spacing.scale[4], borderBottom: `1px solid ${colors.border.default}` }}>
                  invalidateQueries, setQueryData, refetchOnWindowFocus
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: spacing.scale[4],
                    borderBottom: `1px solid ${colors.border.default}`,
                    fontWeight: 600,
                  }}
                >
                  Mutation (更新系API)
                </td>
                <td style={{ padding: spacing.scale[4], borderBottom: `1px solid ${colors.border.default}` }}>
                  弱い / 仕組みは薄い
                </td>
                <td style={{ padding: spacing.scale[4], borderBottom: `1px solid ${colors.border.default}` }}>
                  強い（楽に扱える）
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: spacing.scale[4],
                    borderBottom: `1px solid ${colors.border.default}`,
                    fontWeight: 600,
                  }}
                >
                  依存関係（階層データ）
                </td>
                <td style={{ padding: spacing.scale[4], borderBottom: `1px solid ${colors.border.default}` }}>
                  自力でキー設計と mutate 制御が必要
                </td>
                <td style={{ padding: spacing.scale[4], borderBottom: `1px solid ${colors.border.default}` }}>
                  依存クエリで自動管理できる
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: spacing.scale[4],
                    borderBottom: `1px solid ${colors.border.default}`,
                    fontWeight: 600,
                  }}
                >
                  データの楽観的更新
                </td>
                <td style={{ padding: spacing.scale[4], borderBottom: `1px solid ${colors.border.default}` }}>
                  自前で実装する
                </td>
                <td style={{ padding: spacing.scale[4], borderBottom: `1px solid ${colors.border.default}` }}>
                  built-in
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: spacing.scale[4],
                    borderBottom: `1px solid ${colors.border.default}`,
                    fontWeight: 600,
                  }}
                >
                  想定規模
                </td>
                <td style={{ padding: spacing.scale[4], borderBottom: `1px solid ${colors.border.default}` }}>
                  小〜中規模
                </td>
                <td style={{ padding: spacing.scale[4], borderBottom: `1px solid ${colors.border.default}` }}>
                  中〜大規模
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: spacing.scale[4],
                    fontWeight: 600,
                  }}
                >
                  学習コスト
                </td>
                <td style={{ padding: spacing.scale[4] }}>低い</td>
                <td style={{ padding: spacing.scale[4] }}>中〜高（設計力が必要）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* コード比較 */}
      <div style={{ marginTop: spacing.scale[12] }}>
        <Text variant="h2" style={{ marginBottom: spacing.scale[6] }}>
          コード比較
        </Text>
        <div
          style={{
            padding: spacing.scale[6],
            backgroundColor: colors.background.subtle,
            borderRadius: radii.card.md,
          }}
        >
          {activeDemo === "mutation" && (
            <>
              <Text variant="h4" style={{ marginBottom: spacing.scale[4] }}>
                React Query
              </Text>
              <pre
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "#d4d4d4",
                  padding: spacing.scale[4],
                  borderRadius: radii.input.md,
                  overflow: "auto",
                  marginBottom: spacing.scale[6],
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

              <Text variant="h4" style={{ marginBottom: spacing.scale[4] }}>
                SWR
              </Text>
              <pre
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "#d4d4d4",
                  padding: spacing.scale[4],
                  borderRadius: radii.input.md,
                  overflow: "auto",
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
            </>
          )}

          {activeDemo === "params" && (
            <>
              <Text variant="h4" style={{ marginBottom: spacing.scale[4] }}>
                React Query
              </Text>
              <pre
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "#d4d4d4",
                  padding: spacing.scale[4],
                  borderRadius: radii.input.md,
                  overflow: "auto",
                  marginBottom: spacing.scale[6],
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

              <Text variant="h4" style={{ marginBottom: spacing.scale[4] }}>
                SWR
              </Text>
              <pre
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "#d4d4d4",
                  padding: spacing.scale[4],
                  borderRadius: radii.input.md,
                  overflow: "auto",
                }}
              >
                {`const [params, setParams] = useState({ status: 'all' })

// SWR: URL文字列がキーとして機能 ← URL構築が必要
const url = \`/api/items?\${new URLSearchParams(params).toString()}\`
const { data } = useSWR(url, fetcher)

// パラメータ変更
setParams({ status: 'active' })`}
              </pre>
            </>
          )}

          {activeDemo === "cache" && (
            <>
              <Text variant="h4" style={{ marginBottom: spacing.scale[4] }}>
                React Query
              </Text>
              <pre
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "#d4d4d4",
                  padding: spacing.scale[4],
                  borderRadius: radii.input.md,
                  overflow: "auto",
                  marginBottom: spacing.scale[6],
                }}
              >
                {`// 複数のキャッシュを一括無効化
queryClient.invalidateQueries({ queryKey: ['items'] })
// /api/items
// /api/items/123
// /api/items?status=active
// すべて無効化される`}
              </pre>

              <Text variant="h4" style={{ marginBottom: spacing.scale[4] }}>
                SWR
              </Text>
              <pre
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "#d4d4d4",
                  padding: spacing.scale[4],
                  borderRadius: radii.input.md,
                  overflow: "auto",
                }}
              >
                {`// SWR: URL文字列キーを個別指定して無効化
mutate('/api/items')
mutate('/api/items/123')
mutate((key) => typeof key === 'string' && key.startsWith('/api/items'))`}
              </pre>
            </>
          )}

          {activeDemo === "optimistic" && (
            <>
              <Text variant="h4" style={{ marginBottom: spacing.scale[4] }}>
                React Query
              </Text>
              <pre
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "#d4d4d4",
                  padding: spacing.scale[4],
                  borderRadius: radii.input.md,
                  overflow: "auto",
                  marginBottom: spacing.scale[6],
                }}
              >
                {`const updateMutation = useMutation({
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
</button>`}
              </pre>

              <Text variant="h4" style={{ marginBottom: spacing.scale[4] }}>
                SWR
              </Text>
              <pre
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "#d4d4d4",
                  padding: spacing.scale[4],
                  borderRadius: radii.input.md,
                  overflow: "auto",
                }}
              >
                {`const { data, mutate } = useSWR('/api/items', fetcher)

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
}`}
              </pre>
            </>
          )}

          {activeDemo === "refetch" && (
            <>
              <Text variant="h4" style={{ marginBottom: spacing.scale[4] }}>
                React Query
              </Text>
              <pre
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "#d4d4d4",
                  padding: spacing.scale[4],
                  borderRadius: radii.input.md,
                  overflow: "auto",
                  marginBottom: spacing.scale[6],
                }}
              >
                {`const { data } = useQuery({
  queryKey: ['items'],
  queryFn: getItems,
  refetchOnWindowFocus: true // ← デフォルトで有効
})

// ブラウザタブに戻るだけで自動的に再取得
// 設定不要！`}
              </pre>

              <Text variant="h4" style={{ marginBottom: spacing.scale[4] }}>
                SWR
              </Text>
              <pre
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "#d4d4d4",
                  padding: spacing.scale[4],
                  borderRadius: radii.input.md,
                  overflow: "auto",
                }}
              >
                {`const { data } = useSWR('/api/items', fetcher, {
  revalidateOnFocus: true // ← デフォルトで有効
})

// SWRも同じ機能を持っているが、
// React Queryはより細かく制御可能
// (refetchOnMount, refetchOnReconnect, etc.)`}
              </pre>
            </>
          )}

          {activeDemo === "dependent" && (
            <>
              <Text variant="h4" style={{ marginBottom: spacing.scale[4] }}>
                React Query
              </Text>
              <pre
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "#d4d4d4",
                  padding: spacing.scale[4],
                  borderRadius: radii.input.md,
                  overflow: "auto",
                  marginBottom: spacing.scale[6],
                }}
              >
                {`const { data: regions } = useQuery({
  queryKey: ['regions'],
  queryFn: getRegions
})

const { data: prefectures } = useQuery({
  queryKey: ['prefectures', selectedRegion],
  queryFn: () => getPrefectures(selectedRegion),
  enabled: !!selectedRegion // ← 1階層目が選ばれたら自動発火
})

const { data: cities } = useQuery({
  queryKey: ['cities', selectedPrefecture],
  queryFn: () => getCities(selectedPrefecture),
  enabled: !!selectedPrefecture // ← 2階層目が選ばれたら自動発火
})

const { data: offices } = useQuery({
  queryKey: ['offices', selectedCity],
  queryFn: () => getOffices(selectedCity),
  enabled: !!selectedCity // ← 3階層目が選ばれたら自動発火
})`}
              </pre>

              <Text variant="h4" style={{ marginBottom: spacing.scale[4] }}>
                SWR
              </Text>
              <pre
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "#d4d4d4",
                  padding: spacing.scale[4],
                  borderRadius: radii.input.md,
                  overflow: "auto",
                }}
              >
                {`const { data: regions } = useSWR('/api/regions', fetcher)

// SWR: URL文字列がキー、null で待機状態を表現
const { data: prefectures } = useSWR(
  selectedRegion ? \`/api/prefectures?region=\${selectedRegion}\` : null,
  fetcher
)

const { data: cities } = useSWR(
  selectedPrefecture ? \`/api/cities?prefecture=\${selectedPrefecture}\` : null,
  fetcher
)

const { data: offices } = useSWR(
  selectedCity ? \`/api/offices?city=\${selectedCity}\` : null,
  fetcher
)

// 各階層でURL構築とnullチェックが必要`}
              </pre>
            </>
          )}
        </div>
      </div>

      {/* 重要な概念: enabled と mutate の違い */}
      <div style={{ marginTop: spacing.scale[12] }}>
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
          <ul style={{ marginLeft: spacing.scale[6] }}>
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
          <Text variant="body">
            <strong>キャッシュを更新・無効化する関数</strong>。ボタンクリック時など、任意のタイミングでキャッシュを手動で無効化・再取得する。
          </Text>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: colors.background.default,
              borderRadius: radii.card.md,
            }}
          >
            <thead>
              <tr style={{ backgroundColor: colors.background.subtle }}>
                <th
                  style={{
                    padding: spacing.scale[4],
                    textAlign: "left",
                    borderBottom: `2px solid ${colors.border.default}`,
                    fontWeight: 600,
                  }}
                ></th>
                <th
                  style={{
                    padding: spacing.scale[4],
                    textAlign: "left",
                    borderBottom: `2px solid ${colors.border.default}`,
                    fontWeight: 600,
                  }}
                >
                  用途
                </th>
                <th
                  style={{
                    padding: spacing.scale[4],
                    textAlign: "left",
                    borderBottom: `2px solid ${colors.border.default}`,
                    fontWeight: 600,
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
                    padding: spacing.scale[4],
                    borderBottom: `1px solid ${colors.border.default}`,
                    fontWeight: 600,
                  }}
                >
                  enabled
                </td>
                <td
                  style={{
                    padding: spacing.scale[4],
                    borderBottom: `1px solid ${colors.border.default}`,
                  }}
                >
                  データを取得するかどうかの<strong>条件</strong>
                </td>
                <td
                  style={{
                    padding: spacing.scale[4],
                    borderBottom: `1px solid ${colors.border.default}`,
                  }}
                >
                  初回レンダー時・依存値が変わった時
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: spacing.scale[4],
                    fontWeight: 600,
                  }}
                >
                  mutate / invalidateQueries
                </td>
                <td style={{ padding: spacing.scale[4] }}>
                  キャッシュを<strong>手動で更新・無効化</strong>
                </td>
                <td style={{ padding: spacing.scale[4] }}>
                  ボタンクリック時など、任意のタイミング
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* enabled の嬉しさ */}
      <div style={{ marginTop: spacing.scale[12] }}>
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
      </div>

      {/* invalidateQueries が必要なケース */}
      <div style={{ marginTop: spacing.scale[12] }}>
        <Text variant="h2" style={{ marginBottom: spacing.scale[6] }}>
          invalidateQueries が必要なケース
        </Text>
        <div
          style={{
            padding: spacing.scale[6],
            backgroundColor: "#e8f5e9",
            borderRadius: radii.card.md,
            marginBottom: spacing.scale[6],
          }}
        >
          <Text variant="body" style={{ marginBottom: spacing.scale[4] }}>
            依存クエリ（4階層プルダウン）では <code>invalidateQueries</code> を
            <strong>使わなくていい</strong>。理由：
          </Text>
          <Text variant="body" style={{ fontWeight: 600 }}>
            queryKey が変わると、React Query は自動的に新しいクエリとして扱うから。
          </Text>
        </div>

        <pre
          style={{
            backgroundColor: "#1e1e1e",
            color: "#d4d4d4",
            padding: spacing.scale[4],
            borderRadius: radii.input.md,
            overflow: "auto",
            marginBottom: spacing.scale[6],
          }}
        >
          {`// 東京を選択した時
queryKey: ["cities", "tokyo"] // ← このキャッシュを使う

// 大阪に変更した時
queryKey: ["cities", "osaka"] // ← 全く別のキャッシュとして扱われる

// 古い "tokyo" のキャッシュは自動的に無視される（GCで削除）`}
        </pre>

        <div
          style={{
            padding: spacing.scale[6],
            backgroundColor: "#fff3e0",
            borderRadius: radii.card.md,
            marginBottom: spacing.scale[6],
          }}
        >
          <Text variant="h3" style={{ marginBottom: spacing.scale[4] }}>
            invalidateQueries が必要なケース
          </Text>
          <Text variant="body" style={{ marginBottom: spacing.scale[4] }}>
            <strong>同じ queryKey のデータを更新した時</strong>
          </Text>
          <pre
            style={{
              backgroundColor: "#1e1e1e",
              color: "#d4d4d4",
              padding: spacing.scale[4],
              borderRadius: radii.input.md,
              overflow: "auto",
              marginBottom: spacing.scale[4],
            }}
          >
            {`const deleteMutation = useMutation({
  mutationFn: deleteItem,
  onSuccess: () => {
    // 削除後、同じqueryKeyのキャッシュを無効化して再取得
    queryClient.invalidateQueries({ queryKey: ["items"] })
  }
})`}
          </pre>
          <Text variant="body-small">
            この場合：queryKey は <code>["items"]</code>{" "}
            のまま変わらないが、サーバー側のデータは変わった（削除された）。だから{" "}
            <code>invalidateQueries</code> で「キャッシュは古いよ、再取得して」と伝える必要がある。
          </Text>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: colors.background.default,
              borderRadius: radii.card.md,
            }}
          >
            <thead>
              <tr style={{ backgroundColor: colors.background.subtle }}>
                <th
                  style={{
                    padding: spacing.scale[4],
                    textAlign: "left",
                    borderBottom: `2px solid ${colors.border.default}`,
                    fontWeight: 600,
                  }}
                >
                  ケース
                </th>
                <th
                  style={{
                    padding: spacing.scale[4],
                    textAlign: "left",
                    borderBottom: `2px solid ${colors.border.default}`,
                    fontWeight: 600,
                  }}
                >
                  invalidateQueries 必要？
                </th>
                <th
                  style={{
                    padding: spacing.scale[4],
                    textAlign: "left",
                    borderBottom: `2px solid ${colors.border.default}`,
                    fontWeight: 600,
                  }}
                >
                  理由
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: spacing.scale[4],
                    borderBottom: `1px solid ${colors.border.default}`,
                    fontWeight: 600,
                  }}
                >
                  依存クエリ（4階層プルダウン）
                </td>
                <td
                  style={{
                    padding: spacing.scale[4],
                    borderBottom: `1px solid ${colors.border.default}`,
                  }}
                >
                  <strong>不要</strong>
                </td>
                <td
                  style={{
                    padding: spacing.scale[4],
                    borderBottom: `1px solid ${colors.border.default}`,
                  }}
                >
                  queryKey が変わるので自動的に新しいクエリになる
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: spacing.scale[4],
                    fontWeight: 600,
                  }}
                >
                  Mutation後のリスト更新
                </td>
                <td style={{ padding: spacing.scale[4] }}>
                  <strong>必要</strong>
                </td>
                <td style={{ padding: spacing.scale[4] }}>
                  queryKey は同じだがサーバー側のデータが変わった
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 結論 */}
      <div style={{ marginTop: spacing.scale[12] }}>
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
      </div>

      {/* 関連リンク */}
      <div style={{ marginTop: spacing.scale[12] }}>
        <Text variant="h2" style={{ marginBottom: spacing.scale[6] }}>
          関連リンク
        </Text>
        <ul style={{ marginLeft: spacing.scale[6] }}>
          <li>
            <a
              href="/examples/react-query-vs-swr-article"
              style={{ color: colors.brand.primary, textDecoration: "underline" }}
            >
              詳細記事: React Query vs SWR 詳細比較
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
      </div>
    </div>
  );
}

export default function ReactQueryVsSWRPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
