import { colors, spacing, typography, radii } from "@/src/design-system/tokens";

export default function BuildVsTscPage() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: spacing.scale[8] }}>
      <h1 style={{
        marginBottom: spacing.scale[6],
        fontSize: typography.heading.h1.fontSize,
        fontWeight: typography.heading.h1.fontWeight,
        lineHeight: typography.heading.h1.lineHeight,
      }}>
        Build vs TSC
      </h1>

      <section style={{ marginBottom: spacing.scale[8] }}>
        <h2 style={{
          fontSize: typography.heading.h2.fontSize,
          fontWeight: typography.heading.h2.fontWeight,
          marginBottom: spacing.scale[4],
          color: colors.brand.primary,
        }}>
          npm run build (next build)
        </h2>
        <p style={{
          marginBottom: spacing.scale[4],
          lineHeight: typography.lineHeight.relaxed,
        }}>
          Next.js全体の本番ビルドを実行します。
        </p>
        <ul style={{
          marginLeft: spacing.scale[6],
          lineHeight: typography.lineHeight.relaxed,
          marginBottom: spacing.scale[4],
        }}>
          <li>TypeScriptの型チェック</li>
          <li>コンパイル（TS → JS）</li>
          <li>コードの最適化</li>
          <li>バンドリング</li>
          <li>静的サイト生成（SSG）</li>
          <li>画像最適化</li>
          <li>その他Next.js固有の処理</li>
        </ul>
        <div style={{
          padding: spacing.scale[4],
          backgroundColor: colors.background.subtle,
          borderRadius: radii.borderRadius.md,
          border: `1px solid ${colors.border.subtle}`,
        }}>
          <code>npm run build</code>
        </div>
      </section>

      <section style={{ marginBottom: spacing.scale[8] }}>
        <h2 style={{
          fontSize: typography.heading.h2.fontSize,
          fontWeight: typography.heading.h2.fontWeight,
          marginBottom: spacing.scale[4],
          color: colors.brand.primary,
        }}>
          tsc
        </h2>
        <p style={{
          marginBottom: spacing.scale[4],
          lineHeight: typography.lineHeight.relaxed,
        }}>
          TypeScriptコンパイラ単体での処理を実行します。
        </p>
        <ul style={{
          marginLeft: spacing.scale[6],
          lineHeight: typography.lineHeight.relaxed,
          marginBottom: spacing.scale[4],
        }}>
          <li>TypeScriptの型チェック</li>
          <li>コンパイル（TS → JS）</li>
        </ul>
        <div style={{
          padding: spacing.scale[4],
          backgroundColor: colors.background.subtle,
          borderRadius: radii.borderRadius.md,
          border: `1px solid ${colors.border.subtle}`,
        }}>
          <code>tsc</code>
        </div>
      </section>

      <section style={{ marginBottom: spacing.scale[8] }}>
        <h2 style={{
          fontSize: typography.heading.h2.fontSize,
          fontWeight: typography.heading.h2.fontWeight,
          marginBottom: spacing.scale[4],
          color: colors.brand.primary,
        }}>
          型チェックのみ
        </h2>
        <p style={{
          marginBottom: spacing.scale[4],
          lineHeight: typography.lineHeight.relaxed,
        }}>
          ファイルを出力せず、型チェックだけを行いたい場合:
        </p>
        <div style={{
          padding: spacing.scale[4],
          backgroundColor: colors.background.subtle,
          borderRadius: radii.borderRadius.md,
          border: `1px solid ${colors.border.subtle}`,
          marginBottom: spacing.scale[4],
        }}>
          <code>tsc --noEmit</code>
        </div>
        <p style={{
          fontSize: typography.body.small.fontSize,
          color: colors.text.secondary,
          lineHeight: typography.lineHeight.relaxed,
        }}>
          CIやpre-commitフックで使われることが多いです。
        </p>
      </section>

      <section style={{ marginBottom: spacing.scale[8] }}>
        <h2 style={{
          fontSize: typography.heading.h2.fontSize,
          fontWeight: typography.heading.h2.fontWeight,
          marginBottom: spacing.scale[4],
          color: colors.brand.primary,
        }}>
          コンパイルとは？
        </h2>

        <div style={{ marginBottom: spacing.scale[6] }}>
          <h3 style={{
            fontSize: typography.heading.h4.fontSize,
            fontWeight: typography.heading.h4.fontWeight,
            marginBottom: spacing.scale[3],
            color: colors.primitive.blue[600],
          }}>
            トランスパイル vs コンパイル
          </h3>
          <p style={{
            marginBottom: spacing.scale[3],
            lineHeight: typography.lineHeight.relaxed,
          }}>
            TypeScriptは厳密には「トランスパイラ」です。
          </p>
          <ul style={{
            marginLeft: spacing.scale[6],
            lineHeight: typography.lineHeight.relaxed,
            marginBottom: spacing.scale[4],
          }}>
            <li><strong>コンパイル:</strong> 高級言語 → 機械語（例: C → バイナリ）</li>
            <li><strong>トランスパイル:</strong> 高級言語 → 高級言語（例: TS → JS）</li>
          </ul>
          <p style={{
            fontSize: typography.body.small.fontSize,
            color: colors.text.secondary,
            lineHeight: typography.lineHeight.relaxed,
          }}>
            ただし、一般的に「TypeScriptをコンパイルする」という表現が使われます。
          </p>
        </div>

        <div style={{ marginBottom: spacing.scale[6] }}>
          <h3 style={{
            fontSize: typography.heading.h4.fontSize,
            fontWeight: typography.heading.h4.fontWeight,
            marginBottom: spacing.scale[3],
            color: colors.primitive.blue[600],
          }}>
            TypeScriptコンパイラ（tsc）が行うこと
          </h3>
          <div style={{
            padding: spacing.scale[4],
            backgroundColor: colors.background.subtle,
            borderRadius: radii.borderRadius.md,
            border: `1px solid ${colors.border.subtle}`,
            marginBottom: spacing.scale[4],
          }}>
            <ol style={{
              marginLeft: spacing.scale[6],
              lineHeight: typography.lineHeight.relaxed,
            }}>
              <li style={{ marginBottom: spacing.scale[3] }}>
                <strong>型チェック</strong>
                <p style={{ color: colors.text.secondary, marginTop: spacing.scale[1] }}>
                  型の整合性を検証し、エラーを報告
                </p>
              </li>
              <li style={{ marginBottom: spacing.scale[3] }}>
                <strong>型情報の削除</strong>
                <p style={{ color: colors.text.secondary, marginTop: spacing.scale[1] }}>
                  TypeScript固有の型アノテーションを削除
                </p>
              </li>
              <li>
                <strong>ダウンパイル</strong>
                <p style={{ color: colors.text.secondary, marginTop: spacing.scale[1] }}>
                  新しいJavaScriptの構文を古いバージョンのJSに変換（tsconfig.jsonのtargetに基づく）
                </p>
              </li>
            </ol>
          </div>
        </div>

        <div style={{ marginBottom: spacing.scale[6] }}>
          <h3 style={{
            fontSize: typography.heading.h4.fontSize,
            fontWeight: typography.heading.h4.fontWeight,
            marginBottom: spacing.scale[3],
            color: colors.primitive.blue[600],
          }}>
            Next.jsで使われるコンパイラ
          </h3>
          <p style={{
            marginBottom: spacing.scale[3],
            lineHeight: typography.lineHeight.relaxed,
          }}>
            Next.js 12以降は<strong>SWC（Speedy Web Compiler）</strong>を使用しています。
          </p>
          <div style={{
            padding: spacing.scale[4],
            backgroundColor: colors.feedback.success.bg,
            borderRadius: radii.borderRadius.md,
            border: `1px solid ${colors.feedback.success.border}`,
            marginBottom: spacing.scale[4],
          }}>
            <p style={{
              fontWeight: 600,
              marginBottom: spacing.scale[2],
              color: colors.feedback.success.text,
            }}>
              なぜSWC？
            </p>
            <ul style={{
              marginLeft: spacing.scale[6],
              lineHeight: typography.lineHeight.relaxed,
            }}>
              <li>Rustで書かれており、tscより約20倍高速</li>
              <li>型チェックはtscで行い、コンパイルはSWCで行う</li>
              <li>next buildでは両方が実行される</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 style={{
            fontSize: typography.heading.h4.fontSize,
            fontWeight: typography.heading.h4.fontWeight,
            marginBottom: spacing.scale[3],
            color: colors.primitive.blue[600],
          }}>
            tsconfig.jsonの役割
          </h3>
          <p style={{
            marginBottom: spacing.scale[3],
            lineHeight: typography.lineHeight.relaxed,
          }}>
            TypeScriptコンパイラの設定ファイル。主な設定項目:
          </p>
          <ul style={{
            marginLeft: spacing.scale[6],
            lineHeight: typography.lineHeight.relaxed,
          }}>
            <li><code>target</code>: 出力するJavaScriptのバージョン（ES5, ES2015, ES2020など）</li>
            <li><code>module</code>: モジュールシステム（CommonJS, ESModuleなど）</li>
            <li><code>strict</code>: 厳格な型チェックを有効化</li>
            <li><code>jsx</code>: JSX/TSXの変換方法</li>
            <li><code>lib</code>: 利用可能なライブラリの型定義</li>
          </ul>
        </div>
      </section>

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
          backgroundColor: colors.feedback.info.bg,
          borderRadius: radii.borderRadius.md,
          border: `1px solid ${colors.feedback.info.border}`,
        }}>
          <p style={{
            marginBottom: spacing.scale[2],
            lineHeight: typography.lineHeight.relaxed,
          }}>
            <strong>next build:</strong> Next.jsアプリケーション全体の本番ビルド（型チェックを含む全工程）
          </p>
          <p style={{
            marginBottom: spacing.scale[2],
            lineHeight: typography.lineHeight.relaxed,
          }}>
            <strong>tsc:</strong> TypeScriptの型チェック・コンパイルのみ
          </p>
          <p style={{
            lineHeight: typography.lineHeight.relaxed,
          }}>
            <strong>tsc --noEmit:</strong> 型チェックのみ（ファイル出力なし）
          </p>
        </div>
      </section>
    </div>
  );
}
