import { colors, spacing, typography, radii } from "@/src/design-system/tokens";

export default function BuildVsTscPage() {
  return (
    <div
      style={{ maxWidth: "900px", margin: "0 auto", padding: spacing.scale[8] }}
    >
      <h1
        style={{
          marginBottom: spacing.scale[6],
          fontSize: typography.heading.h1.fontSize,
          fontWeight: typography.heading.h1.fontWeight,
          lineHeight: typography.heading.h1.lineHeight,
        }}
      >
        Build vs TSC
      </h1>

      <section style={{ marginBottom: spacing.scale[8] }}>
        <h2
          style={{
            fontSize: typography.heading.h2.fontSize,
            fontWeight: typography.heading.h2.fontWeight,
            marginBottom: spacing.scale[4],
            color: colors.brand.primary,
          }}
        >
          npm run build (next build)
        </h2>
        <p
          style={{
            marginBottom: spacing.scale[4],
            lineHeight: typography.lineHeight.relaxed,
          }}
        >
          Next.js全体の本番ビルドを実行します。
        </p>
        <ul
          style={{
            marginLeft: spacing.scale[6],
            lineHeight: typography.lineHeight.relaxed,
            marginBottom: spacing.scale[4],
          }}
        >
          <li>TypeScriptの型チェック</li>
          <li>コンパイル（TS → JS）</li>
          <li>コードの最適化</li>
          <li>バンドリング</li>
          <li>静的サイト生成（SSG）</li>
          <li>画像最適化</li>
          <li>その他Next.js固有の処理</li>
        </ul>
        <div
          style={{
            padding: spacing.scale[4],
            backgroundColor: colors.background.subtle,
            borderRadius: radii.borderRadius.md,
            border: `1px solid ${colors.border.subtle}`,
          }}
        >
          <code>npm run build</code>
        </div>
      </section>

      <section style={{ marginBottom: spacing.scale[8] }}>
        <h2
          style={{
            fontSize: typography.heading.h2.fontSize,
            fontWeight: typography.heading.h2.fontWeight,
            marginBottom: spacing.scale[4],
            color: colors.brand.primary,
          }}
        >
          tsc
        </h2>
        <p
          style={{
            marginBottom: spacing.scale[4],
            lineHeight: typography.lineHeight.relaxed,
          }}
        >
          TypeScriptコンパイラ単体での処理を実行します。
        </p>
        <ul
          style={{
            marginLeft: spacing.scale[6],
            lineHeight: typography.lineHeight.relaxed,
            marginBottom: spacing.scale[4],
          }}
        >
          <li>TypeScriptの型チェック</li>
          <li>コンパイル（TS → JS）</li>
          <li><strong>JSファイルを出力</strong>（tsconfig.jsonのoutDirで指定した場所に）</li>
        </ul>
        <div
          style={{
            padding: spacing.scale[4],
            backgroundColor: colors.background.subtle,
            borderRadius: radii.borderRadius.md,
            border: `1px solid ${colors.border.subtle}`,
            marginBottom: spacing.scale[4],
          }}
        >
          <code>tsc</code>
        </div>
        <p
          style={{
            fontSize: typography.body.small.fontSize,
            color: colors.text.secondary,
            lineHeight: typography.lineHeight.relaxed,
          }}
        >
          注: Next.jsプロジェクトでは通常tscを直接使わず、next buildやnext devを使用します。
          tscで出力されたファイルはNext.jsでは使用されません。
        </p>
      </section>

      <section style={{ marginBottom: spacing.scale[8] }}>
        <h2
          style={{
            fontSize: typography.heading.h2.fontSize,
            fontWeight: typography.heading.h2.fontWeight,
            marginBottom: spacing.scale[4],
            color: colors.brand.primary,
          }}
        >
          型チェックのみ
        </h2>
        <p
          style={{
            marginBottom: spacing.scale[4],
            lineHeight: typography.lineHeight.relaxed,
          }}
        >
          ファイルを出力せず、型チェックだけを行いたい場合:
        </p>
        <div
          style={{
            padding: spacing.scale[4],
            backgroundColor: colors.background.subtle,
            borderRadius: radii.borderRadius.md,
            border: `1px solid ${colors.border.subtle}`,
            marginBottom: spacing.scale[4],
          }}
        >
          <code>tsc --noEmit</code>
        </div>
        <p
          style={{
            fontSize: typography.body.small.fontSize,
            color: colors.text.secondary,
            lineHeight: typography.lineHeight.relaxed,
          }}
        >
          CIやpre-commitフックで使われることが多いです。
        </p>
      </section>

      <section style={{ marginBottom: spacing.scale[8] }}>
        <h2
          style={{
            fontSize: typography.heading.h2.fontSize,
            fontWeight: typography.heading.h2.fontWeight,
            marginBottom: spacing.scale[4],
            color: colors.brand.primary,
          }}
        >
          コンパイルとは？
        </h2>

        <div style={{ marginBottom: spacing.scale[6] }}>
          <h3
            style={{
              fontSize: typography.heading.h4.fontSize,
              fontWeight: typography.heading.h4.fontWeight,
              marginBottom: spacing.scale[3],
              color: colors.primitive.blue[600],
            }}
          >
            トランスパイル vs コンパイル
          </h3>
          <p
            style={{
              marginBottom: spacing.scale[3],
              lineHeight: typography.lineHeight.relaxed,
            }}
          >
            TypeScriptは厳密には「トランスパイラ」です。
          </p>
          <ul
            style={{
              marginLeft: spacing.scale[6],
              lineHeight: typography.lineHeight.relaxed,
              marginBottom: spacing.scale[4],
            }}
          >
            <li>
              <strong>コンパイル:</strong> 高級言語 → 機械語（例: C → バイナリ）
            </li>
            <li>
              <strong>トランスパイル:</strong> 高級言語 → 高級言語（例: TS →
              JS）
            </li>
          </ul>
          <p
            style={{
              fontSize: typography.body.small.fontSize,
              color: colors.text.secondary,
              lineHeight: typography.lineHeight.relaxed,
            }}
          >
            ただし、一般的に「TypeScriptをコンパイルする」という表現が使われます。
          </p>
        </div>

        <div style={{ marginBottom: spacing.scale[6] }}>
          <h3
            style={{
              fontSize: typography.heading.h4.fontSize,
              fontWeight: typography.heading.h4.fontWeight,
              marginBottom: spacing.scale[3],
              color: colors.primitive.blue[600],
            }}
          >
            TypeScriptコンパイラ（tsc）が行うこと
          </h3>
          <div
            style={{
              padding: spacing.scale[4],
              backgroundColor: colors.background.subtle,
              borderRadius: radii.borderRadius.md,
              border: `1px solid ${colors.border.subtle}`,
              marginBottom: spacing.scale[4],
            }}
          >
            <ol
              style={{
                marginLeft: spacing.scale[6],
                lineHeight: typography.lineHeight.relaxed,
              }}
            >
              <li style={{ marginBottom: spacing.scale[3] }}>
                <strong>型チェック</strong>
                <p
                  style={{
                    color: colors.text.secondary,
                    marginTop: spacing.scale[1],
                  }}
                >
                  型の整合性を検証し、エラーを報告
                </p>
              </li>
              <li style={{ marginBottom: spacing.scale[3] }}>
                <strong>型情報の削除</strong>
                <p
                  style={{
                    color: colors.text.secondary,
                    marginTop: spacing.scale[1],
                  }}
                >
                  TypeScript固有の型アノテーションを削除
                </p>
              </li>
              <li>
                <strong>ダウンパイル</strong>
                <p
                  style={{
                    color: colors.text.secondary,
                    marginTop: spacing.scale[1],
                  }}
                >
                  新しいJavaScriptの構文を古いバージョンのJSに変換（tsconfig.jsonのtargetに基づく）
                </p>
              </li>
            </ol>
          </div>
        </div>

        <div style={{ marginBottom: spacing.scale[6] }}>
          <h3
            style={{
              fontSize: typography.heading.h4.fontSize,
              fontWeight: typography.heading.h4.fontWeight,
              marginBottom: spacing.scale[3],
              color: colors.primitive.blue[600],
            }}
          >
            Next.jsで使われるコンパイラ
          </h3>
          <p
            style={{
              marginBottom: spacing.scale[3],
              lineHeight: typography.lineHeight.relaxed,
            }}
          >
            Next.js 12以降は<strong>SWC（Speedy Web Compiler）</strong>
            を使用しています。
          </p>
          <div
            style={{
              padding: spacing.scale[4],
              backgroundColor: colors.feedback.success.bg,
              borderRadius: radii.borderRadius.md,
              border: `1px solid ${colors.feedback.success.border}`,
              marginBottom: spacing.scale[4],
            }}
          >
            <p
              style={{
                fontWeight: 600,
                marginBottom: spacing.scale[2],
                color: colors.feedback.success.text,
              }}
            >
              なぜSWC？
            </p>
            <ul
              style={{
                marginLeft: spacing.scale[6],
                lineHeight: typography.lineHeight.relaxed,
              }}
            >
              <li>Rustで書かれており、tscより約20倍高速</li>
              <li>型チェックはtscで行い、コンパイルはSWCで行う</li>
              <li>next buildでは両方が実行される</li>
            </ul>
          </div>
        </div>

        <div>
          <h3
            style={{
              fontSize: typography.heading.h4.fontSize,
              fontWeight: typography.heading.h4.fontWeight,
              marginBottom: spacing.scale[3],
              color: colors.primitive.blue[600],
            }}
          >
            tsconfig.jsonの役割
          </h3>
          <p
            style={{
              marginBottom: spacing.scale[3],
              lineHeight: typography.lineHeight.relaxed,
            }}
          >
            TypeScriptコンパイラの設定ファイル。主な設定項目:
          </p>
          <ul
            style={{
              marginLeft: spacing.scale[6],
              lineHeight: typography.lineHeight.relaxed,
            }}
          >
            <li>
              <code>target</code>: 出力するJavaScriptのバージョン（ES5, ES2015,
              ES2020など）
            </li>
            <li>
              <code>module</code>: モジュールシステム（CommonJS, ESModuleなど）
            </li>
            <li>
              <code>strict</code>: 厳格な型チェックを有効化
            </li>
            <li>
              <code>jsx</code>: JSX/TSXの変換方法
            </li>
            <li>
              <code>lib</code>: 利用可能なライブラリの型定義
            </li>
          </ul>
        </div>
      </section>

      <section style={{ marginBottom: spacing.scale[8] }}>
        <h2
          style={{
            fontSize: typography.heading.h2.fontSize,
            fontWeight: typography.heading.h2.fontWeight,
            marginBottom: spacing.scale[4],
            color: colors.brand.primary,
          }}
        >
          エラーの種類
        </h2>

        <div
          style={{
            display: "grid",
            gap: spacing.scale[4],
          }}
        >
          <div
            style={{
              padding: spacing.scale[5],
              backgroundColor: colors.feedback.error.bg,
              borderRadius: radii.borderRadius.md,
              border: `1px solid ${colors.feedback.error.border}`,
            }}
          >
            <h3
              style={{
                fontSize: typography.heading.h4.fontSize,
                fontWeight: typography.heading.h4.fontWeight,
                marginBottom: spacing.scale[3],
                color: colors.feedback.error.text,
              }}
            >
              型エラー（Type Error）
            </h3>
            <p
              style={{
                marginBottom: spacing.scale[3],
                lineHeight: typography.lineHeight.relaxed,
              }}
            >
              TypeScriptの型チェックで検出されるエラー。コンパイル前の静的解析で発見される。
            </p>
            <div
              style={{
                padding: spacing.scale[3],
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                borderRadius: radii.borderRadius.sm,
                marginBottom: spacing.scale[3],
              }}
            >
              <code style={{ fontSize: typography.body.small.fontSize }}>
                Type &apos;string&apos; is not assignable to type
                &apos;number&apos;
              </code>
            </div>
            <ul
              style={{
                marginLeft: spacing.scale[6],
                lineHeight: typography.lineHeight.relaxed,
              }}
            >
              <li>
                <strong>検出:</strong> tsc、エディタ（VSCode）、next build
              </li>
              <li>
                <strong>タイミング:</strong> 開発時・ビルド時
              </li>
              <li>
                <strong>実行への影響:</strong>{" "}
                JSに変換されれば実行可能（--noEmitOnErrorなしの場合）
              </li>
            </ul>
          </div>

          <div
            style={{
              padding: spacing.scale[5],
              backgroundColor: colors.feedback.warning.bg,
              borderRadius: radii.borderRadius.md,
              border: `1px solid ${colors.feedback.warning.border}`,
            }}
          >
            <h3
              style={{
                fontSize: typography.heading.h4.fontSize,
                fontWeight: typography.heading.h4.fontWeight,
                marginBottom: spacing.scale[3],
                color: colors.feedback.warning.text,
              }}
            >
              コンパイルエラー（Compile Error）
            </h3>
            <p
              style={{
                marginBottom: spacing.scale[3],
                lineHeight: typography.lineHeight.relaxed,
              }}
            >
              TS → JS への変換処理で発生するエラー。構文エラーや設定ミスが原因。
            </p>
            <div
              style={{
                padding: spacing.scale[3],
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                borderRadius: radii.borderRadius.sm,
                marginBottom: spacing.scale[3],
              }}
            >
              <code style={{ fontSize: typography.body.small.fontSize }}>
                Unexpected token, expected &quot;;&quot;
              </code>
            </div>
            <ul
              style={{
                marginLeft: spacing.scale[6],
                lineHeight: typography.lineHeight.relaxed,
              }}
            >
              <li>
                <strong>検出:</strong> tsc、SWC、Babel
              </li>
              <li>
                <strong>タイミング:</strong> コンパイル時
              </li>
              <li>
                <strong>実行への影響:</strong> JSが生成されないため実行不可
              </li>
            </ul>
          </div>

          <div
            style={{
              padding: spacing.scale[5],
              backgroundColor: colors.primitive.red[50],
              borderRadius: radii.borderRadius.md,
              border: `1px solid ${colors.primitive.red[200]}`,
            }}
          >
            <h3
              style={{
                fontSize: typography.heading.h4.fontSize,
                fontWeight: typography.heading.h4.fontWeight,
                marginBottom: spacing.scale[3],
                color: colors.primitive.red[700],
              }}
            >
              ビルドエラー（Build Error）
            </h3>
            <p
              style={{
                marginBottom: spacing.scale[3],
                lineHeight: typography.lineHeight.relaxed,
              }}
            >
              Next.jsのビルドプロセス全体で発生するエラー。型エラー、コンパイルエラー、その他の問題を含む。
            </p>
            <div
              style={{
                padding: spacing.scale[3],
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                borderRadius: radii.borderRadius.sm,
                marginBottom: spacing.scale[3],
              }}
            >
              <code style={{ fontSize: typography.body.small.fontSize }}>
                Module not found: Can&apos;t resolve &apos;./component&apos;
              </code>
            </div>
            <ul
              style={{
                marginLeft: spacing.scale[6],
                lineHeight: typography.lineHeight.relaxed,
              }}
            >
              <li>
                <strong>検出:</strong> next build
              </li>
              <li>
                <strong>タイミング:</strong> ビルド時
              </li>
              <li>
                <strong>含まれるエラー:</strong>{" "}
                型エラー、コンパイルエラー、依存関係エラー、ページ生成エラーなど
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{
            marginTop: spacing.scale[6],
            padding: spacing.scale[5],
            backgroundColor: colors.background.subtle,
            borderRadius: radii.borderRadius.md,
            border: `1px solid ${colors.border.subtle}`,
          }}
        >
          <h3
            style={{
              fontSize: typography.heading.h4.fontSize,
              fontWeight: typography.heading.h4.fontWeight,
              marginBottom: spacing.scale[3],
            }}
          >
            開発時のチェックフロー
          </h3>
          <ol
            style={{
              marginLeft: spacing.scale[6],
              lineHeight: typography.lineHeight.relaxed,
            }}
          >
            <li>
              <strong>エディタ:</strong> リアルタイムで型エラーを表示（VSCode +
              TypeScript Language Server）
            </li>
            <li>
              <strong>npm run dev:</strong>{" "}
              開発サーバー起動（型チェックはデフォルトでスキップ、高速化のため）
            </li>
            <li>
              <strong>tsc --noEmit:</strong>{" "}
              コミット前に全体の型チェック（pre-commit hookで自動化推奨）
            </li>
            <li>
              <strong>npm run build:</strong>{" "}
              本番ビルド前の最終確認（CI/CDで実行）
            </li>
          </ol>
        </div>
      </section>

      <section style={{ marginBottom: spacing.scale[8] }}>
        <h2
          style={{
            fontSize: typography.heading.h2.fontSize,
            fontWeight: typography.heading.h2.fontWeight,
            marginBottom: spacing.scale[4],
            color: colors.brand.primary,
          }}
        >
          エラーの優先度と対処法
        </h2>

        <div
          style={{
            padding: spacing.scale[5],
            backgroundColor: colors.primitive.pink[50],
            borderRadius: radii.borderRadius.md,
            border: `1px solid ${colors.primitive.pink[200]}`,
            marginBottom: spacing.scale[6],
          }}
        >
          <h3
            style={{
              fontSize: typography.heading.h4.fontSize,
              fontWeight: typography.heading.h4.fontWeight,
              marginBottom: spacing.scale[4],
              color: colors.primitive.pink[800],
            }}
          >
            修正すべき優先度
          </h3>
          <ol
            style={{
              marginLeft: spacing.scale[6],
              lineHeight: typography.lineHeight.relaxed,
              counterReset: "priority",
            }}
          >
            <li style={{ marginBottom: spacing.scale[4] }}>
              <strong style={{ color: colors.primitive.red[700] }}>
                コンパイルエラー
              </strong>
              <p
                style={{
                  color: colors.text.secondary,
                  marginTop: spacing.scale[1],
                }}
              >
                最優先。これがあるとJSが生成されず、アプリが動かない。
              </p>
            </li>
            <li style={{ marginBottom: spacing.scale[4] }}>
              <strong style={{ color: colors.primitive.orange[700] }}>
                型エラー
              </strong>
              <p
                style={{
                  color: colors.text.secondary,
                  marginTop: spacing.scale[1],
                }}
              >
                2番目。実行は可能だが、潜在的なバグの温床。CI/CDでブロックすべき。
              </p>
            </li>
            <li>
              <strong style={{ color: colors.primitive.orange[800] }}>
                ランタイムエラー
              </strong>
              <p
                style={{
                  color: colors.text.secondary,
                  marginTop: spacing.scale[1],
                }}
              >
                型チェックでは検出できないが、実行時に発生。エラーバウンダリーやモニタリングで対処。
              </p>
            </li>
          </ol>
        </div>

        <div
          style={{
            padding: spacing.scale[5],
            backgroundColor: colors.feedback.info.bg,
            borderRadius: radii.borderRadius.md,
            border: `1px solid ${colors.feedback.info.border}`,
            marginBottom: spacing.scale[6],
          }}
        >
          <h3
            style={{
              fontSize: typography.heading.h4.fontSize,
              fontWeight: typography.heading.h4.fontWeight,
              marginBottom: spacing.scale[4],
              color: colors.feedback.info.text,
            }}
          >
            ランタイムエラーの捕捉
          </h3>

          <div style={{ marginBottom: spacing.scale[4] }}>
            <h4
              style={{
                fontSize: typography.body.base.fontSize,
                fontWeight: 600,
                marginBottom: spacing.scale[2],
              }}
            >
              エラーバウンダリーで拾えるエラー
            </h4>
            <ul
              style={{
                marginLeft: spacing.scale[6],
                lineHeight: typography.lineHeight.relaxed,
                marginBottom: spacing.scale[3],
              }}
            >
              <li>コンポーネントのレンダリング中のエラー</li>
              <li>ライフサイクルメソッド内のエラー</li>
              <li>コンストラクタ内のエラー</li>
            </ul>
            <div
              style={{
                padding: spacing.scale[3],
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                borderRadius: radii.borderRadius.sm,
                fontSize: typography.body.small.fontSize,
              }}
            >
              <code>throw new Error(&quot;Something went wrong&quot;)</code>
            </div>
          </div>

          <div>
            <h4
              style={{
                fontSize: typography.body.base.fontSize,
                fontWeight: 600,
                marginBottom: spacing.scale[2],
              }}
            >
              エラーバウンダリーで拾えないエラー
            </h4>
            <ul
              style={{
                marginLeft: spacing.scale[6],
                lineHeight: typography.lineHeight.relaxed,
                marginBottom: spacing.scale[3],
              }}
            >
              <li>イベントハンドラ内のエラー（try-catchで対処）</li>
              <li>非同期コード（setTimeout、Promise）</li>
              <li>サーバーサイドレンダリング中のエラー</li>
              <li>エラーバウンダリー自身のエラー</li>
            </ul>
            <div
              style={{
                padding: spacing.scale[3],
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                borderRadius: radii.borderRadius.sm,
                fontSize: typography.body.small.fontSize,
              }}
            >
              <code>
                onClick=&#123;() =&gt; throw new Error()&#125; // 拾えない
              </code>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: spacing.scale[5],
            backgroundColor: colors.primitive.green[50],
            borderRadius: radii.borderRadius.md,
            border: `1px solid ${colors.primitive.green[200]}`,
          }}
        >
          <h3
            style={{
              fontSize: typography.heading.h4.fontSize,
              fontWeight: typography.heading.h4.fontWeight,
              marginBottom: spacing.scale[4],
              color: colors.primitive.green[800],
            }}
          >
            AI開発との相性
          </h3>

          <div style={{ marginBottom: spacing.scale[4] }}>
            <h4
              style={{
                fontSize: typography.body.base.fontSize,
                fontWeight: 600,
                marginBottom: spacing.scale[2],
                color: colors.primitive.green[700],
              }}
            >
              ✅ AIが得意なエラー
            </h4>
            <ul
              style={{
                marginLeft: spacing.scale[6],
                lineHeight: typography.lineHeight.relaxed,
              }}
            >
              <li>
                <strong>型エラー:</strong>{" "}
                エラーメッセージから修正箇所を特定しやすい
              </li>
              <li>
                <strong>コンパイルエラー:</strong>{" "}
                構文ミスなので機械的に修正可能
              </li>
              <li>
                <strong>リファクタリング:</strong> 型システムが保証するため安全
              </li>
            </ul>
          </div>

          <div style={{ marginBottom: spacing.scale[4] }}>
            <h4
              style={{
                fontSize: typography.body.base.fontSize,
                fontWeight: 600,
                marginBottom: spacing.scale[2],
                color: colors.primitive.orange[700],
              }}
            >
              ⚠️ AIが苦手なエラー
            </h4>
            <ul
              style={{
                marginLeft: spacing.scale[6],
                lineHeight: typography.lineHeight.relaxed,
              }}
            >
              <li>
                <strong>ランタイムエラー:</strong> 実行時の文脈やユーザー操作に依存、再現手順が必要
              </li>
              <li>
                <strong>ビジネスロジックのバグ:</strong> ドメイン知識と文脈理解が必要
              </li>
              <li>
                <strong>パフォーマンス問題:</strong> プロファイリングと計測が必要
              </li>
              <li>
                <strong>UI/UXの問題:</strong> 主観的判断とユーザー視点が必要
              </li>
            </ul>
          </div>

          <div
            style={{
              padding: spacing.scale[4],
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: radii.borderRadius.sm,
            }}
          >
            <p
              style={{
                fontSize: typography.body.small.fontSize,
                lineHeight: typography.lineHeight.relaxed,
                margin: 0,
              }}
            >
              <strong>💡 ベストプラクティス:</strong>{" "}
              AIに型エラーを修正させながら、
              ビジネスロジックは人間がレビューする分業が効率的。 tsc --noEmit
              をCI/CDに組み込み、型安全性を担保しつつAI開発を加速させる。
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2
          style={{
            fontSize: typography.heading.h2.fontSize,
            fontWeight: typography.heading.h2.fontWeight,
            marginBottom: spacing.scale[4],
            color: colors.brand.primary,
          }}
        >
          まとめ
        </h2>
        <div
          style={{
            padding: spacing.scale[6],
            backgroundColor: colors.feedback.info.bg,
            borderRadius: radii.borderRadius.md,
            border: `1px solid ${colors.feedback.info.border}`,
          }}
        >
          <p
            style={{
              marginBottom: spacing.scale[2],
              lineHeight: typography.lineHeight.relaxed,
            }}
          >
            <strong>next build:</strong>{" "}
            Next.jsアプリケーション全体の本番ビルド（型チェックを含む全工程）
          </p>
          <p
            style={{
              marginBottom: spacing.scale[2],
              lineHeight: typography.lineHeight.relaxed,
            }}
          >
            <strong>tsc:</strong> TypeScriptの型チェック・コンパイルのみ
          </p>
          <p
            style={{
              lineHeight: typography.lineHeight.relaxed,
            }}
          >
            <strong>tsc --noEmit:</strong> 型チェックのみ（ファイル出力なし）
          </p>
        </div>
      </section>
    </div>
  );
}
