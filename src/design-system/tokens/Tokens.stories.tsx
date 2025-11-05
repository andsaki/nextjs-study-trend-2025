import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { colors, typography, spacing, shadows, radii, transitions } from './index';

/**
 * デザイントークンの可視化
 *
 * このストーリーではデザインシステムで使用する全てのトークンを
 * 視覚的に確認できます。
 */
const meta = {
  title: 'Design System/Tokens',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * カラーパレット
 *
 * プリミティブカラー（基礎色）の一覧です。
 *
 * ## 3層構造
 * デザイントークンは以下の3層で管理されています：
 * 1. **プリミティブトークン**: 基礎となる色の値（#2196f3 など）
 * 2. **セマンティックトークン**: 意味を持った名前（brand.primary など）
 * 3. **コンポーネントトークン**: 用途特化の色（button.primary.bg など）
 *
 * ## WCAG準拠
 * すべてのテキストカラーは白背景に対して **WCAG AA基準（4.5:1以上）** のコントラスト比を確保しています。
 *
 * ## 使い分けガイド
 * - **Gray 50-200**: 背景、微妙な区切り
 * - **Gray 300-400**: ボーダー、プレースホルダー
 * - **Gray 500-600**: 補助的なテキスト
 * - **Gray 700-900**: 主要なテキスト（AA準拠）
 * - **Blue**: プライマリカラー（ボタン、リンク）
 * - **Red**: エラー、警告
 * - **Green**: 成功、完了
 * - **Orange**: 注意喚起
 */
export const Colors: Story = {
  render: () => (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ marginBottom: '24px' }}>カラートークン</h2>

      <div style={{
        padding: '16px',
        backgroundColor: '#f0f9ff',
        borderLeft: '4px solid #2196f3',
        marginBottom: '32px',
        borderRadius: '4px',
      }}>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
          <strong>💡 ヒント:</strong> 各色にはコントラスト比が明記されています。<br />
          WCAG AA準拠（4.5:1以上）の色は、白背景のテキストとして安全に使用できます。
        </p>
      </div>

      {/* Gray */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Gray</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Object.entries(colors.primitive.gray).map(([key, value]) => (
            <div key={key} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: value,
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                }}
              />
              <div style={{ marginTop: '8px', fontSize: '12px' }}>
                <div style={{ fontWeight: 600 }}>{key}</div>
                <div style={{ color: '#666' }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blue */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Blue (Primary)</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Object.entries(colors.primitive.blue).map(([key, value]) => (
            <div key={key} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: value,
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                }}
              />
              <div style={{ marginTop: '8px', fontSize: '12px' }}>
                <div style={{ fontWeight: 600 }}>{key}</div>
                <div style={{ color: '#666' }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Red */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Red (Error)</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Object.entries(colors.primitive.red).map(([key, value]) => (
            <div key={key} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: value,
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                }}
              />
              <div style={{ marginTop: '8px', fontSize: '12px' }}>
                <div style={{ fontWeight: 600 }}>{key}</div>
                <div style={{ color: '#666' }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Green */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Green (Success)</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Object.entries(colors.primitive.green).map(([key, value]) => (
            <div key={key} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: value,
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                }}
              />
              <div style={{ marginTop: '8px', fontSize: '12px' }}>
                <div style={{ fontWeight: 600 }}>{key}</div>
                <div style={{ color: '#666' }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Orange */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Orange (Warning)</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Object.entries(colors.primitive.orange).map(([key, value]) => (
            <div key={key} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: value,
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                }}
              />
              <div style={{ marginTop: '8px', fontSize: '12px' }}>
                <div style={{ fontWeight: 600 }}>{key}</div>
                <div style={{ color: '#666' }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

/**
 * タイポグラフィスケール
 *
 * フォント、文字サイズ、行高などの文字組みに関する定義です。
 *
 * ## なぜrem単位？
 * rem単位を使用することで、ユーザーのブラウザ設定（文字サイズ）を尊重し、アクセシビリティを向上させます。
 * - 1rem = 16px（ブラウザのデフォルト）
 * - ユーザーが200%に設定 → 1rem = 32px に自動調整
 *
 * ## 最小サイズ
 * - **xs (12px)** が最小サイズ
 * - これ以下は視認性が低下し、WCAG違反の可能性があります
 *
 * ## 行高（Line Height）
 * WCAG 2.1では、本文の行高は **最低1.5以上** を推奨しています。
 * - **tight (1.25)**: 大見出し（48px以上）
 * - **snug (1.375)**: 中見出し（24px-48px）
 * - **normal (1.5)**: 本文（最重要）
 * - **relaxed/loose**: 読みやすさ重視の長文
 *
 * ## フォントファミリー
 * システムフォントを優先し、高速な読み込みとネイティブな見た目を実現：
 * - iOS/macOS: -apple-system
 * - Windows: Segoe UI
 * - Android: Roboto
 * - 日本語: Noto Sans JP
 */
export const Typography: Story = {
  render: () => (
    <div style={{ fontFamily: typography.fontFamily.base }}>
      <h2 style={{ marginBottom: '24px' }}>タイポグラフィトークン</h2>

      <div style={{
        padding: '16px',
        backgroundColor: '#fef3c7',
        borderLeft: '4px solid #f59e0b',
        marginBottom: '32px',
        borderRadius: '4px',
      }}>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
          <strong>⚠️ 注意:</strong> 本文には必ず <code>base (16px)</code> 以上を使用してください。<br />
          <code>xs/sm</code> は補助的な情報（キャプション、注釈）のみに使用します。
        </p>
      </div>

      {/* Font Sizes */}
      <div style={{ marginBottom: '48px' }}>
        <h3 style={{ marginBottom: '16px' }}>フォントサイズスケール</h3>
        {Object.entries(typography.fontSize).map(([key, value]) => (
          <div
            key={key}
            style={{
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'baseline',
              gap: '16px',
            }}
          >
            <div style={{ fontSize: value }}>
              The quick brown fox jumps over the lazy dog
            </div>
            <div style={{ fontSize: '12px', color: '#666', minWidth: '100px' }}>
              {key}: {value}
            </div>
          </div>
        ))}
      </div>

      {/* Font Weights */}
      <div style={{ marginBottom: '48px' }}>
        <h3 style={{ marginBottom: '16px' }}>フォントウェイト</h3>
        {Object.entries(typography.fontWeight).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '12px' }}>
            <span style={{ fontWeight: value, fontSize: '18px' }}>
              The quick brown fox jumps over the lazy dog
            </span>
            <span style={{ marginLeft: '16px', fontSize: '12px', color: '#666' }}>
              {key}: {value}
            </span>
          </div>
        ))}
      </div>

      {/* Heading Presets */}
      <div>
        <h3 style={{ marginBottom: '16px' }}>見出しプリセット</h3>
        {Object.entries(typography.heading).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '16px' }}>
            <div
              style={{
                fontSize: value.fontSize,
                fontWeight: value.fontWeight,
                lineHeight: value.lineHeight,
                letterSpacing: value.letterSpacing,
              }}
            >
              見出しサンプル ({key})
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              {value.fontSize} / {value.fontWeight} / {value.lineHeight}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

/**
 * スペーシングスケール
 *
 * マージン、パディング、ギャップなどの余白を定義します。
 *
 * ## 8pxグリッドシステム
 * すべてのスペーシングは **8pxの倍数** を基準としています。
 *
 * ### なぜ8px？
 * 1. **計算しやすい**: 8の倍数は2,4でも割り切れる
 * 2. **デザイナーとの共通言語**: Figma、Sketchなどのツールでも標準
 * 3. **レティナディスプレイ対応**: 8px = 4dp（デザインポイント）
 * 4. **業界標準**: Material Design、Ant Designなど主要システムが採用
 *
 * ## 使い分けの目安
 * - **0-2 (0-8px)**: アイコンとテキストの間隔、ボーダー内の余白
 * - **3-6 (12-24px)**: ボタン/インプットのパディング、カード内の余白
 * - **8-12 (32-48px)**: コンポーネント間の余白、セクション内の余白
 * - **16-24 (64-96px)**: セクション間の余白、ページレイアウト
 * - **32+ (128px+)**: 大きなレイアウト、ヒーローセクション
 *
 * ## 3つのスケール
 * - **scale**: 数値で指定（`scale[4]` = 16px）
 * - **semantic**: 用途で指定（`semantic.md` = 16px）
 * - **component**: コンポーネント固有（`button.paddingX.md` = 16px）
 */
export const Spacing: Story = {
  render: () => (
    <div>
      <h2 style={{ marginBottom: '24px' }}>スペーシングトークン</h2>

      <div style={{
        padding: '16px',
        backgroundColor: '#f0fdf4',
        borderLeft: '4px solid #22c55e',
        marginBottom: '32px',
        borderRadius: '4px',
      }}>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
          <strong>✅ ベストプラクティス:</strong> 基本的に8pxの倍数を使用してください。<br />
          例外的に4px（scale[1]）も用意していますが、できるだけ8px以上を使いましょう。
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {Object.entries(spacing.scale).map(([key, value]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ minWidth: '60px', fontSize: '14px', fontWeight: 600 }}>
              {key}
            </div>
            <div
              style={{
                width: value,
                height: '32px',
                backgroundColor: '#2196f3',
                borderRadius: '4px',
              }}
            />
            <div style={{ fontSize: '12px', color: '#666' }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  ),
};

/**
 * シャドウ（影）
 *
 * ボックスシャドウで要素の「高さ（エレベーション）」を表現します。
 *
 * ## エレベーション（Elevation）とは？
 * Material Designの概念で、UIの要素が「どれだけ浮いているか」を表現します。
 * - **影が濃い** = より前面に表示されている
 * - **影が薄い** = 背景に近い
 *
 * ## 使い分けガイド
 * - **none**: 影なし（フラットデザイン）
 * - **sm**: ボタン、カード（少し浮いている）
 * - **base/md**: ドロップダウン、ツールチップ（中程度）
 * - **lg**: モーダルダイアログ（前面）
 * - **xl/2xl**: 最重要な要素（最前面）
 * - **inner**: 内側の影（押し込まれた感じ）
 *
 * ## アクセシビリティの注意点
 * - **影だけに頼らない**: ボーダーや色でも区別をつける
 * - **ハイコントラストモード**: 影が消える場合があります
 *
 * ## フォーカスリング
 * キーボードナビゲーション時に、フォーカスされている要素を明確に示します。
 * WCAG 2.4.7（Focus Visible）に準拠するため、最低 **3pxの幅** が必要です。
 */
export const Shadows: Story = {
  render: () => (
    <div>
      <h2 style={{ marginBottom: '24px' }}>シャドウトークン</h2>

      <div style={{
        padding: '16px',
        backgroundColor: '#fef3c7',
        borderLeft: '4px solid #f59e0b',
        marginBottom: '32px',
        borderRadius: '4px',
      }}>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
          <strong>💡 使い方のヒント:</strong> ホバー時に影を濃くすることで、<br />
          要素が「浮き上がる」インタラクションを表現できます。
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {Object.entries(shadows.boxShadow).map(([key, value]) => (
          <div key={key} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '120px',
                height: '120px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: value,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              {key}
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
              shadow.{key}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

/**
 * ボーダー半径（角丸）
 *
 * 角の丸みでコンポーネントの印象を調整します。
 *
 * ## 使い分けガイド
 * - **none (0)**: シャープな印象、フォーマルなデザイン
 * - **sm/base (2-4px)**: ボタン、インプット（微妙な丸み）
 * - **md/lg (6-8px)**: カード、パネル（標準的な丸み）
 * - **xl/2xl (12-16px)**: モーダル、大きなコンテナ（柔らかい印象）
 * - **3xl (24px)**: 特に丸みを強調したいとき
 * - **full (9999px)**: バッジ、アバター（完全な円形）
 *
 * ## デザインの印象
 * - **角が丸い** → 親しみやすい、カジュアル、モダン
 * - **角が四角** → フォーマル、シャープ、プロフェッショナル
 *
 * ## ブランドの一貫性
 * プロダクト全体で統一した角丸の値を使うことで、デザインの一貫性が生まれます。
 */
export const BorderRadius: Story = {
  render: () => (
    <div>
      <h2 style={{ marginBottom: '24px' }}>ボーダー半径トークン</h2>

      <div style={{
        padding: '16px',
        backgroundColor: '#ede9fe',
        borderLeft: '4px solid #8b5cf6',
        marginBottom: '32px',
        borderRadius: '4px',
      }}>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
          <strong>🎨 デザインのヒント:</strong> ブランドの印象に合わせて選びましょう。<br />
          テックスタートアップなら <code>lg</code>、金融系なら <code>sm</code> がおすすめです。
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {Object.entries(radii.borderRadius).map(([key, value]) => (
          <div key={key} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#2196f3',
                borderRadius: value,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              {key}
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

/**
 * トランジション
 *
 * アニメーションのタイミング（デュレーション）と加速曲線（イージング）を定義します。
 *
 * ## デュレーション（持続時間）
 * - **fast (150ms)**: 即座のフィードバック（ホバー時の色変化など）
 * - **base (200ms)**: 標準的な速度（ほとんどの場合はこれを使用）
 * - **slow (300ms)**: 目立たせたいアニメーション
 * - **slower (500ms)**: 大きな変化、ページ遷移
 *
 * ## イージング（加速曲線）
 * - **linear**: 一定速度（あまり使わない、機械的な印象）
 * - **easeIn**: だんだん速く（終了時にスピードアップ）
 * - **easeOut**: だんだん遅く（開始時に速い）← **最も自然**
 * - **easeInOut**: 両端が遅い（滑らか）
 * - **smooth**: Material Design推奨の曲線
 *
 * ## 使い方のガイドライン
 * ### ✅ 推奨
 * - ホバー、フォーカス → **fast + easeOut**
 * - モーダルの表示 → **base + easeOut**
 * - ページ遷移 → **slow + easeInOut**
 *
 * ### ❌ 避けるべき
 * - 長すぎるアニメーション（500ms以上）
 * - linear（機械的で不自然）
 * - 重要なUI要素で遅いアニメーション
 *
 * ## アクセシビリティ
 * ユーザーが「視覚効果を減らす」設定をしている場合、
 * アニメーションを無効化する配慮が必要です：
 * ```css
 * @media (prefers-reduced-motion: reduce) {
 *   transition: none;
 * }
 * ```
 */
export const Transitions: Story = {
  render: () => {
    const [hoveredKey, setHoveredKey] = React.useState<string | null>(null);

    return (
      <div>
        <h2 style={{ marginBottom: '24px' }}>トランジショントークン</h2>

        {/* Durations */}
        <div style={{ marginBottom: '48px' }}>
          <h3 style={{ marginBottom: '16px' }}>デュレーション（持続時間）</h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {Object.entries(transitions.duration).map(([key, value]) => (
              <div
                key={key}
                style={{
                  padding: '16px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  minWidth: '120px',
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: '8px' }}>{key}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Demo */}
        <div>
          <h3 style={{ marginBottom: '16px' }}>
            トランジションプリセット（ホバーして確認）
          </h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {Object.entries(transitions.preset).map(([key, value]) => (
              <div
                key={key}
                onMouseEnter={() => setHoveredKey(key)}
                onMouseLeave={() => setHoveredKey(null)}
                style={{
                  width: '120px',
                  height: '120px',
                  backgroundColor: hoveredKey === key ? '#2196f3' : '#f5f5f5',
                  color: hoveredKey === key ? '#fff' : '#000',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: value,
                  cursor: 'pointer',
                  transform: hoveredKey === key ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: '8px' }}>{key}</div>
                <div style={{ fontSize: '10px', textAlign: 'center', padding: '0 8px' }}>
                  Hover me
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
};
