import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ToastProvider, useToast } from './ToastProvider';
import { Button } from './Button';
import { spacing } from '../tokens';

/**
 * アクセシブルなトースト通知コンポーネント
 *
 * WCAG 2.1 AA準拠のトースト通知コンポーネントです。
 * - `role="alert"` でスクリーンリーダーに通知
 * - `aria-live="polite"` でユーザーの操作を妨げない
 * - `aria-atomic="true"` でメッセージ全体を読み上げ
 * - 4種類のタイプ（success, error, warning, info）
 * - 自動消去機能（デフォルト5秒）
 * - キーボードでも閉じられる（×ボタンにフォーカス可能）
 */
const meta = {
  title: 'Design System/Toast',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デモ用のコンポーネント
 */
const ToastDemo = () => {
  const { success, error, warning, info, showToast } = useToast();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[4], padding: spacing.scale[8] }}>
      <h2 style={{ margin: 0 }}>Toast デモ</h2>
      <p style={{ margin: 0, color: '#666' }}>
        ボタンをクリックすると、画面右上にトーストが表示されます
      </p>

      <div style={{ display: 'flex', gap: spacing.scale[3], flexWrap: 'wrap' }}>
        <Button
          variant="primary"
          onClick={() => success('操作が成功しました', '成功')}
        >
          Success Toast
        </Button>

        <Button
          variant="primary"
          onClick={() => error('エラーが発生しました。もう一度お試しください。', 'エラー')}
        >
          Error Toast
        </Button>

        <Button
          variant="primary"
          onClick={() => warning('この操作は取り消せません', '警告')}
        >
          Warning Toast
        </Button>

        <Button
          variant="primary"
          onClick={() => info('新しいメッセージがあります', 'お知らせ')}
        >
          Info Toast
        </Button>
      </div>

      <div style={{ marginTop: spacing.scale[4] }}>
        <h3 style={{ margin: 0, marginBottom: spacing.scale[2] }}>カスタム設定</h3>
        <div style={{ display: 'flex', gap: spacing.scale[3], flexWrap: 'wrap' }}>
          <Button
            variant="secondary"
            onClick={() => showToast('タイトルなしのメッセージ', { type: 'success' })}
          >
            タイトルなし
          </Button>

          <Button
            variant="secondary"
            onClick={() => showToast('10秒間表示されます', { type: 'info', title: '長時間表示', duration: 10000 })}
          >
            長時間表示 (10秒)
          </Button>

          <Button
            variant="secondary"
            onClick={() => showToast('自動で閉じません', { type: 'warning', title: '手動クローズ', duration: 0 })}
          >
            自動クローズなし
          </Button>
        </div>
      </div>

      <div style={{ marginTop: spacing.scale[4] }}>
        <h3 style={{ margin: 0, marginBottom: spacing.scale[2] }}>複数表示</h3>
        <Button
          variant="outline"
          onClick={() => {
            success('1つ目のメッセージ');
            setTimeout(() => info('2つ目のメッセージ'), 200);
            setTimeout(() => warning('3つ目のメッセージ'), 400);
          }}
        >
          複数のトーストを表示
        </Button>
      </div>
    </div>
  );
};

/**
 * 基本的な使い方
 *
 * useToast フックを使ってトーストを表示します
 */
export const Default: Story = {
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  ),
  parameters: {
    docs: {
      source: {
        code: `
const YourComponent = () => {
  const { success, error, warning, info } = useToast();

  return (
    <Button onClick={() => success('操作が成功しました', '成功')}>
      Success Toast
    </Button>
  );
};
        `,
      },
    },
  },
};

/**
 * WCAG レベル別のフォーカススタイル
 *
 * WCAGレベルに応じて、閉じるボタン（×）のフォーカス時のアウトライン（枠線）の太さが変わります。
 * - Level A: 2px の細い青枠
 * - Level AA: 3px の中太青枠（推奨）
 * - Level AAA: 4px の太い黄色枠
 */
export const WCAGLevels: Story = {
  render: () => {
    const [level, setLevel] = useState<'A' | 'AA' | 'AAA'>('AA');

    const WCAGDemo = () => {
      const { success, error, warning, info } = useToast();

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[4], padding: spacing.scale[8] }}>
          <h2 style={{ margin: 0 }}>WCAG Level {level} のフォーカススタイル</h2>
          <p style={{ margin: 0, color: '#666' }}>
            レベルを変更してから、トーストを表示してください。<br />
            <strong>Tab キー</strong>を押して閉じるボタン（×）にフォーカスを当てると、アウトラインの太さが確認できます。
          </p>

          <div style={{ display: 'flex', gap: spacing.scale[3], flexWrap: 'wrap', marginBottom: spacing.scale[4] }}>
            <Button variant={level === 'A' ? 'primary' : 'outline'} onClick={() => setLevel('A')}>
              Level A
            </Button>
            <Button variant={level === 'AA' ? 'primary' : 'outline'} onClick={() => setLevel('AA')}>
              Level AA（推奨）
            </Button>
            <Button variant={level === 'AAA' ? 'primary' : 'outline'} onClick={() => setLevel('AAA')}>
              Level AAA
            </Button>
          </div>

          <div style={{ display: 'flex', gap: spacing.scale[3], flexWrap: 'wrap' }}>
            <Button variant="secondary" onClick={() => success('操作が成功しました', '成功')}>
              Success Toast
            </Button>
            <Button variant="secondary" onClick={() => error('エラーが発生しました', 'エラー')}>
              Error Toast
            </Button>
            <Button variant="secondary" onClick={() => warning('警告メッセージです', '警告')}>
              Warning Toast
            </Button>
            <Button variant="secondary" onClick={() => info('お知らせです', 'お知らせ')}>
              Info Toast
            </Button>
          </div>

          <div style={{
            marginTop: spacing.scale[4],
            padding: spacing.scale[4],
            backgroundColor: level === 'A' ? '#f0f9ff' : level === 'AA' ? '#f0f9ff' : '#fef3c7',
            borderRadius: '8px',
            border: `2px solid ${level === 'A' ? '#bfdbfe' : level === 'AA' ? '#2196f3' : '#fbbf24'}`
          }}>
            <h4 style={{ marginTop: 0, marginBottom: spacing.scale[2] }}>
              Level {level} の特徴
            </h4>
            {level === 'A' && (
              <ul style={{ margin: 0, paddingLeft: spacing.scale[6], lineHeight: 1.8 }}>
                <li><strong>アウトライン幅:</strong> 2px（細め）</li>
                <li><strong>色:</strong> 青 (#64b5f6)</li>
                <li><strong>オフセット:</strong> なし</li>
                <li>最小限のアクセシビリティ基準</li>
              </ul>
            )}
            {level === 'AA' && (
              <ul style={{ margin: 0, paddingLeft: spacing.scale[6], lineHeight: 1.8 }}>
                <li><strong>アウトライン幅:</strong> 3px（中太）</li>
                <li><strong>色:</strong> 濃い青 (#1976d2)</li>
                <li><strong>オフセット:</strong> 2px</li>
                <li><strong>背景:</strong> 薄い青</li>
                <li>ほとんどのWebサイトで推奨される基準 ★</li>
              </ul>
            )}
            {level === 'AAA' && (
              <ul style={{ margin: 0, paddingLeft: spacing.scale[6], lineHeight: 1.8 }}>
                <li><strong>アウトライン幅:</strong> 4px（太め）</li>
                <li><strong>色:</strong> 黒 (#000000)</li>
                <li><strong>オフセット:</strong> 2px</li>
                <li><strong>背景:</strong> 黄色</li>
                <li>最高レベルのアクセシビリティ基準</li>
                <li>公共機関、医療、金融サービスなどで使用</li>
              </ul>
            )}
          </div>
        </div>
      );
    };

    return (
      <ToastProvider wcagLevel={level}>
        <WCAGDemo />
      </ToastProvider>
    );
  },
};

