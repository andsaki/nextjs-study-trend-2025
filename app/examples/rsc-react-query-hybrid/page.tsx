import { colors, spacing, typography, radii } from "@/src/design-system/tokens";

export default function RscReactQueryHybridPage() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: spacing.scale[8] }}>
      <h1 style={{
        marginBottom: spacing.scale[4],
        fontSize: typography.heading.h1.fontSize,
        fontWeight: typography.heading.h1.fontWeight,
        lineHeight: typography.heading.h1.lineHeight,
      }}>
        RSC + React Query ハイブリッド
      </h1>

      <p style={{
        fontSize: typography.body.large.fontSize,
        lineHeight: typography.lineHeight.relaxed,
        color: colors.text.secondary,
        marginBottom: spacing.scale[8]
      }}>
        Server ComponentとReact Queryを組み合わせた、SEOとUXを両立する最強パターンの実装例です。
      </p>

      {/* なぜハイブリッドか */}
      <section style={{ marginBottom: spacing.scale[8] }}>
        <h2 style={{
          fontSize: typography.heading.h2.fontSize,
          fontWeight: typography.heading.h2.fontWeight,
          marginBottom: spacing.scale[4],
          color: colors.brand.primary,
        }}>
          なぜハイブリッドが最強なのか？
        </h2>

        <div style={{
          display: "grid",
          gap: spacing.scale[4],
          marginBottom: spacing.scale[6]
        }}>
          <div style={{
            padding: spacing.scale[4],
            backgroundColor: colors.feedback.success.bg,
            borderRadius: radii.borderRadius.md,
            border: `1px solid ${colors.feedback.success.border}`,
          }}>
            <h3 style={{
              fontSize: typography.heading.h5.fontSize,
              fontWeight: typography.heading.h5.fontWeight,
              marginBottom: spacing.scale[2],
              color: colors.feedback.success.text
            }}>
              ✅ Server Component の強み
            </h3>
            <ul style={{
              marginLeft: spacing.scale[6],
              lineHeight: typography.lineHeight.relaxed,
              color: colors.feedback.success.text
            }}>
              <li>初期表示が高速（サーバーでデータ取得済み）</li>
              <li>SEO対応（検索エンジンがデータを読める）</li>
              <li>JavaScriptバンドルサイズが小さい</li>
              <li>DBに直接アクセス可能（API Routesが不要）</li>
            </ul>
          </div>

          <div style={{
            padding: spacing.scale[4],
            backgroundColor: colors.feedback.info.bg,
            borderRadius: radii.borderRadius.md,
            border: `1px solid ${colors.feedback.info.border}`,
          }}>
            <h3 style={{
              fontSize: typography.heading.h5.fontSize,
              fontWeight: typography.heading.h5.fontWeight,
              marginBottom: spacing.scale[2],
              color: colors.feedback.info.text
            }}>
              ✅ React Query の強み
            </h3>
            <ul style={{
              marginLeft: spacing.scale[6],
              lineHeight: typography.lineHeight.relaxed,
              color: colors.feedback.info.text
            }}>
              <li>リアルタイムな更新（refetch、polling）</li>
              <li>キャッシュ管理（戻るボタンで即座に表示）</li>
              <li>楽観的更新（UIが即座に反応）</li>
              <li>ローディング・エラー状態の細かい制御</li>
            </ul>
          </div>
        </div>

        <div style={{
          padding: spacing.scale[5],
          backgroundColor: colors.primitive.blue[50],
          borderRadius: radii.borderRadius.md,
          border: `1px solid ${colors.primitive.blue[200]}`,
        }}>
          <p style={{
            fontSize: typography.body.base.fontSize,
            lineHeight: typography.lineHeight.relaxed,
            margin: 0,
            color: colors.primitive.blue[900]
          }}>
            <strong>💡 結論:</strong> Server Componentで初期データを配信し、React Queryで動的更新を担当する。
            両者の強みを組み合わせることで、高速な初期表示と快適なインタラクションを実現できます。
          </p>
        </div>
      </section>

      {/* 実装パターン */}
      <section style={{ marginBottom: spacing.scale[8] }}>
        <h2 style={{
          fontSize: typography.heading.h2.fontSize,
          fontWeight: typography.heading.h2.fontWeight,
          marginBottom: spacing.scale[4],
          color: colors.brand.primary,
        }}>
          実装パターン
        </h2>

        <div style={{ marginBottom: spacing.scale[6] }}>
          <h3 style={{
            fontSize: typography.heading.h4.fontSize,
            fontWeight: typography.heading.h4.fontWeight,
            marginBottom: spacing.scale[3],
            color: colors.primitive.blue[700]
          }}>
            1. Server Component（page.tsx）
          </h3>
          <p style={{
            marginBottom: spacing.scale[3],
            lineHeight: typography.lineHeight.relaxed,
          }}>
            サーバー側で初期データを取得し、Client Componentに渡します。
          </p>
          <div style={{
            padding: spacing.scale[4],
            backgroundColor: colors.background.subtle,
            borderRadius: radii.borderRadius.md,
            border: `1px solid ${colors.border.subtle}`,
            overflow: "auto"
          }}>
            <pre style={{
              margin: 0,
              fontSize: typography.body.small.fontSize,
              lineHeight: typography.lineHeight.relaxed,
              fontFamily: typography.fontFamily.mono
            }}>
{`// app/products/page.tsx (Server Component)
import { prisma } from "@/lib/db"
import { ProductList } from "./ProductList"

export default async function ProductsPage({
  searchParams
}: {
  searchParams: { category?: string }
}) {
  // サーバー側で初期データ取得（DBに直接アクセス）
  const initialProducts = await prisma.product.findMany({
    where: searchParams.category
      ? { category: searchParams.category }
      : undefined,
    take: 20
  })

  return (
    <div>
      <h1>商品一覧</h1>
      {/* Client Componentに初期データを渡す */}
      <ProductList
        initialData={initialProducts}
        category={searchParams.category}
      />
    </div>
  )
}`}
            </pre>
          </div>
        </div>

        <div style={{ marginBottom: spacing.scale[6] }}>
          <h3 style={{
            fontSize: typography.heading.h4.fontSize,
            fontWeight: typography.heading.h4.fontWeight,
            marginBottom: spacing.scale[3],
            color: colors.primitive.green[700]
          }}>
            2. Client Component（ProductList.tsx）
          </h3>
          <p style={{
            marginBottom: spacing.scale[3],
            lineHeight: typography.lineHeight.relaxed,
          }}>
            React Queryでデータを管理。初期データを使いつつ、動的な更新も可能にします。
          </p>
          <div style={{
            padding: spacing.scale[4],
            backgroundColor: colors.background.subtle,
            borderRadius: radii.borderRadius.md,
            border: `1px solid ${colors.border.subtle}`,
            overflow: "auto"
          }}>
            <pre style={{
              margin: 0,
              fontSize: typography.body.small.fontSize,
              lineHeight: typography.lineHeight.relaxed,
              fontFamily: typography.fontFamily.mono
            }}>
{`// app/products/ProductList.tsx (Client Component)
"use client"
import { useQuery } from "@tanstack/react-query"
import type { Product } from "@/lib/types"

export function ProductList({
  initialData,
  category
}: {
  initialData: Product[]
  category?: string
}) {
  // React Queryで管理（initialDataを渡す）
  const { data: products, refetch } = useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      const res = await fetch(
        \`/api/products?category=\${category || ""}\`
      )
      return res.json()
    },
    initialData, // ← Server Componentから受け取った初期データ
    staleTime: 1000 * 60 * 5, // 5分間はキャッシュを使う
  })

  return (
    <div>
      <button onClick={() => refetch()}>
        最新データに更新
      </button>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  )
}`}
            </pre>
          </div>
        </div>

        <div style={{
          padding: spacing.scale[4],
          backgroundColor: colors.feedback.warning.bg,
          borderRadius: radii.borderRadius.md,
          border: `1px solid ${colors.feedback.warning.border}`,
        }}>
          <h4 style={{
            fontSize: typography.body.base.fontSize,
            fontWeight: 600,
            marginBottom: spacing.scale[2],
            color: colors.feedback.warning.text
          }}>
            ⚠️ 重要なポイント
          </h4>
          <ul style={{
            marginLeft: spacing.scale[6],
            lineHeight: typography.lineHeight.relaxed,
            color: colors.feedback.warning.text,
            margin: 0
          }}>
            <li><code>initialData</code>を渡すことで、初回レンダリング時にローディング状態を回避</li>
            <li><code>staleTime</code>を設定して、無駄なリフェッチを防ぐ</li>
            <li>Server Componentは直接DBアクセス、Client ComponentはAPI経由</li>
          </ul>
        </div>
      </section>

      {/* データフローの図解 */}
      <section style={{ marginBottom: spacing.scale[8] }}>
        <h2 style={{
          fontSize: typography.heading.h2.fontSize,
          fontWeight: typography.heading.h2.fontWeight,
          marginBottom: spacing.scale[4],
          color: colors.brand.primary,
        }}>
          データフロー
        </h2>

        <div style={{
          padding: spacing.scale[5],
          backgroundColor: colors.background.subtle,
          borderRadius: radii.borderRadius.md,
          border: `1px solid ${colors.border.subtle}`,
        }}>
          <h3 style={{
            fontSize: typography.heading.h5.fontSize,
            fontWeight: typography.heading.h5.fontWeight,
            marginBottom: spacing.scale[3],
          }}>
            初回アクセス時
          </h3>
          <ol style={{
            marginLeft: spacing.scale[6],
            lineHeight: typography.lineHeight.relaxed,
            marginBottom: spacing.scale[4]
          }}>
            <li>ユーザーがページにアクセス</li>
            <li>Server Componentがサーバー側でDB直接アクセス</li>
            <li>初期データを含むHTMLを生成</li>
            <li>クライアントでハイドレーション（React化）</li>
            <li>React Queryが初期データを受け取る（ローディングなし）</li>
          </ol>

          <h3 style={{
            fontSize: typography.heading.h5.fontSize,
            fontWeight: typography.heading.h5.fontWeight,
            marginBottom: spacing.scale[3],
          }}>
            ユーザー操作時（フィルタ変更など）
          </h3>
          <ol style={{
            marginLeft: spacing.scale[6],
            lineHeight: typography.lineHeight.relaxed,
          }}>
            <li>ユーザーがフィルタを変更</li>
            <li>React QueryがAPI経由でデータ取得</li>
            <li>キャッシュに保存（次回即座に表示）</li>
            <li>UIが更新される</li>
          </ol>
        </div>
      </section>

      {/* 使い分けガイド */}
      <section style={{ marginBottom: spacing.scale[8] }}>
        <h2 style={{
          fontSize: typography.heading.h2.fontSize,
          fontWeight: typography.heading.h2.fontWeight,
          marginBottom: spacing.scale[4],
          color: colors.brand.primary,
        }}>
          使い分けガイド
        </h2>

        <div style={{
          padding: spacing.scale[4],
          backgroundColor: "rgba(0, 0, 0, 0.05)",
          borderRadius: radii.borderRadius.md,
          marginBottom: spacing.scale[4]
        }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: typography.body.small.fontSize,
          }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${colors.border.default}` }}>
                <th style={{ padding: spacing.scale[2], textAlign: "left" }}>用途</th>
                <th style={{ padding: spacing.scale[2], textAlign: "left" }}>推奨パターン</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${colors.border.subtle}` }}>
                <td style={{ padding: spacing.scale[2] }}>ECサイトの商品一覧</td>
                <td style={{ padding: spacing.scale[2] }}><strong>ハイブリッド</strong>（SEO + 動的フィルタ）</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border.subtle}` }}>
                <td style={{ padding: spacing.scale[2] }}>ブログ記事一覧</td>
                <td style={{ padding: spacing.scale[2] }}><strong>ハイブリッド</strong>（SEO + ページネーション）</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border.subtle}` }}>
                <td style={{ padding: spacing.scale[2] }}>管理画面・ダッシュボード</td>
                <td style={{ padding: spacing.scale[2] }}><strong>React Queryのみ</strong>（SEO不要）</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${colors.border.subtle}` }}>
                <td style={{ padding: spacing.scale[2] }}>マーケティングLP</td>
                <td style={{ padding: spacing.scale[2] }}><strong>Server Componentのみ</strong>（静的コンテンツ）</td>
              </tr>
              <tr>
                <td style={{ padding: spacing.scale[2] }}>リアルタイムチャット</td>
                <td style={{ padding: spacing.scale[2] }}><strong>React Queryのみ</strong>（動的更新メイン）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* まとめ */}
      <section>
        <h2 style={{
          fontSize: typography.heading.h2.fontSize,
          fontWeight: typography.heading.h2.fontWeight,
          marginBottom: spacing.scale[4],
          color: colors.brand.primary,
        }}>
          まとめ
        </h2>

        <div style={{
          padding: spacing.scale[6],
          backgroundColor: colors.feedback.success.bg,
          borderRadius: radii.borderRadius.md,
          border: `1px solid ${colors.feedback.success.border}`,
        }}>
          <ul style={{
            marginLeft: spacing.scale[6],
            lineHeight: typography.lineHeight.relaxed,
            color: colors.feedback.success.text,
            margin: 0
          }}>
            <li><strong>初期表示:</strong> Server Componentで高速配信（SEO対応）</li>
            <li><strong>動的更新:</strong> React Queryでキャッシュ＋リフェッチ</li>
            <li><strong>initialData:</strong> Server Componentのデータを引き継ぐことで、ローディング画面を回避</li>
            <li><strong>適用場面:</strong> ECサイト、ブログ、検索機能など、SEOと動的更新の両方が必要な画面</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
