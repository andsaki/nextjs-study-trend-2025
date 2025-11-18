import Link from "next/link";
import { ServerComponent } from "./ServerComponent";
import { ClientComponent } from "./ClientComponent";
import { ReloadButton } from "./ReloadButton";
import { colors, spacing, typography, radii } from "../../../src/design-system/tokens";

export default function FlightPayloadDemoPage() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: spacing.scale[8] }}>
      <h1 style={{
        marginBottom: spacing.scale[4],
        fontSize: typography.heading.h1.fontSize,
        fontWeight: typography.heading.h1.fontWeight,
        lineHeight: typography.heading.h1.lineHeight,
      }}>
        Flight Payload デモ
      </h1>

      <div style={{
        padding: spacing.scale[4],
        backgroundColor: colors.feedback.warning.bg,
        borderRadius: radii.borderRadius.lg,
        marginBottom: spacing.scale[8],
        border: `1px solid ${colors.feedback.warning.border}`
      }}>
        <h2 style={{
          fontSize: typography.heading.h5.fontSize,
          fontWeight: typography.heading.h5.fontWeight,
          margin: 0,
          marginBottom: spacing.scale[2],
          color: colors.feedback.warning.text,
        }}>
          🧪 実験方法
        </h2>
        <ol style={{
          marginLeft: spacing.scale[6],
          lineHeight: typography.lineHeight.relaxed
        }}>
          <li>開発者ツール（Network タブ）を開く</li>
          <li>検索欄に「<code>_rsc</code>」と入力してフィルタ</li>
          <li>下の「Examplesページに戻る」リンクをクリック</li>
          <li>再度このページへのリンクをクリック</li>
          <li>ネットワークリクエストを確認
            <ul style={{ marginTop: spacing.scale[2] }}>
              <li><strong>初回アクセス:</strong> HTMLドキュメント全体を取得</li>
              <li><strong>2回目以降:</strong> <code>?_rsc=...</code> のクエリパラメータ付きリクエスト（Flight Payload）のみ取得</li>
            </ul>
          </li>
        </ol>
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: spacing.scale[6],
        marginBottom: spacing.scale[8]
      }}>
        <ServerComponent />
        <ClientComponent />
      </div>

      <div style={{
        padding: spacing.scale[6],
        backgroundColor: colors.background.subtle,
        borderRadius: radii.borderRadius.lg,
        border: `1px solid ${colors.border.subtle}`
      }}>
        <h2 style={{
          fontSize: typography.heading.h5.fontSize,
          fontWeight: typography.heading.h5.fontWeight,
          margin: 0,
          marginBottom: spacing.scale[4]
        }}>
          📝 仕組みの解説
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: spacing.scale[4] }}>
          <div>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.primitive.blue[600],
              marginBottom: spacing.scale[2]
            }}>
              1. 初回アクセス (SSR)
            </h3>
            <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed }}>
              <li>サーバーで全てのServer Componentsをレンダリング</li>
              <li>完全なHTMLドキュメントを生成</li>
              <li>クライアントでハイドレーション（React化）</li>
            </ul>
          </div>

          <div>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.primitive.green[600],
              marginBottom: spacing.scale[2]
            }}>
              2. クライアント側遷移 (Link経由)
            </h3>
            <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed }}>
              <li>HTMLではなく<strong>Flight Payload</strong>をリクエスト</li>
              <li>サーバーでServer Componentsのみ再実行</li>
              <li>結果をシリアライズした軽量なペイロードを返す</li>
              <li>クライアントがReactツリーに適用（UIを更新）</li>
            </ul>
          </div>

          <div>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.primitive.pink[600],
              marginBottom: spacing.scale[2]
            }}>
              3. Flight Payloadの中身
            </h3>
            <pre style={{
              backgroundColor: colors.primitive.gray[900],
              color: colors.primitive.gray[100],
              padding: spacing.scale[4],
              borderRadius: radii.borderRadius.base,
              overflow: "auto",
              fontSize: typography.fontSize.sm,
              fontFamily: typography.fontFamily.mono,
            }}>
{`1:["$","div",null,{"children":"このデータはサーバーで..."}]
2:{"message":"...","fetchedAt":"2025-01-...","randomNumber":742}
3:["$","ClientComponent",null,{...}]`}
            </pre>
            <p style={{
              marginTop: spacing.scale[2],
              fontSize: typography.fontSize.sm,
              color: colors.text.tertiary
            }}>
              ※ Reactコンポーネントツリーを表現した独自形式。HTMLより軽量。
            </p>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: spacing.scale[8],
        padding: spacing.scale[4],
        backgroundColor: colors.feedback.error.bg,
        borderRadius: radii.borderRadius.lg,
        border: `1px solid ${colors.feedback.error.border}`
      }}>
        <h3 style={{
          fontSize: typography.heading.h6.fontSize,
          fontWeight: typography.heading.h6.fontWeight,
          color: colors.feedback.error.text,
          marginBottom: spacing.scale[2]
        }}>
          ⚠️ 重要なポイント
        </h3>
        <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed }}>
          <li>
            <strong>CSRではない:</strong> Server Componentsはサーバーで実行される<br/>
            → データベースアクセスなどが可能
          </li>
          <li>
            <strong>完全なSSRでもない:</strong> HTML全体ではなくデータのみ送信<br/>
            → 高速な画面遷移
          </li>
          <li>
            <strong>ハイブリッド:</strong> サーバーとクライアントの良いとこ取り
          </li>
        </ul>
      </div>

      <div style={{
        marginTop: spacing.scale[8],
        padding: spacing.scale[6],
        backgroundColor: colors.primitive.blue[50],
        borderRadius: radii.borderRadius.lg,
        border: `1px solid ${colors.primitive.blue[300]}`
      }}>
        <h2 style={{
          fontSize: typography.heading.h5.fontSize,
          fontWeight: typography.heading.h5.fontWeight,
          margin: 0,
          marginBottom: spacing.scale[4],
          color: colors.primitive.blue[800]
        }}>
          🔍 DevToolsで確認できる内容
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: spacing.scale[6] }}>
          <div>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.primitive.blue[700],
              marginBottom: spacing.scale[2]
            }}>
              Networkタブ
            </h3>
            <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed }}>
              <li>
                <strong>初回アクセス時:</strong>
                <ul style={{ marginTop: spacing.scale[2] }}>
                  <li>Type: <code>document</code> - 通常のHTMLドキュメント</li>
                  <li>完全なHTMLページを取得</li>
                  <li>サイズ: 比較的大きい（HTML全体）</li>
                </ul>
              </li>
              <li style={{ marginTop: spacing.scale[3] }}>
                <strong>Link経由の遷移時:</strong>
                <ul style={{ marginTop: spacing.scale[2] }}>
                  <li>Type: <code>fetch</code> または <code>xhr</code></li>
                  <li>URL: <code>?_rsc=xxxxx</code> クエリパラメータ付き</li>
                  <li>Content-Type: <code>text/x-component</code></li>
                  <li>サイズ: 小さい（Flight Payloadのみ）</li>
                </ul>
              </li>
            </ul>
          </div>

          <div>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.primitive.blue[700],
              marginBottom: spacing.scale[2]
            }}>
              Responseタブ
            </h3>
            <p style={{ marginBottom: spacing.scale[2] }}>Flight Payloadの実際の内容:</p>
            <pre style={{
              backgroundColor: colors.primitive.gray[900],
              color: colors.primitive.gray[100],
              padding: spacing.scale[4],
              borderRadius: radii.borderRadius.base,
              overflow: "auto",
              fontSize: typography.fontSize.sm,
              fontFamily: typography.fontFamily.mono,
            }}>
{`0:["$L1",["$","meta",...],["$","link",...]]
1:["$","div",null,{"style":{...},"children":[
  ["$","h1",null,{"children":"Flight Payload デモ"}],
  ["$","div",null,{"children":["$","h2",null,{...}]}]
]}]
2:{"message":"サーバーから取得したデータ","fetchedAt":"2025-01-17T...","randomNumber":742}`}
            </pre>
            <ul style={{
              marginTop: spacing.scale[3],
              fontSize: typography.fontSize.sm,
              marginLeft: spacing.scale[6]
            }}>
              <li><code>$</code>: Reactエレメントを表す特殊なマーカー</li>
              <li><code>$L1</code>: 遅延読み込み（Lazy）コンポーネント参照</li>
              <li>数字のID（0, 1, 2...）: コンポーネントツリーの各ノード</li>
              <li>JSON形式でシリアライズされたコンポーネント情報</li>
            </ul>
          </div>

          <div>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.primitive.blue[700],
              marginBottom: spacing.scale[2]
            }}>
              Headersタブ
            </h3>
            <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed }}>
              <li><strong>Request Headers:</strong>
                <ul style={{ marginTop: spacing.scale[2] }}>
                  <li><code>RSC: 1</code> - React Server Componentsリクエストであることを示す</li>
                  <li><code>Next-Router-State-Tree: ...</code> - ルーター状態を含む</li>
                </ul>
              </li>
              <li style={{ marginTop: spacing.scale[3] }}>
                <strong>Response Headers:</strong>
                <ul style={{ marginTop: spacing.scale[2] }}>
                  <li><code>Content-Type: text/x-component</code></li>
                  <li><code>Vary: RSC, Next-Router-State-Tree, Next-Router-Prefetch</code></li>
                </ul>
              </li>
            </ul>
          </div>

          <div>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.primitive.blue[700],
              marginBottom: spacing.scale[2]
            }}>
              Timingの違い
            </h3>
            <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed }}>
              <li><strong>初回SSR:</strong> サーバーレンダリング + HTML転送時間</li>
              <li><strong>Flight Payload:</strong> 軽量なため転送時間が短縮</li>
              <li>サーバーコンポーネントは両方ともサーバー実行（時間はほぼ同じ）</li>
              <li>差が出るのは主に<strong>データ転送量</strong></li>
            </ul>
          </div>

          <div>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.primitive.blue[700],
              marginBottom: spacing.scale[2]
            }}>
              Consoleタブでの確認
            </h3>
            <p style={{ marginBottom: spacing.scale[2] }}>
              ブラウザのコンソールで実際にFlight Payloadをfetchしてみる：
            </p>
            <pre style={{
              backgroundColor: colors.primitive.gray[900],
              color: colors.primitive.gray[100],
              padding: spacing.scale[4],
              borderRadius: radii.borderRadius.base,
              overflow: "auto",
              fontSize: typography.fontSize.sm,
              fontFamily: typography.fontFamily.mono,
            }}>
{`// 現在のページのFlight Payloadを取得
fetch(window.location.href, {
  headers: {
    'RSC': '1',
    'Next-Router-State-Tree': '%5B%22%22%2C%7B%22children%22%3A%5B%22examples%22%2C%7B%22children%22%3A%5B%22flight-payload-demo%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%5D%7D%5D%7D%5D%7D%2Cnull%2Cnull%2Ctrue%5D'
  }
}).then(r => r.text()).then(console.log)`}
            </pre>
            <ul style={{
              marginTop: spacing.scale[3],
              fontSize: typography.fontSize.sm,
              marginLeft: spacing.scale[6],
              lineHeight: typography.lineHeight.relaxed
            }}>
              <li><strong>通常のfetch（RSCヘッダーなし）:</strong> HTMLドキュメント全体を取得</li>
              <li><strong>RSC: 1ヘッダー付き:</strong> Flight Payload形式のレスポンス</li>
              <li>Next.jsのLinkコンポーネントは内部的にこのfetchを実行している</li>
              <li>ページ遷移時にJavaScriptが自動でこのリクエストを送信</li>
            </ul>
          </div>

          <div>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.primitive.blue[700],
              marginBottom: spacing.scale[2]
            }}>
              Prefetchの挙動
            </h3>
            <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed }}>
              <li>
                <strong>Linkコンポーネントがビューポートに入ると：</strong>
                <ul style={{ marginTop: spacing.scale[2] }}>
                  <li>自動的にFlight Payloadをプリフェッチ（開発環境では無効）</li>
                  <li>Networkタブで <code>?_rsc=xxx&_rsc_prefetch=1</code> を確認可能</li>
                  <li>実際のクリック時は即座に画面遷移（キャッシュ済み）</li>
                </ul>
              </li>
              <li style={{ marginTop: spacing.scale[3] }}>
                <strong>プリフェッチを無効化：</strong> <code>&lt;Link prefetch={'{false}'}&gt;</code>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: spacing.scale[8],
        padding: spacing.scale[6],
        backgroundColor: colors.primitive.pink[50],
        borderRadius: radii.borderRadius.lg,
        border: `1px solid ${colors.primitive.pink[300]}`
      }}>
        <h2 style={{
          fontSize: typography.heading.h5.fontSize,
          fontWeight: typography.heading.h5.fontWeight,
          margin: 0,
          marginBottom: spacing.scale[4],
          color: colors.primitive.pink[900]
        }}>
          🧠 より深い理解のために
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: spacing.scale[6] }}>
          <div>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.primitive.pink[700],
              marginBottom: spacing.scale[2]
            }}>
              React Server Components Protocol
            </h3>
            <p style={{ lineHeight: typography.lineHeight.relaxed, marginBottom: spacing.scale[3] }}>
              Flight Payloadは、React Teamが策定した<strong>React Server Components Protocol</strong>に基づいています。
              このプロトコルは、サーバーとクライアント間でReactコンポーネントツリーを効率的に転送するための標準規格です。
            </p>
            <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed }}>
              <li>
                <strong>行ベースのフォーマット:</strong> 各行が独立したチャンク（Reactノード）を表す
              </li>
              <li>
                <strong>ストリーミング対応:</strong> すべてのデータが揃う前から段階的にレンダリング可能
              </li>
              <li>
                <strong>参照の仕組み:</strong> <code>$L1</code>、<code>$1</code> などで他のチャンクを参照できる
              </li>
              <li>
                <strong>シリアライズ可能な値のみ:</strong> 関数やシンボルは転送不可（代わりにクライアントコンポーネントを使用）
              </li>
            </ul>
          </div>

          <div>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.primitive.pink[700],
              marginBottom: spacing.scale[2]
            }}>
              実際のFlight Payloadの詳細解析
            </h3>
            <p style={{ marginBottom: spacing.scale[2] }}>以下は実際のレスポンスの一部です：</p>
            <pre style={{
              backgroundColor: colors.primitive.gray[900],
              color: colors.primitive.gray[100],
              padding: spacing.scale[4],
              borderRadius: radii.borderRadius.base,
              overflow: "auto",
              fontSize: typography.fontSize.sm,
              fontFamily: typography.fontFamily.mono,
              lineHeight: 1.6
            }}>
{`0:["$","meta",null,{"charSet":"utf-8"}]
1:["$","title",null,{"children":"Flight Payload デモ"}]
2:I["(app-pages-browser)/./node_modules/next/dist/client/components/app-router.js",["app-client","static/chunks/app-client-..."],""]
3:I["(app-pages-browser)/./node_modules/next/dist/client/components/client-page.js",["app-client","static/chunks/app-client-..."],"ClientPageRoot"]
4:["$","div",null,{"style":{"maxWidth":"900px","margin":"0 auto","padding":"2rem"},"children":[...]}]
5:{"message":"サーバーから取得","fetchedAt":"2025-01-17T12:34:56.789Z","randomNumber":742}
6:["$","@1","c",{"serverData":"$5","children":"$4"}]`}
            </pre>
            <div style={{ marginTop: spacing.scale[4] }}>
              <h4 style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.primitive.pink[700],
                marginBottom: spacing.scale[2]
              }}>各行の意味:</h4>
              <ul style={{
                marginLeft: spacing.scale[6],
                lineHeight: typography.lineHeight.relaxed,
                fontSize: typography.fontSize.base
              }}>
                <li>
                  <strong>行 0-1:</strong> メタタグやタイトルなどのHTMLヘッダー要素
                  <ul style={{
                    marginTop: spacing.scale[1],
                    fontSize: typography.fontSize.sm,
                    color: colors.text.tertiary
                  }}>
                    <li><code>["$", "meta", null, {'{"charSet":"utf-8"}'}]</code></li>
                    <li>→ <code>&lt;meta charSet="utf-8" /&gt;</code> に対応</li>
                  </ul>
                </li>
                <li style={{ marginTop: spacing.scale[2] }}>
                  <strong>行 2-3:</strong> クライアントコンポーネントのモジュール参照（<code>I</code> = Import）
                  <ul style={{
                    marginTop: spacing.scale[1],
                    fontSize: typography.fontSize.sm,
                    color: colors.text.tertiary
                  }}>
                    <li>ファイルパス、チャンクID、エクスポート名を含む</li>
                    <li>クライアントでこれらのJavaScriptを動的ロード</li>
                  </ul>
                </li>
                <li style={{ marginTop: spacing.scale[2] }}>
                  <strong>行 4:</strong> サーバーコンポーネントの実際のJSX構造
                  <ul style={{
                    marginTop: spacing.scale[1],
                    fontSize: typography.fontSize.sm,
                    color: colors.text.tertiary
                  }}>
                    <li>完全にシリアライズされたReactエレメント</li>
                    <li>スタイルやchildrenも含まれる</li>
                  </ul>
                </li>
                <li style={{ marginTop: spacing.scale[2] }}>
                  <strong>行 5:</strong> サーバーで取得したデータオブジェクト
                  <ul style={{
                    marginTop: spacing.scale[1],
                    fontSize: typography.fontSize.sm,
                    color: colors.text.tertiary
                  }}>
                    <li>純粋なJSONとして送信</li>
                    <li>他の行から <code>$5</code> で参照可能</li>
                  </ul>
                </li>
                <li style={{ marginTop: spacing.scale[2] }}>
                  <strong>行 6:</strong> コンポーネントツリーのルート
                  <ul style={{
                    marginTop: spacing.scale[1],
                    fontSize: typography.fontSize.sm,
                    color: colors.text.tertiary
                  }}>
                    <li><code>@1</code>: クライアントコンポーネント境界を示す</li>
                    <li><code>$5</code>、<code>$4</code>: 他の行への参照</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.primitive.pink[700],
              marginBottom: spacing.scale[2]
            }}>
              特殊なマーカーの完全リスト
            </h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: `${spacing.scale[2]} ${spacing.scale[4]}`,
              fontSize: typography.fontSize.sm,
              backgroundColor: colors.background.subtle,
              padding: spacing.scale[4],
              borderRadius: radii.borderRadius.base
            }}>
              <code style={{ fontWeight: typography.fontWeight.bold, color: colors.feedback.error.icon }}>$</code>
              <span>Reactエレメント（<code>React.createElement</code>に対応）</span>

              <code style={{ fontWeight: typography.fontWeight.bold, color: colors.feedback.error.icon }}>$L</code>
              <span>遅延ロード（Lazy）参照 - Suspense境界で使用</span>

              <code style={{ fontWeight: typography.fontWeight.bold, color: colors.feedback.error.icon }}>@</code>
              <span>クライアントコンポーネント参照</span>

              <code style={{ fontWeight: typography.fontWeight.bold, color: colors.feedback.error.icon }}>I</code>
              <span>モジュールインポート情報（チャンク、パス）</span>

              <code style={{ fontWeight: typography.fontWeight.bold, color: colors.feedback.error.icon }}>M</code>
              <span>モジュールメタデータ</span>

              <code style={{ fontWeight: typography.fontWeight.bold, color: colors.feedback.error.icon }}>S</code>
              <span>Suspenseバウンダリ</span>

              <code style={{ fontWeight: typography.fontWeight.bold, color: colors.feedback.error.icon }}>E</code>
              <span>エラーバウンダリ</span>
            </div>
          </div>

          <div>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.primitive.pink[700],
              marginBottom: spacing.scale[2]
            }}>
              ストリーミングとSuspenseの関係
            </h3>
            <p style={{ lineHeight: typography.lineHeight.relaxed, marginBottom: spacing.scale[3] }}>
              Flight PayloadはHTTP chunked encodingでストリーミング送信されます。
              これによりデータが準備できた順に段階的にクライアントへ送信できます。
            </p>
            <pre style={{
              backgroundColor: colors.primitive.gray[900],
              color: colors.primitive.gray[100],
              padding: spacing.scale[4],
              borderRadius: radii.borderRadius.base,
              overflow: "auto",
              fontSize: typography.fontSize.sm,
              fontFamily: typography.fontFamily.mono,
            }}>
{`// 最初のチャンク（即座に送信）
0:["$","div",null,{"children":["$","h1",null,{"children":"タイトル"}]}]
1:["$L2"] // Suspense境界 - データ待ち

// 2秒後のチャンク（データ取得完了後）
2:["$","div",null,{"children":"遅延データ: ..."}]`}
            </pre>
            <ul style={{
              marginTop: spacing.scale[3],
              marginLeft: spacing.scale[6],
              lineHeight: typography.lineHeight.relaxed
            }}>
              <li>Suspenseでラップされたコンポーネントは <code>$L</code> 参照として送信</li>
              <li>データ準備完了後、その参照IDの実体が追加送信される</li>
              <li>クライアントは受信した順にUIを段階的に更新</li>
              <li>ページ全体の待ち時間を短縮できる</li>
            </ul>
          </div>

          <div>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.primitive.pink[700],
              marginBottom: spacing.scale[2]
            }}>
              Next.js Router Cacheとの連携
            </h3>
            <p style={{ lineHeight: typography.lineHeight.relaxed, marginBottom: spacing.scale[3] }}>
              取得したFlight Payloadは、Next.jsのRouter Cacheに保存されます。
            </p>
            <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed }}>
              <li>
                <strong>開発環境:</strong> キャッシュなし（毎回新しいデータを取得）
              </li>
              <li>
                <strong>本番環境:</strong>
                <ul style={{ marginTop: spacing.scale[2] }}>
                  <li>デフォルトで30秒間キャッシュ</li>
                  <li>ブラウザの戻る/進むボタンではキャッシュを使用</li>
                  <li><code>router.refresh()</code> で強制的にキャッシュをクリア可能</li>
                </ul>
              </li>
              <li style={{ marginTop: spacing.scale[2] }}>
                <strong>キャッシュ時間の調整:</strong>
                <pre style={{
                  backgroundColor: colors.primitive.gray[900],
                  color: colors.primitive.gray[100],
                  padding: spacing.scale[2],
                  borderRadius: radii.borderRadius.base,
                  marginTop: spacing.scale[2],
                  fontSize: typography.fontSize.sm,
                  fontFamily: typography.fontFamily.mono,
                }}>
{`export const revalidate = 60; // 60秒ごとに再検証`}
                </pre>
              </li>
            </ul>
          </div>

          <div>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.primitive.pink[700],
              marginBottom: spacing.scale[2]
            }}>
              レンダリング戦略の包括的な比較表
            </h3>
            <p style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
              marginBottom: spacing.scale[3],
              lineHeight: typography.lineHeight.relaxed
            }}>
              Webアプリケーションの主要なレンダリング戦略を網羅的に比較。
              それぞれの特性を理解して、プロジェクトに最適な手法を選択しましょう。
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: typography.fontSize.xs,
                backgroundColor: colors.background.default,
                border: `1px solid ${colors.border.subtle}`
              }}>
                <thead>
                  <tr style={{ backgroundColor: colors.primitive.gray[800], color: colors.text.inverse }}>
                    <th style={{
                      padding: spacing.scale[2],
                      textAlign: "left",
                      borderBottom: `2px solid ${colors.border.default}`,
                      fontWeight: typography.fontWeight.bold,
                      minWidth: "100px"
                    }}>項目</th>
                    <th style={{
                      padding: spacing.scale[2],
                      textAlign: "left",
                      borderBottom: `2px solid ${colors.border.default}`,
                      fontWeight: typography.fontWeight.bold,
                      minWidth: "110px"
                    }}>MPA<br/><span style={{ fontSize: "0.85em", fontWeight: typography.fontWeight.normal }}>（従来型）</span></th>
                    <th style={{
                      padding: spacing.scale[2],
                      textAlign: "left",
                      borderBottom: `2px solid ${colors.border.default}`,
                      fontWeight: typography.fontWeight.bold,
                      minWidth: "110px"
                    }}>SPA/CSR<br/><span style={{ fontSize: "0.85em", fontWeight: typography.fontWeight.normal }}>（React等）</span></th>
                    <th style={{
                      padding: spacing.scale[2],
                      textAlign: "left",
                      borderBottom: `2px solid ${colors.border.default}`,
                      fontWeight: typography.fontWeight.bold,
                      minWidth: "110px"
                    }}>SSR<br/><span style={{ fontSize: "0.85em", fontWeight: typography.fontWeight.normal }}>（Pages Router）</span></th>
                    <th style={{
                      padding: spacing.scale[2],
                      textAlign: "left",
                      borderBottom: `2px solid ${colors.border.default}`,
                      fontWeight: typography.fontWeight.bold,
                      minWidth: "110px"
                    }}>ISR<br/><span style={{ fontSize: "0.85em", fontWeight: typography.fontWeight.normal }}>（Next.js）</span></th>
                    <th style={{
                      padding: spacing.scale[2],
                      textAlign: "left",
                      borderBottom: `2px solid ${colors.border.default}`,
                      fontWeight: typography.fontWeight.bold,
                      minWidth: "110px",
                      backgroundColor: colors.primitive.blue[700]
                    }}>RSC<br/><span style={{ fontSize: "0.85em", fontWeight: typography.fontWeight.normal }}>（App Router）</span></th>
                  </tr>
                </thead>
                <tbody>
                  {/* アーキテクチャ */}
                  <tr>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontWeight: typography.fontWeight.bold,
                      backgroundColor: colors.primitive.gray[100]
                    }}>アーキテクチャ</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>マルチページ</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>シングルページ</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>ハイブリッド</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>ハイブリッド</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      backgroundColor: colors.primitive.blue[50]
                    }}>ハイブリッド</td>
                  </tr>

                  {/* 初回レンダリング */}
                  <tr style={{ backgroundColor: colors.background.subtle }}>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontWeight: typography.fontWeight.bold,
                      backgroundColor: colors.primitive.gray[100]
                    }}>初回レンダリング</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>サーバー</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>クライアント</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>サーバー</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>サーバー（キャッシュ）</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      backgroundColor: colors.primitive.blue[50]
                    }}>サーバー</td>
                  </tr>

                  {/* 画面遷移 */}
                  <tr>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontWeight: typography.fontWeight.bold,
                      backgroundColor: colors.primitive.gray[100]
                    }}>画面遷移</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>フルリロード</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>クライアント側のみ</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>HTML全体を取得</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>HTML全体を取得</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      backgroundColor: colors.primitive.blue[50]
                    }}>Flight Payload（軽量）</td>
                  </tr>

                  {/* データフェッチ */}
                  <tr style={{ backgroundColor: colors.background.subtle }}>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontWeight: typography.fontWeight.bold,
                      backgroundColor: colors.primitive.gray[100]
                    }}>データフェッチ</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>サーバー直接</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>APIリクエスト</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>サーバー直接</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>サーバー直接（キャッシュ）</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      backgroundColor: colors.primitive.blue[50]
                    }}>サーバー直接</td>
                  </tr>

                  {/* JSバンドルサイズ */}
                  <tr>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontWeight: typography.fontWeight.bold,
                      backgroundColor: colors.primitive.gray[100]
                    }}>JSバンドル</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>なし〜小</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>大きい</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>大きい</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>大きい</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      backgroundColor: colors.primitive.blue[50]
                    }}>小〜中（SC除外）</td>
                  </tr>

                  {/* SEO */}
                  <tr style={{ backgroundColor: colors.background.subtle }}>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontWeight: typography.fontWeight.bold,
                      backgroundColor: colors.primitive.gray[100]
                    }}>SEO</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>◎ 最良</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>△ JS必須</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>◎ 良好</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>◎ 良好</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      backgroundColor: colors.primitive.blue[50]
                    }}>◎ 良好</td>
                  </tr>

                  {/* インタラクティブ */}
                  <tr>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontWeight: typography.fontWeight.bold,
                      backgroundColor: colors.primitive.gray[100]
                    }}>インタラクティブ性</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>△ 限定的</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>◎ 高い</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>◎ 高い（ハイドレーション後）</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>◎ 高い（ハイドレーション後）</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      backgroundColor: colors.primitive.blue[50]
                    }}>◎ 高い（ハイブリッド）</td>
                  </tr>

                  {/* 初期表示速度 */}
                  <tr style={{ backgroundColor: colors.background.subtle }}>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontWeight: typography.fontWeight.bold,
                      backgroundColor: colors.primitive.gray[100]
                    }}>初期表示速度</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>速い</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>遅い</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>速い</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>最速（キャッシュ時）</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      backgroundColor: colors.primitive.blue[50]
                    }}>速い</td>
                  </tr>

                  {/* ハイドレーション */}
                  <tr>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontWeight: typography.fontWeight.bold,
                      backgroundColor: colors.primitive.gray[100]
                    }}>ハイドレーション</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>なし</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>初回レンダリング時</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>全ページで必要</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>全ページで必要</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      backgroundColor: colors.primitive.blue[50]
                    }}>CCのみ（部分的）</td>
                  </tr>

                  {/* キャッシュ戦略 */}
                  <tr style={{ backgroundColor: colors.background.subtle }}>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontWeight: typography.fontWeight.bold,
                      backgroundColor: colors.primitive.gray[100]
                    }}>キャッシュ戦略</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>HTTPキャッシュのみ</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>アプリ内状態管理</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>HTTPキャッシュ</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>サーバーキャッシュ（revalidate）</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      backgroundColor: colors.primitive.blue[50]
                    }}>Router Cache + Data Cache</td>
                  </tr>

                  {/* 開発体験 */}
                  <tr>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontWeight: typography.fontWeight.bold,
                      backgroundColor: colors.primitive.gray[100]
                    }}>開発体験</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>シンプル</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>良好</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>良好</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>良好</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      backgroundColor: colors.primitive.blue[50]
                    }}>学習コスト高</td>
                  </tr>

                  {/* 適用例 */}
                  <tr style={{ backgroundColor: colors.background.subtle }}>
                    <td style={{
                      padding: spacing.scale[2],
                      fontWeight: typography.fontWeight.bold,
                      backgroundColor: colors.primitive.gray[100]
                    }}>適用例</td>
                    <td style={{
                      padding: spacing.scale[2],
                      fontSize: "0.9em",
                      lineHeight: 1.4
                    }}>ブログ、コーポレートサイト</td>
                    <td style={{
                      padding: spacing.scale[2],
                      fontSize: "0.9em",
                      lineHeight: 1.4
                    }}>管理画面、ダッシュボード</td>
                    <td style={{
                      padding: spacing.scale[2],
                      fontSize: "0.9em",
                      lineHeight: 1.4
                    }}>EC、ニュースサイト</td>
                    <td style={{
                      padding: spacing.scale[2],
                      fontSize: "0.9em",
                      lineHeight: 1.4
                    }}>ドキュメント、ブログ</td>
                    <td style={{
                      padding: spacing.scale[2],
                      fontSize: "0.9em",
                      lineHeight: 1.4,
                      backgroundColor: colors.primitive.blue[50]
                    }}>あらゆるWebアプリ</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{
              marginTop: spacing.scale[4],
              padding: spacing.scale[4],
              backgroundColor: colors.primitive.blue[50],
              borderRadius: radii.borderRadius.md,
              border: `1px solid ${colors.primitive.blue[200]}`
            }}>
              <h4 style={{
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.bold,
                marginBottom: spacing.scale[2],
                color: colors.primitive.blue[900]
              }}>📖 用語解説</h4>
              <ul style={{
                marginLeft: spacing.scale[6],
                fontSize: typography.fontSize.xs,
                lineHeight: typography.lineHeight.relaxed
              }}>
                <li><strong>MPA (Multi-Page Application):</strong> 従来型のWebサイト。ページ遷移のたびにサーバーから完全なHTMLを取得</li>
                <li><strong>SPA/CSR (Single Page Application / Client-Side Rendering):</strong> クライアント側でJavaScriptがページを動的に生成</li>
                <li><strong>SSR (Server-Side Rendering):</strong> Next.jsのPages Routerなど。リクエストごとにサーバーでHTMLを生成</li>
                <li><strong>ISR (Incremental Static Regeneration):</strong> 静的生成とSSRのハイブリッド。一定時間ごとに再生成</li>
                <li><strong>RSC (React Server Components):</strong> Next.js App Router。サーバーとクライアントのコンポーネントを明確に分離</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.primitive.pink[700],
              marginBottom: spacing.scale[2]
            }}>
              実装上の注意点とベストプラクティス
            </h3>
            <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed }}>
              <li>
                <strong>Server Componentsはデフォルト:</strong>
                <ul style={{ marginTop: spacing.scale[2] }}>
                  <li>App Routerでは全てのコンポーネントがServer Componentとして扱われる</li>
                  <li><code>'use client'</code> ディレクティブが必要なのはクライアント機能を使う時のみ</li>
                </ul>
              </li>
              <li style={{ marginTop: spacing.scale[3] }}>
                <strong>クライアントコンポーネントの境界を最小化:</strong>
                <ul style={{ marginTop: spacing.scale[2] }}>
                  <li>インタラクティブな部分だけをクライアントコンポーネントに</li>
                  <li>親をServer Component、子をClient Componentにすることで最適化</li>
                </ul>
              </li>
              <li style={{ marginTop: spacing.scale[3] }}>
                <strong>Props経由でのデータ受け渡し:</strong>
                <ul style={{ marginTop: spacing.scale[2] }}>
                  <li>Server Component → Client Component へはシリアライズ可能なデータのみ</li>
                  <li>関数、クラスインスタンス、Symbolなどは渡せない</li>
                </ul>
              </li>
              <li style={{ marginTop: spacing.scale[3] }}>
                <strong>データフェッチングの配置:</strong>
                <ul style={{ marginTop: spacing.scale[2] }}>
                  <li>Server Componentで直接DBアクセスやAPIコール</li>
                  <li>結果をClient Componentにpropsとして渡す</li>
                  <li>ウォーターフォールを避けるため、並列fetchを活用</li>
                </ul>
              </li>
            </ul>
          </div>

          <div>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.primitive.pink[700],
              marginBottom: spacing.scale[2]
            }}>
              デバッグのコツ
            </h3>
            <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed }}>
              <li>
                <strong>React DevToolsの「Components」タブ:</strong>
                <ul style={{ marginTop: spacing.scale[2] }}>
                  <li>Server Componentには <code>(Server Component)</code> ラベルが表示される</li>
                  <li>Client Componentとの境界を視覚的に確認可能</li>
                </ul>
              </li>
              <li style={{ marginTop: spacing.scale[3] }}>
                <strong>Network タブでのフィルタリング:</strong>
                <ul style={{ marginTop: spacing.scale[2] }}>
                  <li><code>_rsc</code> で検索してFlight Payloadのみ表示</li>
                  <li>Initiatorカラムで呼び出し元を確認</li>
                </ul>
              </li>
              <li style={{ marginTop: spacing.scale[3] }}>
                <strong>ターミナルのログ:</strong>
                <ul style={{ marginTop: spacing.scale[2] }}>
                  <li>Server Componentの <code>console.log</code> はサーバー側（ターミナル）に出力</li>
                  <li>Client Componentの <code>console.log</code> はブラウザコンソールに出力</li>
                  <li>どちらで実行されているか判別しやすい</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: spacing.scale[8],
        display: "flex",
        gap: spacing.scale[4]
      }}>
        <Link
          href="/examples"
          style={{
            padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
            backgroundColor: colors.brand.primary,
            color: colors.text.inverse,
            textDecoration: "none",
            borderRadius: radii.borderRadius.md,
            fontWeight: typography.fontWeight.medium
          }}
        >
          ← Examplesページに戻る
        </Link>
        <ReloadButton />
      </div>
    </div>
  );
}
