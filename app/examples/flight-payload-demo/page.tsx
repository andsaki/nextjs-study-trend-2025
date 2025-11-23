import Link from "next/link";
import { ServerComponent } from "./ServerComponent";
import { ClientComponent } from "./ClientComponent";
import { ReloadButton } from "./ReloadButton";
import { ClickableDiagram } from "./ClickableDiagram";
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
        backgroundColor: colors.feedback.info.bg,
        borderRadius: radii.borderRadius.lg,
        border: `1px solid ${colors.feedback.info.border}`
      }}>
        <h2 style={{
          fontSize: typography.heading.h5.fontSize,
          fontWeight: typography.heading.h5.fontWeight,
          margin: 0,
          marginBottom: spacing.scale[4],
          color: colors.feedback.info.text
        }}>
          💧 ハイドレーションとエラーの正体
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: spacing.scale[5] }}>
          <div>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.feedback.info.text,
              marginBottom: spacing.scale[2]
            }}>
              ハイドレーションとは？
            </h3>
            <ol style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed }}>
              <li>サーバーで生成されたHTMLをブラウザが受け取る</li>
              <li>対応するReactのJSバンドルを読み込む</li>
              <li>既存DOMにイベントや状態を紐付けてReactを再開</li>
            </ol>
            <p style={{ marginLeft: spacing.scale[6], color: colors.text.secondary, marginTop: spacing.scale[2] }}>
              目的は「空文字から描画し直す」のではなく、サーバーHTMLを活かしながらReactのライフサイクルを復元すること。
            </p>
          </div>

          <div>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.feedback.info.text,
              marginBottom: spacing.scale[2]
            }}>
              ハイドレーションエラーが起きるケース
            </h3>
            <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed }}>
              <li><strong>日時や乱数:</strong> サーバーとクライアントで値がズレる</li>
              <li><strong>ブラウザ依存の条件分岐:</strong> <code>window</code> やメディアクエリでUIが変わる</li>
              <li><strong>非決定的な整形:</strong> ソート順やロケールが一致しない</li>
            </ul>
            <p style={{ marginLeft: spacing.scale[6], color: colors.text.secondary, marginTop: spacing.scale[2] }}>
              DOM構造やテキスト内容が一致しないとReactは「紐付けられない」と判断し、警告後にDOMを作り直すためUXが低下する。
            </p>
          </div>

          <div>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.feedback.info.text,
              marginBottom: spacing.scale[2]
            }}>
              防ぐためのチェックリスト
            </h3>
            <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed }}>
              <li>初期レンダリングで使う値は決定的にする（例: Date→ISO文字列を固定）</li>
              <li>ブラウザ専用情報は <code>use client</code> なコンポーネントや <code>useEffect</code> に隔離</li>
              <li>「差分を許容したい」場合は <code>suppressHydrationWarning</code> で明示</li>
              <li>初期描画に不要なUIは条件付きレンダリングや遅延ロードで外す</li>
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
              📊 レンダリング戦略の比較
            </h3>
            <p style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
              marginBottom: spacing.scale[3],
              lineHeight: typography.lineHeight.relaxed
            }}>
              主要なレンダリング戦略の特性を比較。どのアプローチを選ぶかで、パフォーマンスや開発体験が大きく変わります。
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
                    }}>戦略</th>
                    <th style={{
                      padding: spacing.scale[2],
                      textAlign: "left",
                      borderBottom: `2px solid ${colors.border.default}`,
                      fontWeight: typography.fontWeight.bold,
                      minWidth: "140px"
                    }}>どこで動く？</th>
                    <th style={{
                      padding: spacing.scale[2],
                      textAlign: "left",
                      borderBottom: `2px solid ${colors.border.default}`,
                      fontWeight: typography.fontWeight.bold,
                      minWidth: "110px"
                    }}>画面遷移</th>
                    <th style={{
                      padding: spacing.scale[2],
                      textAlign: "left",
                      borderBottom: `2px solid ${colors.border.default}`,
                      fontWeight: typography.fontWeight.bold,
                      minWidth: "90px"
                    }}>JSバンドル</th>
                    <th style={{
                      padding: spacing.scale[2],
                      textAlign: "left",
                      borderBottom: `2px solid ${colors.border.default}`,
                      fontWeight: typography.fontWeight.bold,
                      minWidth: "70px"
                    }}>SEO</th>
                    <th style={{
                      padding: spacing.scale[2],
                      textAlign: "left",
                      borderBottom: `2px solid ${colors.border.default}`,
                      fontWeight: typography.fontWeight.bold,
                      minWidth: "120px"
                    }}>適用例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ backgroundColor: colors.background.subtle }}>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontWeight: typography.fontWeight.bold
                    }}>MPA<br/><span style={{ fontSize: "0.85em", fontWeight: typography.fontWeight.normal }}>(従来型)</span></td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>Server（静的配信）</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>フルリロード</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>なし〜小</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>◎</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontSize: "0.9em"
                    }}>コーポレートサイト</td>
                  </tr>

                  <tr>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontWeight: typography.fontWeight.bold
                    }}>SPA/CSR<br/><span style={{ fontSize: "0.85em", fontWeight: typography.fontWeight.normal }}>(React等)</span></td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>Client（JS実行）</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>Client側のみ</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>大きい</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>△</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontSize: "0.9em"
                    }}>管理画面</td>
                  </tr>

                  <tr style={{ backgroundColor: colors.background.subtle }}>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontWeight: typography.fontWeight.bold
                    }}>SSG<br/><span style={{ fontSize: "0.85em", fontWeight: typography.fontWeight.normal }}>(Next.js)</span></td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>Build時（Server）</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>Client側（SPA的）</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>中〜大</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>◎</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontSize: "0.9em"
                    }}>ドキュメント</td>
                  </tr>

                  <tr>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontWeight: typography.fontWeight.bold
                    }}>SSR<br/><span style={{ fontSize: "0.85em", fontWeight: typography.fontWeight.normal }}>(Pages Router)</span></td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>Server（リクエスト時）</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>HTML全体取得</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>大きい</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>◎</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontSize: "0.9em"
                    }}>EC、ニュース</td>
                  </tr>

                  <tr style={{ backgroundColor: colors.background.subtle }}>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontWeight: typography.fontWeight.bold
                    }}>ISR<br/><span style={{ fontSize: "0.85em", fontWeight: typography.fontWeight.normal }}>(Next.js)</span></td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>Server（キャッシュ+再生成）</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>Client側（SPA的）</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>中〜大</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>◎</td>
                    <td style={{
                      padding: spacing.scale[2],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontSize: "0.9em"
                    }}>ブログ</td>
                  </tr>

                  <tr style={{ backgroundColor: colors.primitive.blue[50] }}>
                    <td style={{
                      padding: spacing.scale[2],
                      fontWeight: typography.fontWeight.bold
                    }}>RSC<br/><span style={{ fontSize: "0.85em", fontWeight: typography.fontWeight.normal }}>(App Router)</span></td>
                    <td style={{
                      padding: spacing.scale[2]
                    }}>Server（UI計算）</td>
                    <td style={{
                      padding: spacing.scale[2]
                    }}>Flight Payload（軽量）</td>
                    <td style={{
                      padding: spacing.scale[2]
                    }}>小〜中（SCは除外）</td>
                    <td style={{
                      padding: spacing.scale[2]
                    }}>◎</td>
                    <td style={{
                      padding: spacing.scale[2],
                      fontSize: "0.9em"
                    }}>あらゆるWebアプリ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginTop: spacing.scale[6] }}>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.primitive.pink[700],
              marginBottom: spacing.scale[2]
            }}>
              🔧 主要技術の役割
            </h3>
            <p style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
              marginBottom: spacing.scale[3],
              lineHeight: typography.lineHeight.relaxed
            }}>
              これらの技術は戦略と組み合わせて使われます。
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: typography.fontSize.sm,
                backgroundColor: colors.background.default,
                border: `1px solid ${colors.border.subtle}`
              }}>
                <thead>
                  <tr style={{ backgroundColor: colors.primitive.gray[800], color: colors.text.inverse }}>
                    <th style={{
                      padding: spacing.scale[3],
                      textAlign: "left",
                      borderBottom: `2px solid ${colors.border.default}`,
                      fontWeight: typography.fontWeight.bold,
                      minWidth: "140px"
                    }}>技術</th>
                    <th style={{
                      padding: spacing.scale[3],
                      textAlign: "left",
                      borderBottom: `2px solid ${colors.border.default}`,
                      fontWeight: typography.fontWeight.bold,
                      minWidth: "220px"
                    }}>何のため？</th>
                    <th style={{
                      padding: spacing.scale[3],
                      textAlign: "left",
                      borderBottom: `2px solid ${colors.border.default}`,
                      fontWeight: typography.fontWeight.bold,
                      minWidth: "140px"
                    }}>どこで動く？</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ backgroundColor: colors.background.subtle }}>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontWeight: typography.fontWeight.bold
                    }}>Hydration</td>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>SSRで描画したHTMLにReactを「再結合」する</td>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>Client</td>
                  </tr>
                  <tr>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontWeight: typography.fontWeight.bold
                    }}>Streaming SSR</td>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>HTMLを分割して逐次返す（段階的表示）</td>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>Server → Client</td>
                  </tr>
                  <tr style={{ backgroundColor: colors.primitive.blue[50] }}>
                    <td style={{
                      padding: spacing.scale[3],
                      fontWeight: typography.fontWeight.bold
                    }}>Flight Payload</td>
                    <td style={{
                      padding: spacing.scale[3]
                    }}>RSCの結果を最小データ形式で送る</td>
                    <td style={{
                      padding: spacing.scale[3]
                    }}>Server → Client</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginTop: spacing.scale[6] }}>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.primitive.pink[700],
              marginBottom: spacing.scale[2]
            }}>
              💾 キャッシュ戦略の詳細
            </h3>
            <p style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
              marginBottom: spacing.scale[3],
              lineHeight: typography.lineHeight.relaxed
            }}>
              各戦略でどのようにデータがキャッシュされるかを理解することで、パフォーマンス最適化の指針が見えてきます。
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: spacing.scale[4] }}>
              <div style={{
                padding: spacing.scale[4],
                backgroundColor: colors.background.subtle,
                borderRadius: radii.borderRadius.md,
                border: `1px solid ${colors.border.subtle}`
              }}>
                <h4 style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.bold,
                  marginBottom: spacing.scale[2]
                }}>MPA / SSG / SSR: HTTPキャッシュ</h4>
                <p style={{ fontSize: typography.fontSize.sm, lineHeight: typography.lineHeight.relaxed, marginBottom: spacing.scale[2] }}>
                  ブラウザやCDNがHTTPヘッダー（<code>Cache-Control</code>、<code>ETag</code>など）に基づいてキャッシュ。
                </p>
                <ul style={{
                  marginLeft: spacing.scale[6],
                  fontSize: typography.fontSize.sm,
                  lineHeight: typography.lineHeight.relaxed
                }}>
                  <li><strong>SSG:</strong> ビルド時に生成された静的ファイルをCDNで長期キャッシュ（例: 1年間）</li>
                  <li><strong>SSR:</strong> 動的コンテンツなのでキャッシュ期間は短い、または無効化</li>
                  <li><strong>制御方法:</strong> <code>Cache-Control: max-age=3600</code> など</li>
                </ul>
              </div>

              <div style={{
                padding: spacing.scale[4],
                backgroundColor: colors.background.subtle,
                borderRadius: radii.borderRadius.md,
                border: `1px solid ${colors.border.subtle}`
              }}>
                <h4 style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.bold,
                  marginBottom: spacing.scale[2]
                }}>SPA/CSR: アプリ内状態管理</h4>
                <p style={{ fontSize: typography.fontSize.sm, lineHeight: typography.lineHeight.relaxed, marginBottom: spacing.scale[2] }}>
                  JavaScriptのメモリ上でデータを保持。ページリロードで消える。
                </p>
                <ul style={{
                  marginLeft: spacing.scale[6],
                  fontSize: typography.fontSize.sm,
                  lineHeight: typography.lineHeight.relaxed
                }}>
                  <li>React Query、SWR、Zustandなどのライブラリで管理</li>
                  <li>ローカルストレージ、SessionStorageも併用可能</li>
                  <li>サーバーへのリクエスト頻度を減らすための工夫が必要</li>
                </ul>
              </div>

              <div style={{
                padding: spacing.scale[4],
                backgroundColor: colors.background.subtle,
                borderRadius: radii.borderRadius.md,
                border: `1px solid ${colors.border.subtle}`
              }}>
                <h4 style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.bold,
                  marginBottom: spacing.scale[2]
                }}>ISR: revalidate（サーバー側の定期再生成）</h4>
                <p style={{ fontSize: typography.fontSize.sm, lineHeight: typography.lineHeight.relaxed, marginBottom: spacing.scale[2] }}>
                  静的生成したページを一定時間ごとにバックグラウンドで再生成。
                </p>
                <pre style={{
                  backgroundColor: colors.primitive.gray[900],
                  color: colors.primitive.gray[100],
                  padding: spacing.scale[3],
                  borderRadius: radii.borderRadius.base,
                  fontSize: typography.fontSize.sm,
                  fontFamily: typography.fontFamily.mono,
                  marginBottom: spacing.scale[2]
                }}>
{`// Pages Router
export async function getStaticProps() {
  return {
    props: { data: ... },
    revalidate: 60 // 60秒ごとに再生成
  }
}`}
                </pre>
                <ul style={{
                  marginLeft: spacing.scale[6],
                  fontSize: typography.fontSize.sm,
                  lineHeight: typography.lineHeight.relaxed
                }}>
                  <li>初回アクセスは古いキャッシュを返し、バックグラウンドで更新</li>
                  <li>SSGの速度とSSRの柔軟性を両立</li>
                </ul>
              </div>

              <div style={{
                padding: spacing.scale[4],
                backgroundColor: colors.primitive.blue[50],
                borderRadius: radii.borderRadius.md,
                border: `1px solid ${colors.primitive.blue[300]}`
              }}>
                <h4 style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.bold,
                  marginBottom: spacing.scale[2],
                  color: colors.primitive.blue[900]
                }}>RSC: Router Cache + Data Cache（Next.js独自）</h4>
                <p style={{ fontSize: typography.fontSize.sm, lineHeight: typography.lineHeight.relaxed, marginBottom: spacing.scale[3] }}>
                  Next.js App Routerでは2層のキャッシュ構造を持ちます。
                </p>

                <div style={{ marginBottom: spacing.scale[3] }}>
                  <h5 style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.bold,
                    marginBottom: spacing.scale[2],
                    color: colors.primitive.blue[800]
                  }}>1️⃣ Router Cache（クライアント側）</h5>
                  <ul style={{
                    marginLeft: spacing.scale[6],
                    fontSize: typography.fontSize.sm,
                    lineHeight: typography.lineHeight.relaxed
                  }}>
                    <li><strong>場所:</strong> ブラウザのメモリ</li>
                    <li><strong>対象:</strong> Flight Payloadの結果</li>
                    <li><strong>期間:</strong> セッション中（開発環境ではキャッシュなし）</li>
                    <li><strong>効果:</strong> ページ間の高速な遷移（戻る/進む）</li>
                    <li><strong>クリア:</strong> <code>router.refresh()</code> で強制更新</li>
                  </ul>
                </div>

                <div>
                  <h5 style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.bold,
                    marginBottom: spacing.scale[2],
                    color: colors.primitive.blue[800]
                  }}>2️⃣ Data Cache（サーバー側）</h5>
                  <ul style={{
                    marginLeft: spacing.scale[6],
                    fontSize: typography.fontSize.sm,
                    lineHeight: typography.lineHeight.relaxed
                  }}>
                    <li><strong>場所:</strong> Next.jsサーバー</li>
                    <li><strong>対象:</strong> <code>fetch()</code> の結果</li>
                    <li><strong>期間:</strong> デプロイ間で永続（設定で変更可能）</li>
                    <li><strong>制御:</strong></li>
                  </ul>
                  <pre style={{
                    backgroundColor: colors.primitive.gray[900],
                    color: colors.primitive.gray[100],
                    padding: spacing.scale[3],
                    borderRadius: radii.borderRadius.base,
                    fontSize: typography.fontSize.sm,
                    fontFamily: typography.fontFamily.mono,
                    marginTop: spacing.scale[2]
                  }}>
{`// キャッシュしない
fetch(url, { cache: 'no-store' })

// 60秒ごとに再検証
fetch(url, { next: { revalidate: 60 } })

// ページ全体の設定
export const revalidate = 60`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: spacing.scale[6] }}>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.primitive.pink[700],
              marginBottom: spacing.scale[2]
            }}>
              🛠️ フレームワーク別の比較
            </h3>
            <p style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
              marginBottom: spacing.scale[3],
              lineHeight: typography.lineHeight.relaxed
            }}>
              同じSSGでもフレームワークによって遷移の挙動が異なります。
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: typography.fontSize.sm,
                backgroundColor: colors.background.default,
                border: `1px solid ${colors.border.subtle}`
              }}>
                <thead>
                  <tr style={{ backgroundColor: colors.primitive.gray[800], color: colors.text.inverse }}>
                    <th style={{
                      padding: spacing.scale[3],
                      textAlign: "left",
                      borderBottom: `2px solid ${colors.border.default}`,
                      fontWeight: typography.fontWeight.bold,
                      minWidth: "140px"
                    }}>フレームワーク</th>
                    <th style={{
                      padding: spacing.scale[3],
                      textAlign: "left",
                      borderBottom: `2px solid ${colors.border.default}`,
                      fontWeight: typography.fontWeight.bold,
                      minWidth: "110px"
                    }}>主な用途</th>
                    <th style={{
                      padding: spacing.scale[3],
                      textAlign: "left",
                      borderBottom: `2px solid ${colors.border.default}`,
                      fontWeight: typography.fontWeight.bold,
                      minWidth: "100px"
                    }}>レンダリング</th>
                    <th style={{
                      padding: spacing.scale[3],
                      textAlign: "left",
                      borderBottom: `2px solid ${colors.border.default}`,
                      fontWeight: typography.fontWeight.bold,
                      minWidth: "140px"
                    }}>デフォルト遷移</th>
                    <th style={{
                      padding: spacing.scale[3],
                      textAlign: "left",
                      borderBottom: `2px solid ${colors.border.default}`,
                      fontWeight: typography.fontWeight.bold,
                      minWidth: "90px"
                    }}>JSバンドル</th>
                    <th style={{
                      padding: spacing.scale[3],
                      textAlign: "left",
                      borderBottom: `2px solid ${colors.border.default}`,
                      fontWeight: typography.fontWeight.bold,
                      minWidth: "160px"
                    }}>特徴</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ backgroundColor: colors.background.subtle }}>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontWeight: typography.fontWeight.bold
                    }}>Hugo / Jekyll</td>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>静的サイト</td>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>SSG</td>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>MPA（フルリロード）</td>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>なし〜小</td>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontSize: typography.fontSize.xs
                    }}>シンプル、高速、JSフレームワーク不要</td>
                  </tr>

                  <tr>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontWeight: typography.fontWeight.bold
                    }}>Astro</td>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>コンテンツサイト</td>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>SSG / SSR</td>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>MPA（オプションでSPA的）</td>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>最小限</td>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontSize: typography.fontSize.xs
                    }}>View Transitions APIでSPA的遷移も可能</td>
                  </tr>

                  <tr style={{ backgroundColor: colors.background.subtle }}>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontWeight: typography.fontWeight.bold
                    }}>Gatsby</td>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>ブログ、サイト</td>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>SSG</td>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>SPA（Client側）</td>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>大きい</td>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontSize: typography.fontSize.xs
                    }}>Reactベース、GraphQLでデータ取得</td>
                  </tr>

                  <tr>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontWeight: typography.fontWeight.bold
                    }}>Next.js<br/><span style={{ fontSize: "0.85em", fontWeight: typography.fontWeight.normal }}>(Pages Router)</span></td>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>Webアプリ</td>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>SSG / SSR / ISR</td>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>SPA（Client側）</td>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`
                    }}>大きい</td>
                    <td style={{
                      padding: spacing.scale[3],
                      borderBottom: `1px solid ${colors.border.subtle}`,
                      fontSize: typography.fontSize.xs
                    }}>ハイブリッド、ページごとに戦略選択可能</td>
                  </tr>

                  <tr style={{ backgroundColor: colors.primitive.blue[50] }}>
                    <td style={{
                      padding: spacing.scale[3],
                      fontWeight: typography.fontWeight.bold
                    }}>Next.js<br/><span style={{ fontSize: "0.85em", fontWeight: typography.fontWeight.normal }}>(App Router)</span></td>
                    <td style={{
                      padding: spacing.scale[3]
                    }}>Webアプリ</td>
                    <td style={{
                      padding: spacing.scale[3]
                    }}>RSC</td>
                    <td style={{
                      padding: spacing.scale[3]
                    }}>Flight Payload（軽量）</td>
                    <td style={{
                      padding: spacing.scale[3]
                    }}>小〜中</td>
                    <td style={{
                      padding: spacing.scale[3],
                      fontSize: typography.fontSize.xs
                    }}>Server Components、最小JSバンドル</td>
                  </tr>

                  <tr style={{ backgroundColor: colors.background.subtle }}>
                    <td style={{
                      padding: spacing.scale[3],
                      fontWeight: typography.fontWeight.bold
                    }}>Create React App<br/><span style={{ fontSize: "0.85em", fontWeight: typography.fontWeight.normal }}>(Vite等)</span></td>
                    <td style={{
                      padding: spacing.scale[3]
                    }}>SPAアプリ</td>
                    <td style={{
                      padding: spacing.scale[3]
                    }}>CSR</td>
                    <td style={{
                      padding: spacing.scale[3]
                    }}>SPA（Client側）</td>
                    <td style={{
                      padding: spacing.scale[3]
                    }}>大きい</td>
                    <td style={{
                      padding: spacing.scale[3],
                      fontSize: typography.fontSize.xs
                    }}>純粋なSPA、SEO不向き</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{
              marginTop: spacing.scale[4],
              padding: spacing.scale[4],
              backgroundColor: colors.primitive.green[50],
              borderRadius: radii.borderRadius.md,
              border: `1px solid ${colors.primitive.green[200]}`
            }}>
              <h4 style={{
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.bold,
                marginBottom: spacing.scale[2],
                color: colors.primitive.green[900]
              }}>💡 重要な違い</h4>
              <ul style={{
                marginLeft: spacing.scale[6],
                fontSize: typography.fontSize.sm,
                lineHeight: typography.lineHeight.relaxed
              }}>
                <li><strong>MPA vs ハイブリッド:</strong> 同じSSGでも、Hugo/Jekyllはフルリロード、Next.jsはSPA的遷移</li>
                <li><strong>Astroの柔軟性:</strong> デフォルトMPAだが、View Transitions APIでSPA的にも可能</li>
                <li><strong>Next.js App Router:</strong> Flight Payloadで遷移時のデータ転送を最小化</li>
                <li><strong>JSバンドルサイズ:</strong> Astro/Hugo（最小） &lt; Next.js App Router（小〜中） &lt; Gatsby/Pages Router（大）</li>
              </ul>
            </div>
          </div>

          <div style={{ marginTop: spacing.scale[6] }}>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.primitive.pink[700],
              marginBottom: spacing.scale[2]
            }}>
              📈 レンダリングフロー（シーケンス図）
            </h3>
            <p style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
              marginBottom: spacing.scale[4],
              lineHeight: typography.lineHeight.relaxed
            }}>
              各戦略のリクエストフローを時系列で理解しましょう。
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: spacing.scale[6] }}>
              {/* SSG */}
              <div style={{
                padding: spacing.scale[4],
                backgroundColor: colors.background.subtle,
                borderRadius: radii.borderRadius.lg,
                border: `1px solid ${colors.border.subtle}`
              }}>
                <h4 style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.bold,
                  marginBottom: spacing.scale[3],
                  color: colors.primitive.green[800]
                }}>1️⃣ SSG（Static Site Generation）</h4>
                <ClickableDiagram
                  title="SSG（Static Site Generation）のシーケンス図"
                  chart={`
sequenceDiagram
    autonumber
    rect rgb(240, 240, 245)
        Note over 開発者,CDN: ビルド時
        開発者->>Next.js Build: npm run build
        Next.js Build->>DB/API: データ取得
        DB/API-->>Next.js Build: データ返却
        Next.js Build->>CDN: 静的HTML + JSON保存
        Note right of CDN: Vercel: Edge Network<br/>AWS: S3<br/>自社: ローカルディスク
        Next.js Build-->>開発者: ビルド完了
    end

    rect rgb(230, 250, 240)
        Note over ユーザー,ブラウザ: 初回アクセス
        ユーザー->>CDN: ページリクエスト
        CDN->>ストレージ: HTML取得
        ストレージ-->>CDN: HTML返却
        CDN-->>ユーザー: HTML配信
        ブラウザ->>ブラウザ: Hydration（JS実行）
        Note right of ブラウザ: これ以降、ReactアプリとしてSPA状態
    end

    rect rgb(255, 250, 230)
        Note over ユーザー,ブラウザ: ページ遷移時（Next.js Link）
        ユーザー->>ブラウザ: リンククリック
        ブラウザ->>CDN: JSONリクエスト
        Note right of CDN: /_next/data/build-id/page.json
        CDN-->>ブラウザ: JSON返却（キャッシュ済み）
        ブラウザ->>ブラウザ: Reactで差分更新
        Note right of ブラウザ: Hydration不要、すでにReact動作中
    end

    rect rgb(250, 240, 250)
        Note over ユーザー,ブラウザ: 再訪問（リロード）
        ユーザー->>CDN: ページリクエスト
        CDN-->>ユーザー: HTML配信
        alt JSキャッシュヒット
            ブラウザキャッシュ-->>ブラウザ: JSファイル即座に使用
            ブラウザ->>ブラウザ: Hydration実行（超高速）
        else JSキャッシュミス
            ブラウザ->>CDN: JSファイルリクエスト
            CDN-->>ブラウザ: JSファイル配信
            ブラウザ->>ブラウザ: Hydration実行
        end
    end
                `} />
                <p style={{
                  marginTop: spacing.scale[2],
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary
                }}>
                  💡 <strong>ポイント:</strong> ビルド時に全ページ生成。CDNエッジキャッシュで最速配信。データ更新には再ビルド必要。
                </p>
              </div>

              {/* SSR */}
              <div style={{
                padding: spacing.scale[4],
                backgroundColor: colors.background.subtle,
                borderRadius: radii.borderRadius.lg,
                border: `1px solid ${colors.border.subtle}`
              }}>
                <h4 style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.bold,
                  marginBottom: spacing.scale[3],
                  color: colors.primitive.blue[800]
                }}>2️⃣ SSR（Server-Side Rendering）</h4>
                <ClickableDiagram
                  title="SSR（Server-Side Rendering）のシーケンス図"
                  chart={`
sequenceDiagram
    autonumber
    rect rgb(230, 245, 255)
        Note over ユーザー,ブラウザ: 初回アクセス
        ユーザー->>Server: ページリクエスト
        Server->>DB/API: データ取得
        DB/API-->>Server: データ返却
        Server->>Server: HTMLレンダリング
        Server-->>ユーザー: HTML配信
        Note right of ユーザー: HTML内にscriptタグ
        alt JSキャッシュヒット
            ブラウザキャッシュ-->>ブラウザ: JSファイル使用
        else JSキャッシュミス
            ブラウザ->>CDN: JSファイルリクエスト
            CDN-->>ブラウザ: JSファイル配信
        end
        ブラウザ->>ブラウザ: Hydration実行
        Note right of ブラウザ: これ以降、ReactアプリとしてSPA状態
    end

    rect rgb(255, 250, 230)
        Note over ユーザー,ブラウザ: ページ遷移時（Next.js Link）
        ユーザー->>ブラウザ: リンククリック
        ブラウザ->>Server: JSONリクエスト
        Note right of Server: /_next/data/build-id/page.json
        Server->>DB/API: データ取得
        DB/API-->>Server: データ返却
        Server-->>ブラウザ: JSON配信
        ブラウザ->>ブラウザ: Reactで差分更新
        Note right of ブラウザ: Hydration不要、すでにReact動作中
    end

    rect rgb(250, 240, 250)
        Note over ユーザー,ブラウザ: 再訪問（リロード）
        ユーザー->>Server: ページリクエスト
        Server->>DB/API: データ取得（最新）
        DB/API-->>Server: データ返却
        Server-->>ユーザー: 新しいHTML配信
        ブラウザキャッシュ-->>ブラウザ: JSファイル使用（ヒット）
        ブラウザ->>ブラウザ: Hydration実行
    end
                `} />
                <p style={{
                  marginTop: spacing.scale[2],
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary
                }}>
                  💡 <strong>ポイント:</strong> リクエストごとにサーバーでHTML生成。常に最新データだがSSGより遅い。
                </p>
              </div>

              {/* ISR */}
              <div style={{
                padding: spacing.scale[4],
                backgroundColor: colors.background.subtle,
                borderRadius: radii.borderRadius.lg,
                border: `1px solid ${colors.border.subtle}`
              }}>
                <h4 style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.bold,
                  marginBottom: spacing.scale[3],
                  color: colors.primitive.orange[800]
                }}>3️⃣ ISR（Incremental Static Regeneration）</h4>
                <ClickableDiagram
                  title="ISR（Incremental Static Regeneration）のシーケンス図"
                  chart={`
sequenceDiagram
    autonumber
    rect rgb(240, 240, 245)
        Note over 開発者,CDN: ビルド時
        開発者->>Next.js Build: npm run build
        Next.js Build->>DB/API: データ取得
        DB/API-->>Next.js Build: データ返却
        Next.js Build->>CDN: 静的HTML + JSON保存
        Note right of CDN: revalidate: 60 設定<br/>（60秒ごとに再検証）
    end

    rect rgb(230, 250, 240)
        Note over ユーザー,Server: 初回アクセス（キャッシュ有効）
        ユーザー->>Server: ページリクエスト
        Server->>キャッシュ: キャッシュ確認（有効）
        Server-->>ユーザー: キャッシュHTML配信（高速）
        ブラウザ->>ブラウザ: Hydration実行
    end

    rect rgb(255, 245, 230)
        Note over ユーザー,Server: リクエスト時（キャッシュ期限切れ）
        ユーザー->>Server: ページリクエスト
        Server->>キャッシュ: キャッシュ確認（期限切れ）
        Server-->>ユーザー: 古いHTML配信（まず返す）
        Note right of Server: Stale-While-Revalidate戦略
        par バックグラウンド再生成
            Server->>DB/API: データ取得
            DB/API-->>Server: 新データ返却
            Server->>Server: 新HTML + JSON生成
            Server->>キャッシュ: 新HTML保存
        end
    end

    rect rgb(255, 250, 230)
        Note over ユーザー,ブラウザ: ページ遷移時（Next.js Link）
        ユーザー->>ブラウザ: リンククリック
        ブラウザ->>Server: JSONリクエスト
        Server->>キャッシュ: JSON確認
        Server-->>ブラウザ: JSON返却
        ブラウザ->>ブラウザ: Reactで差分更新
    end

    rect rgb(230, 255, 230)
        Note over ユーザー,Server: 次のリクエスト
        ユーザー->>Server: ページリクエスト
        Server-->>ユーザー: 更新されたHTML配信
    end
                `} />
                <p style={{
                  marginTop: spacing.scale[2],
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary
                }}>
                  💡 <strong>ポイント:</strong> Stale-While-Revalidate戦略。古いキャッシュをまず返し、バックグラウンドで更新。
                </p>
                <ul style={{
                  marginTop: spacing.scale[2],
                  marginLeft: spacing.scale[6],
                  fontSize: typography.fontSize.sm,
                  lineHeight: typography.lineHeight.relaxed,
                  color: colors.text.secondary
                }}>
                  <li>アクセスがないページは再生成されない（効率的）</li>
                  <li>古いキャッシュをまず返してバックグラウンドで更新（高速）</li>
                  <li>リクエストタイミングで最新化（オンデマンドなキャッシュ更新）</li>
                </ul>
              </div>

              {/* RSC */}
              <div style={{
                padding: spacing.scale[4],
                backgroundColor: colors.primitive.blue[50],
                borderRadius: radii.borderRadius.lg,
                border: `1px solid ${colors.primitive.blue[300]}`
              }}>
                <h4 style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.bold,
                  marginBottom: spacing.scale[3],
                  color: colors.primitive.blue[900]
                }}>4️⃣ RSC（React Server Components）+ Flight Payload</h4>
                <ClickableDiagram
                  title="RSC（React Server Components）+ Flight Payload のシーケンス図"
                  chart={`
sequenceDiagram
    autonumber
    rect rgb(230, 245, 255)
        Note over ユーザー,ブラウザ: 初回アクセス
        ユーザー->>Server: ページリクエスト
        Server->>Data Cache: fetch()結果確認
        alt Data Cache ヒット
            Data Cache-->>Server: キャッシュデータ使用
        else Data Cache ミス
            Server->>DB/API: データ取得
            DB/API-->>Server: データ返却
            Server->>Data Cache: 結果をキャッシュ
        end
        Server->>Server: Server Components実行
        Server->>Server: HTMLレンダリング
        Server-->>ユーザー: 完全なHTML配信
        alt JSキャッシュヒット
            ブラウザキャッシュ-->>ブラウザ: JSファイル使用
        else JSキャッシュミス
            ブラウザ->>CDN: JSファイルリクエスト
            CDN-->>ブラウザ: JSファイル配信
        end
        ブラウザ->>ブラウザ: Client ComponentsのみHydration
        Note right of ブラウザ: Server Componentsは<br/>Hydration不要<br/>（サーバー実行済み）
    end

    rect rgb(245, 250, 255)
        Note over ユーザー,ブラウザ: ページ遷移時（Next.js Link）
        ユーザー->>ブラウザ: リンククリック
        ブラウザ->>Router Cache: Flight Payload確認
        alt Router Cache ヒット（本番のみ）
            Router Cache-->>ブラウザ: キャッシュPayload使用
            ブラウザ->>ブラウザ: Reactツリーに適用（即座）
        else Router Cache ミス
            ブラウザ->>Server: ?_rsc=xxx（Flight Payloadリクエスト）
            Note right of Server: ヘッダー: RSC: 1
            Server->>Data Cache: fetch()結果確認
            Server->>DB/API: データ取得（必要時）
            Server->>Server: Server Components実行
            Server->>Server: Flight Payload生成
            Server-->>ブラウザ: Flight Payload配信
            Note right of Server: Content-Type:<br/>text/x-component
            ブラウザ->>Router Cache: Payload保存
            ブラウザ->>ブラウザ: Reactツリーに適用
        end
        Note right of ブラウザ: Hydration不要、<br/>すでにReact動作中
    end

    rect rgb(250, 240, 250)
        Note over ユーザー,ブラウザ: 再訪問（リロード）
        ユーザー->>Server: ページリクエスト
        Server->>Data Cache: fetch()確認（ヒット）
        Server->>Server: Server Components実行
        Server-->>ユーザー: HTML配信
        ブラウザキャッシュ-->>ブラウザ: JSファイル使用（ヒット）
        ブラウザ->>ブラウザ: Client Components Hydration
    end
                `} />
                <p style={{
                  marginTop: spacing.scale[2],
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary
                }}>
                  💡 <strong>ポイント:</strong> 初回はHTML全体、遷移時はFlight Payload（軽量）のみ。2層キャッシュで最適化。
                </p>
              </div>

              {/* SPA/CSR */}
              <div style={{
                padding: spacing.scale[4],
                backgroundColor: colors.background.subtle,
                borderRadius: radii.borderRadius.lg,
                border: `1px solid ${colors.border.subtle}`
              }}>
                <h4 style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.bold,
                  marginBottom: spacing.scale[3],
                  color: colors.primitive.red[800]
                }}>5️⃣ SPA/CSR（Client-Side Rendering）</h4>
                <ClickableDiagram
                  title="SPA/CSR（Client-Side Rendering）のシーケンス図"
                  chart={`
sequenceDiagram
    autonumber
    rect rgb(255, 240, 240)
        Note over ユーザー,ブラウザ: 初回アクセス
        ユーザー->>CDN: index.htmlリクエスト
        CDN-->>ユーザー: 空のHTML配信
        Note right of CDN: <div id="root"></div>のみ<br/>コンテンツなし
        alt JSキャッシュヒット
            ブラウザキャッシュ-->>ブラウザ: JSバンドル使用
        else JSキャッシュミス
            ブラウザ->>CDN: JSバンドルリクエスト
            Note right of CDN: Reactライブラリ +<br/>アプリコード（大容量）
            CDN-->>ブラウザ: JSバンドル配信
        end
        ブラウザ->>ブラウザ: JSダウンロード・実行
        ブラウザ->>ブラウザ: React初期化
        ブラウザ->>API: データ取得リクエスト
        API-->>ブラウザ: JSON返却
        ブラウザ->>ブラウザ: Reactレンダリング
        ブラウザ-->>ユーザー: UI表示
        Note right of ブラウザ: この時点で初めて<br/>コンテンツが表示される<br/>（初期表示遅い）
    end

    rect rgb(255, 250, 230)
        Note over ユーザー,ブラウザ: ページ遷移時（React Router等）
        ユーザー->>ブラウザ: リンククリック
        ブラウザ->>ブラウザ: ルート変更（Client側のみ）
        Note right of ブラウザ: サーバーリクエストなし<br/>URLのみ変更
        ブラウザ->>メモリキャッシュ: データ確認
        alt キャッシュヒット
            メモリキャッシュ-->>ブラウザ: キャッシュデータ使用
            ブラウザ->>ブラウザ: Reactで再レンダリング（即座）
        else キャッシュミス
            ブラウザ->>API: 新ページデータリクエスト
            API-->>ブラウザ: JSON返却
            ブラウザ->>メモリキャッシュ: データ保存
            ブラウザ->>ブラウザ: Reactで再レンダリング
        end
        ブラウザ-->>ユーザー: UI更新（高速）
    end

    rect rgb(250, 240, 250)
        Note over ユーザー,ブラウザ: 再訪問（リロード）
        ユーザー->>CDN: index.htmlリクエスト
        CDN-->>ユーザー: 空のHTML配信
        ブラウザキャッシュ-->>ブラウザ: JSバンドル使用（ヒット）
        ブラウザ->>ブラウザ: JS実行
        ブラウザ->>API: データリクエスト
        API-->>ブラウザ: JSON返却
        ブラウザ->>ブラウザ: レンダリング
        Note right of ブラウザ: メモリキャッシュは<br/>リロードで消失
    end
                `} />
                <p style={{
                  marginTop: spacing.scale[2],
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary
                }}>
                  💡 <strong>ポイント:</strong> 初回は空HTML。全てJSで描画。遷移は高速だがSEO不利、初期表示遅い。
                </p>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: spacing.scale[6],
            padding: spacing.scale[4],
            backgroundColor: colors.primitive.gray[50],
            borderRadius: radii.borderRadius.md,
            border: `1px solid ${colors.primitive.gray[200]}`
          }}>
            <h4 style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.bold,
              marginBottom: spacing.scale[2],
              color: colors.primitive.gray[900]
            }}>📖 用語解説</h4>
            <ul style={{
              marginLeft: spacing.scale[6],
              fontSize: typography.fontSize.xs,
              lineHeight: typography.lineHeight.relaxed
            }}>
              <li><strong>MPA (Multi-Page Application):</strong> 従来型のWebサイト。ページ遷移のたびにサーバーから完全なHTMLを取得</li>
              <li><strong>SPA/CSR (Single Page Application / Client-Side Rendering):</strong> クライアント側でJavaScriptがページを動的に生成</li>
              <li><strong>SSG (Static Site Generation):</strong> ビルド時に静的HTMLを生成。Next.jsではPages/App Router両方で利用可能</li>
              <li><strong>SSR (Server-Side Rendering):</strong> リクエストごとにサーバーでHTMLを生成。Next.js Pages Routerの主要機能</li>
              <li><strong>ISR (Incremental Static Regeneration):</strong> 静的生成とSSRのハイブリッド。一定時間ごとに再生成</li>
              <li><strong>Streaming SSR:</strong> HTMLを段階的に送信する技術。Suspenseと組み合わせて使用</li>
              <li><strong>RSC (React Server Components):</strong> Next.js App Router。サーバーとクライアントのコンポーネントを明確に分離</li>
              <li><strong>Flight Payload:</strong> RSCの結果を軽量なデータ形式で送信する仕組み。画面遷移時にHTML全体ではなく必要なデータのみ送信</li>
              <li><strong>Hydration:</strong> サーバーでレンダリングされた静的HTMLにクライアント側のJavaScriptを「結合」してインタラクティブにするプロセス</li>
            </ul>
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
        padding: spacing.scale[6],
        backgroundColor: colors.primitive.blue[50],
        borderRadius: radii.borderRadius.lg,
        border: `1px solid ${colors.primitive.blue[200]}`
      }}>
        <h2 style={{
          fontSize: typography.heading.h5.fontSize,
          fontWeight: typography.heading.h5.fontWeight,
          margin: 0,
          marginBottom: spacing.scale[4],
          color: colors.primitive.blue[800]
        }}>
          🔄 データ取得の使い分け
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: spacing.scale[6] }}>
          {/* Server Component vs React Query */}
          <div>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.primitive.blue[700],
              marginBottom: spacing.scale[3]
            }}>
              1. Server Component vs Client Component + React Query
            </h3>

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
                    <th style={{ padding: spacing.scale[2], textAlign: "left" }}>観点</th>
                    <th style={{ padding: spacing.scale[2], textAlign: "left" }}>Server Component</th>
                    <th style={{ padding: spacing.scale[2], textAlign: "left" }}>React Query</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: `1px solid ${colors.border.subtle}` }}>
                    <td style={{ padding: spacing.scale[2] }}><strong>実行環境</strong></td>
                    <td style={{ padding: spacing.scale[2] }}>サーバー側のみ</td>
                    <td style={{ padding: spacing.scale[2] }}>クライアント側のみ</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${colors.border.subtle}` }}>
                    <td style={{ padding: spacing.scale[2] }}><strong>データ取得</strong></td>
                    <td style={{ padding: spacing.scale[2] }}>fetch、DB直接アクセス可能</td>
                    <td style={{ padding: spacing.scale[2] }}>APIエンドポイント経由のみ</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${colors.border.subtle}` }}>
                    <td style={{ padding: spacing.scale[2] }}><strong>データ形式</strong></td>
                    <td style={{ padding: spacing.scale[2] }}>RSC Payload（React専用ストリーム形式）</td>
                    <td style={{ padding: spacing.scale[2] }}>JSON（REST API / GraphQL）</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${colors.border.subtle}` }}>
                    <td style={{ padding: spacing.scale[2] }}><strong>キャッシュ</strong></td>
                    <td style={{ padding: spacing.scale[2] }}>Next.js Data Cache（無期限デフォルト）</td>
                    <td style={{ padding: spacing.scale[2] }}>React Query Cache（開発者が制御）</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${colors.border.subtle}` }}>
                    <td style={{ padding: spacing.scale[2] }}><strong>再取得</strong></td>
                    <td style={{ padding: spacing.scale[2] }}>ページ遷移時（Flight Payload経由）</td>
                    <td style={{ padding: spacing.scale[2] }}>リアルタイム・手動refetch可能</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${colors.border.subtle}` }}>
                    <td style={{ padding: spacing.scale[2] }}><strong>ローディング状態</strong></td>
                    <td style={{ padding: spacing.scale[2] }}>Suspense境界で管理（デフォルト）</td>
                    <td style={{ padding: spacing.scale[2] }}>Suspense対応可能 or isLoading等で細かく制御</td>
                  </tr>
                  <tr>
                    <td style={{ padding: spacing.scale[2] }}><strong>適している用途</strong></td>
                    <td style={{ padding: spacing.scale[2] }}>初期表示データ、SEO重要なデータ</td>
                    <td style={{ padding: spacing.scale[2] }}>ユーザー操作に応じた動的データ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* fetch vs React Query */}
          <div>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.primitive.green[700],
              marginBottom: spacing.scale[3]
            }}>
              2. fetch（単体）vs React Query
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: spacing.scale[3] }}>
              <div>
                <h4 style={{
                  fontSize: typography.body.base.fontSize,
                  fontWeight: 600,
                  marginBottom: spacing.scale[2],
                }}>
                  fetch（単体）の問題点
                </h4>
                <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed }}>
                  <li>キャッシュを自分で実装する必要がある</li>
                  <li>ローディング・エラー状態を自分で管理</li>
                  <li>重複リクエストの防止機能なし</li>
                  <li>バックグラウンド更新の仕組みなし</li>
                </ul>
              </div>

              <div>
                <h4 style={{
                  fontSize: typography.body.base.fontSize,
                  fontWeight: 600,
                  marginBottom: spacing.scale[2],
                }}>
                  React Queryが提供するもの
                </h4>
                <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed }}>
                  <li><strong>自動キャッシュ:</strong> staleTime、cacheTimeで制御可能</li>
                  <li><strong>状態管理:</strong> isLoading、isError、dataを自動管理</li>
                  <li><strong>重複排除:</strong> 同じクエリは自動でまとめられる</li>
                  <li><strong>バックグラウンド更新:</strong> refetchOnWindowFocus、refetchInterval</li>
                  <li><strong>楽観的更新:</strong> mutationとの連携</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 検索画面の例 */}
          <div>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.primitive.orange[700],
              marginBottom: spacing.scale[3]
            }}>
              3. 検索画面での責務分担（実例）
            </h3>

            <div style={{
              padding: spacing.scale[4],
              backgroundColor: colors.feedback.info.bg,
              borderRadius: radii.borderRadius.md,
              border: `1px solid ${colors.feedback.info.border}`,
              marginBottom: spacing.scale[3]
            }}>
              <h4 style={{
                fontSize: typography.body.base.fontSize,
                fontWeight: 600,
                marginBottom: spacing.scale[3],
              }}>
                パターンA: Server Component中心（推奨）
              </h4>
              <div style={{ marginBottom: spacing.scale[3] }}>
                <strong>Server Component（page.tsx）:</strong>
                <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed, marginTop: spacing.scale[1] }}>
                  <li>URL searchParamsから検索条件を取得</li>
                  <li>初期検索結果をサーバー側で取得</li>
                  <li>SEOに対応（クローラーが結果を読める）</li>
                </ul>
              </div>
              <div>
                <strong>Client Component（SearchForm.tsx）:</strong>
                <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed, marginTop: spacing.scale[1] }}>
                  <li>検索フォームのUI</li>
                  <li>フォーム送信時にURLを更新（router.push）</li>
                  <li>→ Server Componentが再レンダリング（Flight Payload経由）</li>
                </ul>
              </div>
            </div>

            <div style={{
              padding: spacing.scale[4],
              backgroundColor: colors.background.subtle,
              borderRadius: radii.borderRadius.md,
              border: `1px solid ${colors.border.subtle}`
            }}>
              <h4 style={{
                fontSize: typography.body.base.fontSize,
                fontWeight: 600,
                marginBottom: spacing.scale[3],
              }}>
                パターンB: React Query中心（SPA的アプローチ）
              </h4>
              <div style={{ marginBottom: spacing.scale[3] }}>
                <strong>使うべきケース:</strong>
                <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed, marginTop: spacing.scale[1] }}>
                  <li>リアルタイム検索（入力ごとに結果更新）</li>
                  <li>無限スクロール</li>
                  <li>管理画面、マイページ（注文履歴、購入履歴など）</li>
                  <li>社内ツール、ダッシュボード</li>
                  <li>→ RSC不要。SEO不要で、ユーザー操作が多い画面</li>
                </ul>
              </div>
              <div style={{ marginBottom: spacing.scale[3] }}>
                <strong>実装:</strong>
                <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed, marginTop: spacing.scale[1] }}>
                  <li>全てClient Componentで構成（SPA的）</li>
                  <li>useQueryで検索APIを呼び出し</li>
                  <li>検索条件変更時に自動refetch</li>
                  <li>キャッシュでUX向上（戻るボタンで即座に表示）</li>
                  <li>Server Componentは使わず、Next.jsはルーティングのみ利用</li>
                </ul>
              </div>
              <div style={{
                padding: spacing.scale[3],
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                borderRadius: radii.borderRadius.sm,
                fontSize: typography.body.small.fontSize,
              }}>
                <strong>💡 Flight Payloadについて:</strong> この場合もページ遷移時にFlight Payloadリクエスト（<code>?_rsc=...</code>）は発生しますが、
                Server Componentがないため中身はほぼ空（メタデータのみ）。実質的なデータ取得はReact Queryが担当します。
              </div>
            </div>

            <div style={{
              padding: spacing.scale[4],
              backgroundColor: colors.primitive.orange[50],
              borderRadius: radii.borderRadius.md,
              border: `1px solid ${colors.primitive.orange[200]}`,
              marginBottom: spacing.scale[3]
            }}>
              <h4 style={{
                fontSize: typography.body.base.fontSize,
                fontWeight: 600,
                marginBottom: spacing.scale[3],
                color: colors.primitive.orange[800]
              }}>
                パターンC: 基幹システムの検索
              </h4>
              <div style={{ marginBottom: spacing.scale[3] }}>
                <strong>特徴:</strong>
                <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed, marginTop: spacing.scale[1] }}>
                  <li>在庫管理、受発注、顧客管理などの社内システム</li>
                  <li>複雑な検索条件（10個以上のフィルタも）</li>
                  <li>高度なソート・ページング機能</li>
                  <li>データ量が多い（数万〜数十万件）</li>
                  <li>SEO完全不要（社内ユーザーのみ）</li>
                </ul>
              </div>
              <div style={{ marginBottom: spacing.scale[3] }}>
                <strong>実装:</strong>
                <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed, marginTop: spacing.scale[1] }}>
                  <li>全てClient Component + React Query</li>
                  <li>検索条件をURLに同期（共有・ブックマーク可能に）</li>
                  <li>useQueryのkeyに検索条件を含める（自動キャッシュ）</li>
                  <li>サーバー側でページングとフィルタリング</li>
                  <li>仮想スクロール（react-window）で大量データを表示</li>
                </ul>
              </div>
              <div style={{
                padding: spacing.scale[3],
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                borderRadius: radii.borderRadius.sm,
                fontSize: typography.body.small.fontSize,
              }}>
                <strong>💡 ポイント:</strong> URLに検索条件を保持しつつ、React Queryでキャッシュ。
                「戻る」ボタンで前の検索結果が即座に表示される高速UX。Server Component不要。
              </div>
            </div>

            <div style={{
              padding: spacing.scale[4],
              backgroundColor: colors.feedback.warning.bg,
              borderRadius: radii.borderRadius.md,
              border: `1px solid ${colors.feedback.warning.border}`,
              marginBottom: spacing.scale[3]
            }}>
              <h4 style={{
                fontSize: typography.body.base.fontSize,
                fontWeight: 600,
                marginBottom: spacing.scale[3],
              }}>
                パターンD: fetchのみ（React Query使わない）
              </h4>
              <div style={{ marginBottom: spacing.scale[3] }}>
                <strong>使うべきケース:</strong>
                <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed, marginTop: spacing.scale[1] }}>
                  <li>小規模・シンプルな画面</li>
                  <li>1回だけデータを取得すれば十分</li>
                  <li>キャッシュやリトライ機能が不要</li>
                </ul>
              </div>
              <div style={{ marginBottom: spacing.scale[3] }}>
                <strong>問題点:</strong>
                <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed, marginTop: spacing.scale[1] }}>
                  <li>ローディング・エラー状態を自分で管理</li>
                  <li>キャッシュなし（同じデータを何度も取得）</li>
                  <li>重複リクエストの制御なし</li>
                  <li>画面が複雑になると状態管理が煩雑化</li>
                </ul>
              </div>
              <div style={{
                padding: spacing.scale[3],
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                borderRadius: radii.borderRadius.sm,
                fontSize: typography.body.small.fontSize,
              }}>
                <strong>💡 推奨:</strong> 小規模なら問題ないが、画面が成長する可能性があるならReact Queryを最初から使う方が良い
              </div>
            </div>

            <div style={{
              padding: spacing.scale[4],
              backgroundColor: colors.primitive.pink[50],
              borderRadius: radii.borderRadius.md,
              border: `1px solid ${colors.primitive.pink[200]}`,
              marginBottom: spacing.scale[3]
            }}>
              <h4 style={{
                fontSize: typography.body.base.fontSize,
                fontWeight: 600,
                marginBottom: spacing.scale[3],
                color: colors.primitive.pink[800]
              }}>
                パターンE: React Queryのみ（ECサイトでも使える？）
              </h4>
              <div style={{ marginBottom: spacing.scale[3] }}>
                <strong>メリット:</strong>
                <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed, marginTop: spacing.scale[1] }}>
                  <li>実装がシンプル（全てClient Component）</li>
                  <li>リアルタイム更新が容易</li>
                  <li>キャッシュ戦略を細かく制御可能</li>
                </ul>
              </div>
              <div style={{ marginBottom: spacing.scale[3] }}>
                <strong>デメリット:</strong>
                <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed, marginTop: spacing.scale[1] }}>
                  <li><strong>SEO不利:</strong> 検索エンジンが商品データを読めない</li>
                  <li><strong>初期表示が遅い:</strong> クライアントでAPIリクエスト → データ取得 → 描画</li>
                  <li><strong>ローディング画面:</strong> ユーザーは必ず読み込み待ち</li>
                </ul>
              </div>
              <div style={{
                padding: spacing.scale[3],
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                borderRadius: radii.borderRadius.sm,
                fontSize: typography.body.small.fontSize,
              }}>
                <strong>⚠️ 結論:</strong> ECサイトでReact QueryのみはNG。SEOが重要なため、少なくとも初期表示はServer Componentで。
              </div>
            </div>

            <div style={{
              padding: spacing.scale[4],
              backgroundColor: colors.feedback.success.bg,
              borderRadius: radii.borderRadius.md,
              border: `1px solid ${colors.feedback.success.border}`
            }}>
              <h4 style={{
                fontSize: typography.body.base.fontSize,
                fontWeight: 600,
                marginBottom: spacing.scale[3],
                color: colors.feedback.success.text
              }}>
                パターンF: ハイブリッド（ECサイト推奨 ✨）
              </h4>
              <div style={{ marginBottom: spacing.scale[3] }}>
                <strong style={{ color: colors.feedback.success.text }}>Server Component（page.tsx）:</strong>
                <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed, marginTop: spacing.scale[1], color: colors.feedback.success.text }}>
                  <li>URL searchParamsから検索条件を取得</li>
                  <li>初期検索結果をサーバー側で取得（SEO対応）</li>
                  <li>商品リストの基本データを配信</li>
                </ul>
              </div>
              <div style={{ marginBottom: spacing.scale[3] }}>
                <strong style={{ color: colors.feedback.success.text }}>React Query（Client Component）:</strong>
                <ul style={{ marginLeft: spacing.scale[6], lineHeight: typography.lineHeight.relaxed, marginTop: spacing.scale[1], color: colors.feedback.success.text }}>
                  <li>フィルタ変更時の再検索（価格帯、色、サイズなど）</li>
                  <li>無限スクロール（次のページ読み込み）</li>
                  <li>在庫状況のリアルタイム更新</li>
                  <li>お気に入り・カート状態の同期</li>
                </ul>
              </div>
              <div style={{
                padding: spacing.scale[3],
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                borderRadius: radii.borderRadius.sm,
                fontSize: typography.body.small.fontSize,
                color: colors.feedback.success.text
              }}>
                <strong>✅ 最強の組み合わせ:</strong> SEOとUXを両立。初期表示は高速でクローラーにも優しく、ユーザー操作には即座に反応。
              </div>
            </div>
          </div>

          {/* キャッシュ戦略 */}
          <div>
            <h3 style={{
              fontSize: typography.heading.h6.fontSize,
              fontWeight: typography.heading.h6.fontWeight,
              color: colors.primitive.pink[700],
              marginBottom: spacing.scale[3]
            }}>
              4. キャッシュ戦略の違い
            </h3>

            <div style={{
              padding: spacing.scale[4],
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: radii.borderRadius.md,
            }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: typography.body.small.fontSize,
              }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${colors.border.default}` }}>
                    <th style={{ padding: spacing.scale[2], textAlign: "left" }}>種類</th>
                    <th style={{ padding: spacing.scale[2], textAlign: "left" }}>場所</th>
                    <th style={{ padding: spacing.scale[2], textAlign: "left" }}>デフォルト期限</th>
                    <th style={{ padding: spacing.scale[2], textAlign: "left" }}>無効化方法</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: `1px solid ${colors.border.subtle}` }}>
                    <td style={{ padding: spacing.scale[2] }}><strong>Next.js Data Cache</strong></td>
                    <td style={{ padding: spacing.scale[2] }}>サーバー側（ビルド/実行時）</td>
                    <td style={{ padding: spacing.scale[2] }}>無期限</td>
                    <td style={{ padding: spacing.scale[2] }}>revalidate、revalidatePath</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${colors.border.subtle}` }}>
                    <td style={{ padding: spacing.scale[2] }}><strong>Router Cache</strong></td>
                    <td style={{ padding: spacing.scale[2] }}>クライアント側（ブラウザのメモリ）</td>
                    <td style={{ padding: spacing.scale[2] }}>30秒〜5分</td>
                    <td style={{ padding: spacing.scale[2] }}>router.refresh()</td>
                  </tr>
                  <tr>
                    <td style={{ padding: spacing.scale[2] }}><strong>React Query Cache</strong></td>
                    <td style={{ padding: spacing.scale[2] }}>クライアント側（ブラウザのメモリ）</td>
                    <td style={{ padding: spacing.scale[2] }}>staleTime: 0, cacheTime: 5分</td>
                    <td style={{ padding: spacing.scale[2] }}>queryClient.invalidateQueries</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* まとめ */}
          <div style={{
            padding: spacing.scale[4],
            backgroundColor: colors.feedback.success.bg,
            borderRadius: radii.borderRadius.md,
            border: `1px solid ${colors.feedback.success.border}`
          }}>
            <h4 style={{
              fontSize: typography.body.base.fontSize,
              fontWeight: 600,
              marginBottom: spacing.scale[2],
              color: colors.feedback.success.text
            }}>
              💡 推奨アプローチ
            </h4>
            <ul style={{
              marginLeft: spacing.scale[6],
              lineHeight: typography.lineHeight.relaxed,
              color: colors.feedback.success.text
            }}>
              <li><strong>初期表示:</strong> Server Componentでデータ取得（Flight Payload経由で配信）</li>
              <li><strong>動的更新:</strong> Client Component + React Queryで必要な部分だけ更新</li>
              <li><strong>検索:</strong> SEO重要ならServer Component、リアルタイム性重視ならReact Query</li>
              <li><strong>キャッシュ:</strong> Next.jsのData Cacheは静的データ、React Queryは動的データ向け</li>
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
