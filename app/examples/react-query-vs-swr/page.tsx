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

// URL文字列を構築 ← 面倒
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
                {`// URL個別指定が必要
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

// 手動で条件分岐が必要
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

// URL構築とnullチェックが冗長`}
              </pre>
            </>
          )}
        </div>
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
