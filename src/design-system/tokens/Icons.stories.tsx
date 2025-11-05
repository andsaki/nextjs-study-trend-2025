import type { Meta, StoryObj } from '@storybook/react';
import { icons } from './icons';
import { spacing } from './spacing';
import { primitive } from './colors';
import { radii } from './radii';
import { typography } from './typography';

/**
 * # アイコントークン
 *
 * lucide-reactを使用したアイコンシステム。
 * デザインシステム全体で一貫したアイコンを使用できます。
 *
 * ## 特徴
 *
 * - 🎨 **柔らかく丸みのあるデザイン** - 「優しい体験」テーマにマッチ
 * - ♿ **アクセシビリティ親和性** - aria-label, aria-hiddenを簡単に設定可能
 * - 🌳 **Tree-shaking対応** - 使用するアイコンのみバンドル（約1-2KB/個）
 * - 🎛️ **カスタマイズ性** - size, color, strokeWidthを自由に調整
 *
 * ## 選定理由
 *
 * 詳しくは [ADR 001: SVGアイコンライブラリの選択](../../../docs/adr/001-icon-library-selection.md) をご覧ください。
 */
const meta = {
  title: 'Design System/🎨 Tokens/Icons',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'デザインシステムで使用するすべてのアイコンを一元管理するトークンシステムです。',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ## デザイン哲学（Philosophy）
 *
 * 「優しい体験」をテーマにした3原則とその概要を表すアイコン。
 */
export const Philosophy: Story = {
  render: () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: spacing.scale[4],
    }}>
      {Object.entries(icons.philosophy).map(([key, Icon]) => (
        <div
          key={key}
          style={{
            padding: spacing.scale[4],
            backgroundColor: primitive.blue[50],
            borderRadius: radii.borderRadius.lg,
            border: `1px solid ${primitive.blue[200]}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing.scale[2],
          }}
        >
          <Icon size={40} color={primitive.blue[500]} strokeWidth={1.5} />
          <div style={{
            fontSize: typography.fontSize.sm,
            color: primitive.blue[900],
            fontWeight: typography.fontWeight.semibold,
            textAlign: 'center',
          }}>
            icons.philosophy.{key}
          </div>
          <div style={{
            fontSize: typography.fontSize.xs,
            color: primitive.gray[600],
            textAlign: 'center',
          }}>
            {Icon.displayName || Icon.name}
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * ## コンポーネント（Component）
 *
 * 各UIコンポーネントを表すアイコン。
 */
export const Component: Story = {
  render: () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: spacing.scale[4],
    }}>
      {Object.entries(icons.component).map(([key, Icon]) => (
        <div
          key={key}
          style={{
            padding: spacing.scale[4],
            backgroundColor: primitive.green[50],
            borderRadius: radii.borderRadius.lg,
            border: `1px solid ${primitive.green[200]}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing.scale[2],
          }}
        >
          <Icon size={32} color={primitive.green[600]} strokeWidth={2} />
          <div style={{
            fontSize: typography.fontSize.sm,
            color: primitive.green[900],
            fontWeight: typography.fontWeight.semibold,
            textAlign: 'center',
          }}>
            icons.component.{key}
          </div>
          <div style={{
            fontSize: typography.fontSize.xs,
            color: primitive.gray[600],
            textAlign: 'center',
          }}>
            {Icon.displayName || Icon.name}
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * ## コンセプト（Concept）
 *
 * WCAG、デザイントークン、テーマなどの概念を表すアイコン。
 */
export const Concept: Story = {
  render: () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.scale[6],
    }}>
      {/* WCAG and Design Tokens */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: spacing.scale[4],
      }}>
        <div
          style={{
            padding: spacing.scale[4],
            backgroundColor: primitive.orange[50],
            borderRadius: radii.borderRadius.lg,
            border: `1px solid ${primitive.orange[200]}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing.scale[2],
          }}
        >
          <icons.concept.wcag size={32} color={primitive.orange[600]} strokeWidth={2} />
          <div style={{
            fontSize: typography.fontSize.sm,
            color: primitive.orange[900],
            fontWeight: typography.fontWeight.semibold,
            textAlign: 'center',
          }}>
            icons.concept.wcag
          </div>
          <div style={{
            fontSize: typography.fontSize.xs,
            color: primitive.gray[600],
            textAlign: 'center',
          }}>
            Target
          </div>
        </div>

        <div
          style={{
            padding: spacing.scale[4],
            backgroundColor: primitive.orange[50],
            borderRadius: radii.borderRadius.lg,
            border: `1px solid ${primitive.orange[200]}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing.scale[2],
          }}
        >
          <icons.concept.designTokens size={32} color={primitive.orange[600]} strokeWidth={2} />
          <div style={{
            fontSize: typography.fontSize.sm,
            color: primitive.orange[900],
            fontWeight: typography.fontWeight.semibold,
            textAlign: 'center',
          }}>
            icons.concept.designTokens
          </div>
          <div style={{
            fontSize: typography.fontSize.xs,
            color: primitive.gray[600],
            textAlign: 'center',
          }}>
            Palette
          </div>
        </div>
      </div>

      {/* Theme */}
      <div>
        <h3 style={{
          marginTop: 0,
          marginBottom: spacing.scale[3],
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          color: primitive.gray[900],
        }}>
          Theme Icons
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: spacing.scale[4],
        }}>
          <div
            style={{
              padding: spacing.scale[4],
              backgroundColor: primitive.orange[50],
              borderRadius: radii.borderRadius.lg,
              border: `1px solid ${primitive.orange[200]}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: spacing.scale[2],
            }}
          >
            <icons.concept.theme.light size={32} color={primitive.orange[500]} strokeWidth={2} />
            <div style={{
              fontSize: typography.fontSize.sm,
              color: primitive.gray[900],
              fontWeight: typography.fontWeight.semibold,
              textAlign: 'center',
            }}>
              icons.concept.theme.light
            </div>
            <div style={{
              fontSize: typography.fontSize.xs,
              color: primitive.gray[600],
              textAlign: 'center',
            }}>
              Sun
            </div>
          </div>

          <div
            style={{
              padding: spacing.scale[4],
              backgroundColor: primitive.gray[800],
              borderRadius: radii.borderRadius.lg,
              border: `1px solid ${primitive.gray[600]}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: spacing.scale[2],
            }}
          >
            <icons.concept.theme.dark size={32} color={primitive.gray[300]} strokeWidth={2} />
            <div style={{
              fontSize: typography.fontSize.sm,
              color: primitive.white,
              fontWeight: typography.fontWeight.semibold,
              textAlign: 'center',
            }}>
              icons.concept.theme.dark
            </div>
            <div style={{
              fontSize: typography.fontSize.xs,
              color: primitive.gray[400],
              textAlign: 'center',
            }}>
              Moon
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * ## カスタマイズ例
 *
 * アイコンのサイズ、色、strokeWidthをカスタマイズできます。
 */
export const Customization: Story = {
  render: () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.scale[6],
    }}>
      {/* Size variations */}
      <div>
        <h3 style={{
          marginTop: 0,
          marginBottom: spacing.scale[3],
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          color: primitive.gray[900],
        }}>
          サイズバリエーション
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.scale[4],
          padding: spacing.scale[4],
          backgroundColor: primitive.gray[50],
          borderRadius: radii.borderRadius.lg,
        }}>
          <icons.philosophy.kind size={16} color={primitive.pink[400]} strokeWidth={2} />
          <icons.philosophy.kind size={24} color={primitive.pink[400]} strokeWidth={2} />
          <icons.philosophy.kind size={32} color={primitive.pink[400]} strokeWidth={2} />
          <icons.philosophy.kind size={48} color={primitive.pink[400]} strokeWidth={2} />
          <icons.philosophy.kind size={64} color={primitive.pink[400]} strokeWidth={2} />
        </div>
        <div style={{
          marginTop: spacing.scale[2],
          fontSize: typography.fontSize.sm,
          color: primitive.gray[600],
        }}>
          size=&#123;16&#125;, size=&#123;24&#125;, size=&#123;32&#125;, size=&#123;48&#125;, size=&#123;64&#125;
        </div>
      </div>

      {/* Color variations */}
      <div>
        <h3 style={{
          marginTop: 0,
          marginBottom: spacing.scale[3],
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          color: primitive.gray[900],
        }}>
          カラーバリエーション
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.scale[4],
          padding: spacing.scale[4],
          backgroundColor: primitive.gray[50],
          borderRadius: radii.borderRadius.lg,
        }}>
          <icons.philosophy.pleasant size={32} color={primitive.blue[500]} strokeWidth={2} />
          <icons.philosophy.pleasant size={32} color={primitive.green[500]} strokeWidth={2} />
          <icons.philosophy.pleasant size={32} color={primitive.pink[400]} strokeWidth={2} />
          <icons.philosophy.pleasant size={32} color={primitive.orange[500]} strokeWidth={2} />
          <icons.philosophy.pleasant size={32} color={primitive.red[500]} strokeWidth={2} />
        </div>
        <div style={{
          marginTop: spacing.scale[2],
          fontSize: typography.fontSize.sm,
          color: primitive.gray[600],
        }}>
          color=&#123;primitive.blue[500]&#125;, color=&#123;primitive.green[500]&#125;, など
        </div>
      </div>

      {/* StrokeWidth variations */}
      <div>
        <h3 style={{
          marginTop: 0,
          marginBottom: spacing.scale[3],
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          color: primitive.gray[900],
        }}>
          strokeWidth バリエーション
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.scale[4],
          padding: spacing.scale[4],
          backgroundColor: primitive.gray[50],
          borderRadius: radii.borderRadius.lg,
        }}>
          <icons.philosophy.inclusive size={40} color={primitive.blue[500]} strokeWidth={1} />
          <icons.philosophy.inclusive size={40} color={primitive.blue[500]} strokeWidth={1.5} />
          <icons.philosophy.inclusive size={40} color={primitive.blue[500]} strokeWidth={2} />
          <icons.philosophy.inclusive size={40} color={primitive.blue[500]} strokeWidth={2.5} />
          <icons.philosophy.inclusive size={40} color={primitive.blue[500]} strokeWidth={3} />
        </div>
        <div style={{
          marginTop: spacing.scale[2],
          fontSize: typography.fontSize.sm,
          color: primitive.gray[600],
        }}>
          strokeWidth=&#123;1&#125;, strokeWidth=&#123;1.5&#125;, strokeWidth=&#123;2&#125;, strokeWidth=&#123;2.5&#125;, strokeWidth=&#123;3&#125;
        </div>
      </div>
    </div>
  ),
};

/**
 * ## 使用例
 *
 * アイコンの基本的な使い方。
 */
export const Usage: Story = {
  render: () => (
    <div style={{
      padding: spacing.scale[4],
      backgroundColor: primitive.gray[50],
      borderRadius: radii.borderRadius.lg,
    }}>
      <h3 style={{
        marginTop: 0,
        marginBottom: spacing.scale[3],
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: primitive.gray[900],
      }}>
        基本的な使い方
      </h3>

      <pre style={{
        padding: spacing.scale[3],
        backgroundColor: primitive.gray[900],
        color: primitive.gray[100],
        borderRadius: radii.borderRadius.base,
        fontSize: typography.fontSize.sm,
        overflow: 'auto',
      }}>
{`import { icons } from './design-system/tokens';

// 基本的な使用
<icons.philosophy.kind size={24} />

// カスタマイズ
<icons.component.button
  size={28}
  color={primitive.blue[600]}
  strokeWidth={2}
/>

// アクセシビリティ
<icons.concept.wcag
  size={20}
  aria-label="WCAGガイドライン"
/>

// 装飾的なアイコン（スクリーンリーダーから隠す）
<icons.philosophy.pleasant
  size={32}
  aria-hidden="true"
/>`}
      </pre>
    </div>
  ),
};
