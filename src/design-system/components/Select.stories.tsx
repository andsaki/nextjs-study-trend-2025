import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta = {
  title: 'Design System/Select',
  component: Select,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'ラベルテキスト',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'セレクトボックスのサイズ',
    },
    required: {
      control: 'boolean',
      description: '必須項目かどうか',
    },
    disabled: {
      control: 'boolean',
      description: '無効化するかどうか',
    },
    error: {
      control: 'text',
      description: 'エラーメッセージ',
    },
    helperText: {
      control: 'text',
      description: 'ヘルプテキスト',
    },
    wcagLevel: {
      control: { type: 'select' },
      options: ['A', 'AA', 'AAA'],
      description: 'WCAGアクセシビリティレベル',
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const countryOptions = [
  { value: 'jp', label: '日本' },
  { value: 'us', label: 'アメリカ' },
  { value: 'uk', label: 'イギリス' },
  { value: 'fr', label: 'フランス' },
  { value: 'de', label: 'ドイツ' },
];

export const Default: Story = {
  args: {
    label: '国を選択',
    options: countryOptions,
    placeholder: '選択してください',
  },
};

export const WithHelperText: Story = {
  args: {
    label: '配送先の国',
    options: countryOptions,
    placeholder: '選択してください',
    helperText: 'お住まいの国を選択してください',
  },
};

export const WithError: Story = {
  args: {
    label: '国を選択',
    options: countryOptions,
    placeholder: '選択してください',
    error: '国の選択は必須です',
  },
};

export const Required: Story = {
  args: {
    label: '国を選択',
    options: countryOptions,
    placeholder: '選択してください',
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    label: '国を選択',
    options: countryOptions,
    placeholder: '選択してください',
    disabled: true,
  },
};

export const Small: Story = {
  args: {
    label: '国を選択',
    options: countryOptions,
    placeholder: '選択してください',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    label: '国を選択',
    options: countryOptions,
    placeholder: '選択してください',
    size: 'lg',
  },
};

export const WithDisabledOptions: Story = {
  args: {
    label: '配送可能な国',
    options: [
      { value: 'jp', label: '日本' },
      { value: 'us', label: 'アメリカ（配送不可）', disabled: true },
      { value: 'uk', label: 'イギリス' },
      { value: 'fr', label: 'フランス（配送不可）', disabled: true },
      { value: 'de', label: 'ドイツ' },
    ],
    placeholder: '選択してください',
    helperText: '一部の国への配送は現在停止中です',
  },
};

export const ManyOptions: Story = {
  args: {
    label: '都道府県を選択',
    options: [
      { value: '01', label: '北海道' },
      { value: '02', label: '青森県' },
      { value: '03', label: '岩手県' },
      { value: '04', label: '宮城県' },
      { value: '05', label: '秋田県' },
      { value: '06', label: '山形県' },
      { value: '07', label: '福島県' },
      { value: '08', label: '茨城県' },
      { value: '09', label: '栃木県' },
      { value: '10', label: '群馬県' },
      { value: '11', label: '埼玉県' },
      { value: '12', label: '千葉県' },
      { value: '13', label: '東京都' },
      { value: '14', label: '神奈川県' },
      { value: '15', label: '新潟県' },
      { value: '16', label: '富山県' },
      { value: '17', label: '石川県' },
      { value: '18', label: '福井県' },
      { value: '19', label: '山梨県' },
      { value: '20', label: '長野県' },
    ],
    placeholder: '都道府県を選択',
  },
};

export const WCAGLevels: Story = {
  args: {
    label: '国を選択',
    options: countryOptions,
    placeholder: '選択してください',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{
        padding: '1.5rem',
        backgroundColor: '#FAFAFA',
        borderRadius: '0.5rem',
        border: '2px solid #E0E0E0'
      }}>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: 'bold', color: '#1F2937' }}>
          WCAG Level A
        </h3>
        <p style={{ marginBottom: '1rem', color: '#6B7280', fontSize: '0.875rem' }}>
          基本的なアクセシビリティ要件を満たします<br />
          フォーカススタイル: 薄い青のアウトライン
        </p>
        <Select
          label="国を選択"
          options={countryOptions}
          placeholder="選択してください"
          wcagLevel="A"
        />
      </div>

      <div style={{
        padding: '1.5rem',
        backgroundColor: '#FAFAFA',
        borderRadius: '0.5rem',
        border: '2px solid #1976D2'
      }}>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: 'bold', color: '#1F2937' }}>
          WCAG Level AA (デフォルト)
        </h3>
        <p style={{ marginBottom: '1rem', color: '#6B7280', fontSize: '0.875rem' }}>
          推奨されるアクセシビリティレベル（Web標準）<br />
          フォーカススタイル: 濃い青のアウトライン + 背景色
        </p>
        <Select
          label="国を選択"
          options={countryOptions}
          placeholder="選択してください"
          wcagLevel="AA"
        />
      </div>

      <div style={{
        padding: '1.5rem',
        backgroundColor: '#FAFAFA',
        borderRadius: '0.5rem',
        border: '2px solid #0D47A1'
      }}>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: 'bold', color: '#1F2937' }}>
          WCAG Level AAA
        </h3>
        <p style={{ marginBottom: '1rem', color: '#6B7280', fontSize: '0.875rem' }}>
          最高レベルのアクセシビリティ（視覚障害への最大配慮）<br />
          フォーカススタイル: 黄色背景 + 黒のアウトライン
        </p>
        <Select
          label="国を選択"
          options={countryOptions}
          placeholder="選択してください"
          wcagLevel="AAA"
        />
      </div>
    </div>
  ),
};
