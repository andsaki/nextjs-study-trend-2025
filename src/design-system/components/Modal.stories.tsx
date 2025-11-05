import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { spacing } from '../tokens';

/**
 * アクセシブルなモーダルダイアログコンポーネント
 *
 * WCAG 2.1 AA準拠のモーダルコンポーネントです。
 * - `role="dialog"` と `aria-modal="true"` でアクセシブル
 * - フォーカストラップ（Tab キーでモーダル内を循環）
 * - Esc キーで閉じる
 * - 背景スクロール防止
 * - フォーカス管理（開いた時に最初の要素へ、閉じた時に元の場所へ）
 */
const meta = {
  title: 'Design System/Modal',
  parameters: {
    layout: 'fullscreen',
    a11y: {
      config: {
        rules: [
          {
            // ダイアログのラベルが必須
            id: 'aria-dialog-name',
            enabled: true,
          },
          {
            // フォーカス可能な要素が必須
            id: 'focus-trap',
            enabled: true,
          },
        ],
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: spacing.scale[8], minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的なモーダル
 *
 * モーダルの基本的な使い方を示します。
 * - `role="dialog"` でダイアログであることを宣言
 * - `aria-modal="true"` でモーダルであることを明示
 * - `aria-labelledby` でタイトルと関連付け
 */
export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>モーダルを開く</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="通知設定"
          size="md"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[4] }}>
            <p style={{ margin: 0, lineHeight: 1.6 }}>
              プッシュ通知を有効にすると、重要なお知らせをリアルタイムで受け取ることができます。
            </p>

            <div style={{
              padding: spacing.scale[4],
              backgroundColor: '#f0f9ff',
              borderRadius: '8px',
              border: '1px solid #bfdbfe'
            }}>
              <h4 style={{ marginTop: 0, marginBottom: spacing.scale[2], color: '#1e40af' }}>
                💡 キーボード操作
              </h4>
              <ul style={{ margin: 0, paddingLeft: spacing.scale[6], lineHeight: 1.8, color: '#1e40af' }}>
                <li><strong>Tab</strong>: フォーカスを移動（モーダル内を循環）</li>
                <li><strong>Esc</strong>: モーダルを閉じる</li>
                <li><strong>Enter/Space</strong>: ボタンを実行</li>
              </ul>
            </div>

            <div style={{
              padding: spacing.scale[4],
              backgroundColor: '#fef3c7',
              borderRadius: '8px',
              border: '1px solid #fbbf24'
            }}>
              <h4 style={{ marginTop: 0, marginBottom: spacing.scale[2], color: '#92400e' }}>
                ⚠️ 注意事項
              </h4>
              <p style={{ margin: 0, lineHeight: 1.6, color: '#92400e' }}>
                モーダル表示中は背景がスクロールできなくなります。
                また、フォーカスはモーダル内に閉じ込められ、背景の要素にはアクセスできません。
              </p>
            </div>
          </div>
        </Modal>
      </>
    );
  },
};

/**
 * フッター付きモーダル（確認ダイアログ）
 *
 * 破壊的な操作の確認に使用します。
 * フッターにアクションボタンを配置することで、ユーザーの意図を確認します。
 */
export const WithFooter: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>アカウント削除</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="アカウントの削除"
          size="md"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                キャンセル
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  alert('アカウントを削除しました');
                  setIsOpen(false);
                }}
              >
                削除する
              </Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[4] }}>
            <p style={{ margin: 0, lineHeight: 1.6 }}>
              本当にアカウントを削除しますか？
            </p>

            <div style={{
              padding: spacing.scale[4],
              backgroundColor: '#fef2f2',
              borderRadius: '8px',
              border: '1px solid #fca5a5'
            }}>
              <h4 style={{ marginTop: 0, marginBottom: spacing.scale[2], color: '#991b1b' }}>
                ⚠️ この操作は取り消せません
              </h4>
              <ul style={{ margin: 0, paddingLeft: spacing.scale[6], lineHeight: 1.8, color: '#991b1b' }}>
                <li>すべての投稿データが削除されます</li>
                <li>フォロワー・フォロー情報が失われます</li>
                <li>購入履歴が消去されます</li>
                <li>同じメールアドレスでの再登録はできません</li>
              </ul>
            </div>

            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: 1.6 }}>
              アカウントを削除する代わりに、一時的に非公開にすることもできます。
              設定から「アカウントを非公開にする」を選択してください。
            </p>
          </div>
        </Modal>
      </>
    );
  },
};

/**
 * フォーム付きモーダル
 */
export const WithForm: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`送信: ${name}, ${email}`);
      setIsOpen(false);
      setName('');
      setEmail('');
    };

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>フォーム付きモーダル</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="ユーザー登録"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                キャンセル
              </Button>
              <Button variant="primary" type="submit" form="user-form">
                登録
              </Button>
            </>
          }
        >
          <form id="user-form" onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[4] }}>
              <Input
                label="お名前"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="山田太郎"
                required
              />
              <Input
                label="メールアドレス"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@example.com"
                required
              />
            </div>
          </form>
        </Modal>
      </>
    );
  },
};

/**
 * WCAG レベル別のフォーカススタイル
 *
 * WCAGレベルに応じて、フォーカス時のアウトライン（枠線）の太さが変わります。
 * - Level A: 2px の細い青枠
 * - Level AA: 3px の中太青枠（推奨）
 * - Level AAA: 4px の太い黄色枠
 */
export const WCAGLevels: Story = {
  render: () => {
    const [level, setLevel] = useState<'A' | 'AA' | 'AAA' | null>(null);

    return (
      <div style={{ display: 'flex', gap: spacing.scale[3], flexWrap: 'wrap' }}>
        <Button onClick={() => setLevel('A')}>Level A</Button>
        <Button onClick={() => setLevel('AA')}>Level AA（推奨）</Button>
        <Button onClick={() => setLevel('AAA')}>Level AAA</Button>

        {level && (
          <Modal
            isOpen={true}
            onClose={() => setLevel(null)}
            title={`Level ${level} のフォーカススタイル`}
            wcagLevel={level}
            size="md"
            footer={
              <>
                <Button variant="outline" onClick={() => setLevel(null)}>
                  キャンセル
                </Button>
                <Button variant="primary" onClick={() => setLevel(null)}>
                  確認
                </Button>
              </>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[4] }}>
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                <strong>Tab キー</strong>を押して、フォーカスを移動してみてください。
                閉じるボタン（×）やフッターのボタンにフォーカスが当たったときのアウトライン（枠線）の太さが変わります。
              </p>

              <div style={{
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
          </Modal>
        )}
      </div>
    );
  },
};

/**
 * サイズ違い
 */
export const Sizes: Story = {
  render: () => {
    const [size, setSize] = useState<'sm' | 'md' | 'lg' | null>(null);

    return (
      <div style={{ display: 'flex', gap: spacing.scale[3], flexWrap: 'wrap' }}>
        <Button onClick={() => setSize('sm')}>Small</Button>
        <Button onClick={() => setSize('md')}>Medium</Button>
        <Button onClick={() => setSize('lg')}>Large</Button>

        {size && (
          <Modal
            isOpen={true}
            onClose={() => setSize(null)}
            title={`${size.toUpperCase()} サイズのモーダル`}
            size={size}
          >
            <p>これは {size} サイズのモーダルです。</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </Modal>
        )}
      </div>
    );
  },
};

/**
 * 長いコンテンツ（スクロール）
 */
export const LongContent: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>長いコンテンツ</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="利用規約"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                キャンセル
              </Button>
              <Button variant="primary" onClick={() => setIsOpen(false)}>
                同意する
              </Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[4] }}>
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i}>
                <h3 style={{ marginTop: 0 }}>第{i + 1}条</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                  veniam, quis nostrud exercitation ullamco laboris.
                </p>
              </div>
            ))}
          </div>
        </Modal>
      </>
    );
  },
};
