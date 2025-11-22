"use client";

import { memo, useCallback, useMemo, useState, useRef, useEffect } from "react";
import { colors, spacing, radii, typography } from "@/src/design-system/tokens";
import { primitive } from "@/src/design-system/tokens/colors";

// コードブロックコンポーネント
const CodeBlock = ({ code, title }: { code: string; title?: string }) => (
  <div style={{ marginTop: spacing.scale[4] }}>
    {title && (
      <div
        style={{
          ...typography.body.small,
          fontWeight: typography.fontWeight.semibold,
          color: colors.text.secondary,
          marginBottom: spacing.scale[2],
        }}
      >
        {title}
      </div>
    )}
    <pre
      style={{
        fontFamily: typography.fontFamily.mono,
        fontSize: typography.fontSize.sm,
        backgroundColor: primitive.gray[900],
        color: primitive.gray[50],
        padding: spacing.scale[4],
        borderRadius: radii.card.md,
        overflow: "auto",
        margin: 0,
        lineHeight: typography.lineHeight.relaxed,
      }}
    >
      <code>{code}</code>
    </pre>
  </div>
);

// レンダリング回数を追跡するフック
const useRenderCount = () => {
  const renderCount = useRef(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isMounted) {
    renderCount.current += 1;
  }

  return renderCount.current;
};

// カート計算（重い処理をシミュレート）
const PRODUCTS = [
  { id: 1, name: "UIコンポーネント集", price: 12000, qty: 1 },
  { id: 2, name: "デザインシステム解説書", price: 6800, qty: 2 },
  { id: 3, name: "React ベストプラクティス講座", price: 15800, qty: 1 },
  { id: 4, name: "テスト戦略ワークショップ", price: 9800, qty: 3 },
  { id: 5, name: "フロントエンドパフォーマンス虎の巻", price: 8400, qty: 2 },
];

const calcCartSummary = (taxRate: number) => {
  if (typeof window !== "undefined") {
    const start = performance.now();
    while (performance.now() - start < 120) {
      // 重い処理をシミュレート
    }
  }

  const subtotal = PRODUCTS.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Math.round((subtotal * taxRate) / 100);
  const total = subtotal + tax;
  return { subtotal, tax, total };
};

const formatCurrency = (value: number) =>
  value.toLocaleString("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  });

const TAGS = ["すべて", "UI", "バックエンド", "AI", "DevOps", "設計"];

// memo なしの子コンポーネント
const NormalChild = ({ value, onClick, clickCount }: { value: string; onClick: () => void; clickCount: number }) => {
  const renderCount = useRenderCount();
  return (
    <div
      style={{
        padding: spacing.scale[4],
        border: `2px solid ${primitive.red[500]}`,
        borderRadius: radii.card.md,
        marginBottom: spacing.scale[4],
      }}
    >
      <h3 style={{ ...typography.heading.h5, marginBottom: spacing.scale[2] }}>
        ❌ 通常の子コンポーネント
      </h3>
      <p style={{ marginBottom: spacing.scale[2] }}>値: {value}</p>
      <p style={{ marginBottom: spacing.scale[3] }}>レンダリング回数: {renderCount}</p>
      <button
        onClick={onClick}
        style={{
          padding: `${spacing.scale[2]} ${spacing.scale[4]}`,
          cursor: "pointer",
          backgroundColor: colors.button.primary.bg,
          color: colors.button.primary.text,
          border: "none",
          borderRadius: radii.button.md,
        }}
      >
        クリック ({clickCount}回)
      </button>
    </div>
  );
};

// memo ありの子コンポーネント
const MemoizedChild = memo(({ value, onClick, clickCount }: { value: string; onClick: () => void; clickCount: number }) => {
  const renderCount = useRenderCount();
  return (
    <div
      style={{
        padding: spacing.scale[4],
        border: `2px solid ${primitive.green[500]}`,
        borderRadius: radii.card.md,
        marginBottom: spacing.scale[4],
      }}
    >
      <h3 style={{ ...typography.heading.h5, marginBottom: spacing.scale[2] }}>
        ✅ memo付き子コンポーネント
      </h3>
      <p style={{ marginBottom: spacing.scale[2] }}>値: {value}</p>
      <p style={{ marginBottom: spacing.scale[3] }}>レンダリング回数: {renderCount}</p>
      <button
        onClick={onClick}
        style={{
          padding: `${spacing.scale[2]} ${spacing.scale[4]}`,
          cursor: "pointer",
          backgroundColor: colors.button.primary.bg,
          color: colors.button.primary.text,
          border: "none",
          borderRadius: radii.button.md,
        }}
      >
        クリック ({clickCount}回)
      </button>
    </div>
  );
});
MemoizedChild.displayName = "MemoizedChild";

// カート計算結果表示
const SummaryRows = ({ summary }: { summary: ReturnType<typeof calcCartSummary> }) => (
  <div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: `${spacing.scale[2]} 0`,
        borderBottom: `1px solid ${colors.border.subtle}`,
        fontSize: typography.body.base.fontSize,
      }}
    >
      <span>小計</span>
      <span style={{ fontWeight: typography.fontWeight.semibold }}>{formatCurrency(summary.subtotal)}</span>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: `${spacing.scale[2]} 0`,
        borderBottom: `1px solid ${colors.border.subtle}`,
        fontSize: typography.body.base.fontSize,
      }}
    >
      <span>消費税</span>
      <span style={{ fontWeight: typography.fontWeight.semibold }}>{formatCurrency(summary.tax)}</span>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: `${spacing.scale[2]} 0`,
        fontSize: typography.body.large.fontSize,
      }}
    >
      <span>合計</span>
      <span style={{ fontWeight: typography.fontWeight.semibold }}>{formatCurrency(summary.total)}</span>
    </div>
  </div>
);

// useMemo なしのカート計算
const WithoutMemoCart = () => {
  const [taxRate, setTaxRate] = useState(10);
  const summary = calcCartSummary(taxRate);
  const renders = useRenderCount();

  return (
    <div
      style={{
        padding: spacing.scale[4],
        border: `2px solid ${primitive.red[500]}`,
        borderRadius: radii.card.md,
        marginBottom: spacing.scale[4],
      }}
    >
      <h3 style={{ ...typography.heading.h5, marginBottom: spacing.scale[2] }}>❌ useMemo なし（毎回計算）</h3>
      <div
        style={{
          ...typography.textStyle.caption,
          backgroundColor: colors.background.subtle,
          color: colors.text.secondary,
          borderRadius: radii.borderRadius.sm,
          padding: `${spacing.scale[1]} ${spacing.scale[2]}`,
          display: "inline-flex",
          gap: spacing.scale[1],
          alignItems: "center",
          marginBottom: spacing.scale[3],
        }}
      >
        <span>再計算回数</span>
        <strong>{renders}</strong>
      </div>
      <label style={{ ...typography.body.small, fontWeight: typography.fontWeight.semibold, color: colors.text.secondary, display: "block", marginBottom: spacing.scale[2] }}>
        税率: {taxRate}%
      </label>
      <input
        type="range"
        min={5}
        max={20}
        value={taxRate}
        onChange={(e) => setTaxRate(Number(e.target.value))}
        style={{
          width: "100%",
          marginBottom: spacing.scale[4],
          accentColor: colors.brand.primary,
        }}
      />
      <SummaryRows summary={summary} />
    </div>
  );
};

// useMemo ありのカート計算
const WithMemoCart = () => {
  const [taxRate, setTaxRate] = useState(10);
  const summary = useMemo(() => calcCartSummary(taxRate), [taxRate]);
  const renders = useRenderCount();

  return (
    <div
      style={{
        padding: spacing.scale[4],
        border: `2px solid ${primitive.green[500]}`,
        borderRadius: radii.card.md,
        marginBottom: spacing.scale[4],
      }}
    >
      <h3 style={{ ...typography.heading.h5, marginBottom: spacing.scale[2] }}>✅ useMemo あり（キャッシュ）</h3>
      <div
        style={{
          ...typography.textStyle.caption,
          backgroundColor: colors.background.subtle,
          color: colors.text.secondary,
          borderRadius: radii.borderRadius.sm,
          padding: `${spacing.scale[1]} ${spacing.scale[2]}`,
          display: "inline-flex",
          gap: spacing.scale[1],
          alignItems: "center",
          marginBottom: spacing.scale[3],
        }}
      >
        <span>再計算回数</span>
        <strong>{renders}</strong>
      </div>
      <label style={{ ...typography.body.small, fontWeight: typography.fontWeight.semibold, color: colors.text.secondary, display: "block", marginBottom: spacing.scale[2] }}>
        税率: {taxRate}%
      </label>
      <input
        type="range"
        min={5}
        max={20}
        value={taxRate}
        onChange={(e) => setTaxRate(Number(e.target.value))}
        style={{
          width: "100%",
          marginBottom: spacing.scale[4],
          accentColor: colors.brand.primary,
        }}
      />
      <SummaryRows summary={summary} />
    </div>
  );
};

// タグボタンコンポーネント（useCallback の効果確認用）
type TagButtonProps = {
  label: string;
  active: boolean;
  onSelect: (label: string) => void;
};

const TagButton = memo(({ label, active, onSelect }: TagButtonProps) => {
  const renders = useRenderCount();

  const handleClick = useCallback(() => {
    onSelect(label);
  }, [label, onSelect]);

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        borderRadius: radii.component.chip,
        border: `1px solid ${active ? colors.brand.primary : colors.border.subtle}`,
        background: active ? colors.brand.primary : colors.background.default,
        color: active ? colors.background.default : colors.text.primary,
        padding: `${spacing.scale[1]} ${spacing.scale[3]}`,
        display: "inline-flex",
        alignItems: "center",
        gap: spacing.scale[2],
        cursor: "pointer",
        fontSize: typography.body.small.fontSize,
        transition: "all 0.2s ease",
      }}
    >
      <span>{label}</span>
      <span style={{ ...typography.textStyle.caption, opacity: 0.8 }}>render: {renders}</span>
    </button>
  );
});
TagButton.displayName = "TagButton";

// useCallback の比較コンポーネント
const CallbackComparison = () => {
  const [activeBasic, setActiveBasic] = useState(TAGS[0]);
  const [activeOptimized, setActiveOptimized] = useState(TAGS[0]);
  const [keyword, setKeyword] = useState("");
  const renders = useRenderCount();

  const selectBasic = (label: string) => {
    setActiveBasic(label);
  };

  const selectOptimized = useCallback((label: string) => {
    setActiveOptimized(label);
  }, []);

  return (
    <div
      style={{
        padding: spacing.scale[6],
        background: primitive.blue[50],
        borderRadius: radii.card.md,
      }}
    >
      <h2 style={{ ...typography.heading.h4, marginBottom: spacing.scale[4] }}>
        🎯 useCallback で関数の参照を安定化
      </h2>
      <div
        style={{
          ...typography.textStyle.caption,
          backgroundColor: colors.background.subtle,
          color: colors.text.secondary,
          borderRadius: radii.borderRadius.sm,
          padding: `${spacing.scale[1]} ${spacing.scale[2]}`,
          display: "inline-flex",
          gap: spacing.scale[1],
          alignItems: "center",
          marginBottom: spacing.scale[4],
        }}
      >
        <span>親コンポーネントの再描画</span>
        <strong>{renders}</strong>
      </div>
      <label
        style={{
          ...typography.body.small,
          fontWeight: typography.fontWeight.semibold,
          color: colors.text.secondary,
          display: "block",
          marginBottom: spacing.scale[2],
        }}
      >
        フィルターキーワード（入力するたびに親が再レンダー）
      </label>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="例: DevOps"
        style={{
          width: "100%",
          border: `1px solid ${colors.input.border}`,
          borderRadius: radii.input.md,
          padding: `${spacing.input.paddingY.md} ${spacing.input.paddingX.md}`,
          background: colors.input.bg,
          color: colors.input.text,
          fontSize: typography.body.base.fontSize,
          marginBottom: spacing.scale[6],
        }}
      />

      <div style={{ marginBottom: spacing.scale[6] }}>
        <p style={{ ...typography.body.base, color: colors.text.secondary, marginBottom: spacing.scale[3] }}>
          ❌ useCallback なし（ハンドラーが毎回生成されるため全ボタンが再レンダー）
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: spacing.scale[2] }}>
          {TAGS.map((tag) => (
            <TagButton key={`basic-${tag}`} label={tag} active={activeBasic === tag} onSelect={selectBasic} />
          ))}
        </div>
      </div>

      <div>
        <p style={{ ...typography.body.base, color: colors.text.secondary, marginBottom: spacing.scale[3] }}>
          ✅ useCallback あり（ハンドラーをメモ化して不要な再レンダーを抑制）
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: spacing.scale[2] }}>
          {TAGS.map((tag) => (
            <TagButton key={`memo-${tag}`} label={tag} active={activeOptimized === tag} onSelect={selectOptimized} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function HooksMemoVerificationPage() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const [normalChildClicks, setNormalChildClicks] = useState(0);
  const [memoChildClicks1, setMemoChildClicks1] = useState(0);
  const [memoChildClicks2, setMemoChildClicks2] = useState(0);
  const renderCount = useRenderCount();

  // ❌ 毎回新しい関数が作られる
  const normalCallback = () => {
    setNormalChildClicks((c) => c + 1);
  };

  // ❌ 毎回新しい関数が作られる（memo付き1つ目用）
  const normalCallback2 = () => {
    setMemoChildClicks1((c) => c + 1);
  };

  // ✅ useCallback: 同じ関数インスタンスを保持
  const memoizedCallback = useCallback(() => {
    setMemoChildClicks2((c) => c + 1);
  }, []);

  return (
    <div style={{ padding: spacing.scale[8], fontFamily: typography.fontFamily.base }}>
      <h1 style={{ ...typography.heading.h2, marginBottom: spacing.scale[4] }}>
        useMemo / useCallback / React.memo 検証
      </h1>
      <p style={{ marginBottom: spacing.scale[8], color: colors.text.secondary }}>
        親コンポーネントのレンダリング回数: {renderCount}
      </p>

      {/* カウンターセクション */}
      <div
        style={{
          marginBottom: spacing.scale[12],
          padding: spacing.scale[6],
          background: colors.background.subtle,
          borderRadius: radii.card.md,
        }}
      >
        <h2 style={{ ...typography.heading.h4, marginBottom: spacing.scale[4] }}>
          🔢 カウンター（親の状態変更トリガー）
        </h2>
        <p style={{ marginBottom: spacing.scale[4] }}>Count: {count}</p>
        <button
          onClick={() => setCount((c) => c + 1)}
          style={{
            padding: `${spacing.scale[2]} ${spacing.scale[4]}`,
            marginRight: spacing.scale[4],
            cursor: "pointer",
            backgroundColor: colors.button.primary.bg,
            color: colors.button.primary.text,
            border: "none",
            borderRadius: radii.button.md,
          }}
        >
          カウント + 1
        </button>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="テキスト入力（親を再レンダリング）"
          style={{
            padding: spacing.scale[2],
            width: "300px",
            border: `1px solid ${colors.border.default}`,
            borderRadius: radii.input.md,
          }}
        />
      </div>

      {/* useMemo セクション */}
      <div
        style={{
          marginBottom: spacing.scale[12],
          padding: spacing.scale[6],
          background: primitive.yellow[50],
          borderRadius: radii.card.md,
        }}
      >
        <h2 style={{ ...typography.heading.h4, marginBottom: spacing.scale[4] }}>
          💡 useMemo 検証（カート計算の最適化）
        </h2>
        <p style={{ ...typography.body.base, color: colors.text.secondary, marginBottom: spacing.scale[4] }}>
          税率スライダーを動かすと、重い計算処理が実行されます。useMemoの有無で処理速度を比較してください。
        </p>
        <WithoutMemoCart />
        <WithMemoCart />
      </div>

      {/* useCallback + React.memo セクション */}
      <div
        style={{
          marginBottom: spacing.scale[12],
          padding: spacing.scale[6],
          background: primitive.blue[50],
          borderRadius: radii.card.md,
        }}
      >
        <h2 style={{ ...typography.heading.h4, marginBottom: spacing.scale[4] }}>
          🎯 useCallback + React.memo 検証
        </h2>
        <p
          style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
            marginBottom: spacing.scale[4],
          }}
        >
          上のカウンターやテキスト入力で親を再レンダリングして、子コンポーネントの挙動を観察
        </p>

        <NormalChild value={`親のcount: ${count}`} onClick={normalCallback} clickCount={normalChildClicks} />
        <p
          style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
            marginBottom: spacing.scale[4],
          }}
        >
          ↑ memo なし + 通常の関数 → 親の再レンダリングで必ず再レンダリング
        </p>

        <MemoizedChild value="固定値" onClick={normalCallback2} clickCount={memoChildClicks1} />
        <p
          style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
            marginBottom: spacing.scale[4],
          }}
        >
          ↑ memo あり + 通常の関数 → 関数が毎回新しいので再レンダリング
        </p>

        <MemoizedChild value="固定値" onClick={memoizedCallback} clickCount={memoChildClicks2} />
        <p
          style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
            marginBottom: spacing.scale[4],
          }}
        >
          ↑ memo あり + useCallback → propsが同じなので再レンダリングされない ✨
        </p>
      </div>

      {/* useCallback の実践的な例 */}
      <CallbackComparison />

      {/* ソースコード */}
      <div
        style={{
          padding: spacing.scale[6],
          background: colors.background.subtle,
          borderRadius: radii.card.md,
          border: `1px solid ${colors.border.default}`,
        }}
      >
        <h2 style={{ ...typography.heading.h4, marginBottom: spacing.scale[4] }}>📄 ソースコード</h2>

        <CodeBlock
          title="❌ 通常のコールバック（毎回新しい関数が作られる）"
          code={`const normalCallback = () => {
  setNormalChildClicks((c) => c + 1);
};`}
        />

        <CodeBlock
          title="✅ useCallback（同じ関数インスタンスを保持）"
          code={`const memoizedCallback = useCallback(() => {
  setMemoChildClicks2((c) => c + 1);
}, []);`}
        />

        <CodeBlock
          title="❌ memo なしの子コンポーネント"
          code={`const NormalChild = ({ value, onClick, clickCount }) => {
  const renderCount = useRenderCount();
  return (
    <div>
      <h3>❌ 通常の子コンポーネント</h3>
      <p>値: {value}</p>
      <p>レンダリング回数: {renderCount}</p>
      <button onClick={onClick}>
        クリック ({clickCount}回)
      </button>
    </div>
  );
};`}
        />

        <CodeBlock
          title="✅ React.memo で包んだ子コンポーネント"
          code={`const MemoizedChild = memo(({ value, onClick, clickCount }) => {
  const renderCount = useRenderCount();
  return (
    <div>
      <h3>✅ memo付き子コンポーネント</h3>
      <p>値: {value}</p>
      <p>レンダリング回数: {renderCount}</p>
      <button onClick={onClick}>
        クリック ({clickCount}回)
      </button>
    </div>
  );
});`}
        />

        <CodeBlock
          title="使用例の比較"
          code={`// ❌ memo なし + 通常の関数 → 親の再レンダリングで必ず再レンダリング
<NormalChild
  value={\`親のcount: \${count}\`}
  onClick={normalCallback}
  clickCount={normalChildClicks}
/>

// ❌ memo あり + 通常の関数 → 関数が毎回新しいので再レンダリング
<MemoizedChild
  value="固定値"
  onClick={normalCallback2}
  clickCount={memoChildClicks1}
/>

// ✅ memo あり + useCallback → propsが同じなので再レンダリングされない
<MemoizedChild
  value="固定値"
  onClick={memoizedCallback}
  clickCount={memoChildClicks2}
/>`}
        />
      </div>

      {/* まとめ */}
      <div
        style={{
          padding: spacing.scale[6],
          background: colors.background.subtle,
          borderRadius: radii.card.md,
          border: `1px solid ${colors.border.default}`,
        }}
      >
        <h2 style={{ ...typography.heading.h4, marginBottom: spacing.scale[4] }}>📝 まとめ</h2>
        <ul style={{ lineHeight: 1.8, paddingLeft: spacing.scale[6] }}>
          <li style={{ marginBottom: spacing.scale[2] }}>
            <strong>useMemo</strong>: 計算結果をキャッシュ。依存配列が変わるまで再計算しない
          </li>
          <li style={{ marginBottom: spacing.scale[2] }}>
            <strong>useCallback</strong>: 関数インスタンスをキャッシュ。子コンポーネントのprops比較で有効
          </li>
          <li style={{ marginBottom: spacing.scale[2] }}>
            <strong>React.memo</strong>: コンポーネントをメモ化。propsが同じなら再レンダリングをスキップ
          </li>
          <li style={{ marginTop: spacing.scale[2], color: primitive.red[600] }}>
            ⚠️ React.memo + useCallback は<strong>セットで使う</strong>ことで効果を発揮
          </li>
          <li style={{ marginTop: spacing.scale[2], color: primitive.blue[600] }}>
            💡 ボタンをクリックして、各コンポーネントのレンダリング回数とクリック回数を比較してみてください
          </li>
        </ul>
      </div>
    </div>
  );
}
