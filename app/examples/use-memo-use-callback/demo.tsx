"use client";

import Link from "next/link";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, CSSProperties, ReactNode } from "react";
import { colors, spacing, typography, radii, shadows } from "@/src/design-system/tokens";

const PRODUCTS = [
  { id: 1, name: "UIコンポーネント集", price: 12000, qty: 1 },
  { id: 2, name: "デザインシステム解説書", price: 6800, qty: 2 },
  { id: 3, name: "React ベストプラクティス講座", price: 15800, qty: 1 },
  { id: 4, name: "テスト戦略ワークショップ", price: 9800, qty: 3 },
  { id: 5, name: "フロントエンドパフォーマンス虎の巻", price: 8400, qty: 2 },
];

const TAGS = ["すべて", "UI", "バックエンド", "AI", "DevOps", "設計"];

const calcCartSummary = (taxRate: number) => {
  if (typeof window !== "undefined") {
    const start = performance.now();
    while (performance.now() - start < 120) {
      // busy loop to emulate heavy loop
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

const useRenderCount = () => {
  const ref = useRef(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (isHydrated) {
    ref.current += 1;
  }

  return isHydrated ? ref.current : 0;
};

const styles = {
  main: {
    maxWidth: spacing.layout.container.maxWidth,
    margin: "0 auto",
    padding: `${spacing.scale[12]} ${spacing.layout.container.paddingX} ${spacing.scale[16]}`,
    display: "flex",
    flexDirection: "column",
    gap: spacing.scale[8],
    fontFamily: typography.fontFamily.base,
    color: colors.text.primary,
  },
  header: {
    marginBottom: spacing.scale[6],
  },
  kicker: {
    ...typography.textStyle.overline,
    display: "inline-flex",
    alignItems: "center",
    padding: `${spacing.scale[1]} ${spacing.scale[3]}`,
    borderRadius: radii.component.chip,
    backgroundColor: colors.feedback.info.bg,
    color: colors.feedback.info.text,
    marginBottom: spacing.scale[3],
  },
  title: {
    ...typography.heading.h2,
    marginBottom: spacing.scale[3],
  },
  lead: {
    ...typography.body.large,
    color: colors.text.secondary,
    maxWidth: "65ch",
  },
  sectionGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: spacing.scale[6],
  },
  card: {
    flex: 1,
    minWidth: "min(22rem, 100%)",
    borderRadius: radii.card.md,
    border: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.paper,
    padding: spacing.card.padding.md,
    boxShadow: shadows.component.card,
    display: "flex",
    flexDirection: "column",
    gap: spacing.scale[3],
  },
  cardTitle: {
    ...typography.heading.h4,
    margin: 0,
  },
  cardDescription: {
    ...typography.body.base,
    color: colors.text.secondary,
    margin: 0,
  },
  label: {
    ...typography.body.small,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
  },
  slider: {
    width: "100%",
    marginTop: spacing.scale[2],
    accentColor: colors.brand.primary,
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: `${spacing.scale[2]} 0`,
    borderBottom: `1px solid ${colors.border.subtle}`,
    fontSize: typography.body.base.fontSize,
  },
  summaryValue: {
    fontWeight: typography.fontWeight.semibold,
  },
  renderBadge: {
    ...typography.textStyle.caption,
    backgroundColor: colors.background.subtle,
    color: colors.text.secondary,
    borderRadius: radii.borderRadius.sm,
    padding: `${spacing.scale[1]} ${spacing.scale[2]}`,
    display: "inline-flex",
    gap: spacing.scale[1],
    alignItems: "center",
  },
  codeInline: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    backgroundColor: colors.background.subtle,
    padding: `0 ${spacing.scale[1]}`,
    borderRadius: radii.borderRadius.sm,
  },
  tagRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: spacing.scale[2],
  },
  tagButton: {
    borderRadius: radii.component.chip,
    border: `1px solid ${colors.border.subtle}`,
    background: colors.background.default,
    padding: `${spacing.scale[1]} ${spacing.scale[3]}`,
    display: "inline-flex",
    alignItems: "center",
    gap: spacing.scale[2],
    cursor: "pointer",
    fontSize: typography.body.small.fontSize,
    transition: "all 0.2s ease",
  },
  tagButtonActive: {
    background: colors.brand.primary,
    color: colors.background.default,
    borderColor: colors.brand.primary,
  },
  tagBadge: {
    ...typography.textStyle.caption,
    color: "inherit",
    opacity: 0.8,
  },
  summarySection: {
    borderRadius: radii.card.md,
    border: `1px solid ${colors.border.default}`,
    padding: spacing.card.padding.md,
    boxShadow: shadows.component.card,
  },
  summaryList: {
    paddingLeft: spacing.scale[5],
    margin: 0,
    listStyle: "disc",
    ...typography.body.base,
    lineHeight: typography.lineHeight.relaxed,
  },
  summaryListItem: {
    marginBottom: spacing.scale[2],
  },
  navCard: {
    marginTop: spacing.scale[6],
    padding: spacing.card.padding.sm,
    borderRadius: radii.card.sm,
    border: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.paper,
    boxShadow: shadows.component.card,
    display: "flex",
    flexDirection: "column",
    gap: spacing.scale[2],
  },
  navTitle: {
    ...typography.body.base,
    fontWeight: typography.fontWeight.semibold,
    margin: 0,
  },
  navLink: {
    color: colors.brand.primary,
    fontWeight: typography.fontWeight.semibold,
    textDecoration: "underline",
    width: "fit-content",
  },
} satisfies Record<string, CSSProperties>;

const SectionCard = ({ title, description, children }: { title: string; description: string; children: ReactNode }) => (
  <section style={styles.card}>
    <div>
      <h2 style={styles.cardTitle}>{title}</h2>
      <p style={styles.cardDescription}>{description}</p>
    </div>
    {children}
  </section>
);

const SummaryRows = ({ summary }: { summary: ReturnType<typeof calcCartSummary> }) => (
  <div>
    <div style={styles.summaryRow}>
      <span>小計</span>
      <span style={styles.summaryValue}>{formatCurrency(summary.subtotal)}</span>
    </div>
    <div style={styles.summaryRow}>
      <span>消費税</span>
      <span style={styles.summaryValue}>{formatCurrency(summary.tax)}</span>
    </div>
    <div style={{ ...styles.summaryRow, borderBottom: "none", fontSize: typography.body.large.fontSize }}>
      <span>合計</span>
      <span style={styles.summaryValue}>{formatCurrency(summary.total)}</span>
    </div>
  </div>
);

const WithoutMemo = () => {
  const [taxRate, setTaxRate] = useState(10);
  const summary = calcCartSummary(taxRate);
  const renders = useRenderCount();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTaxRate(Number(event.target.value));
  };

  return (
    <>
      <div style={styles.renderBadge}>
        <span>再計算回数</span>
        <strong>{renders}</strong>
      </div>
      <label style={styles.label}>税率: {taxRate}%</label>
      <input type="range" min={5} max={20} value={taxRate} onChange={handleChange} style={styles.slider} />
      <SummaryRows summary={summary} />
    </>
  );
};

const WithMemo = () => {
  const [taxRate, setTaxRate] = useState(10);
  const summary = useMemo(() => calcCartSummary(taxRate), [taxRate]);
  const renders = useRenderCount();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTaxRate(Number(event.target.value));
  };

  return (
    <>
      <div style={styles.renderBadge}>
        <span>再計算回数</span>
        <strong>{renders}</strong>
      </div>
      <label style={styles.label}>税率: {taxRate}%</label>
      <input type="range" min={5} max={20} value={taxRate} onChange={handleChange} style={styles.slider} />
      <SummaryRows summary={summary} />
    </>
  );
};

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
        ...styles.tagButton,
        ...(active ? styles.tagButtonActive : {}),
      }}
    >
      <span>{label}</span>
      <span style={styles.tagBadge}>render: {renders}</span>
    </button>
  );
});
TagButton.displayName = "TagButton";

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
    <>
      <div style={styles.renderBadge}>
        <span>親コンポーネントの再描画</span>
        <strong>{renders}</strong>
      </div>
      <label style={styles.label}>フィルターキーワード（入力するたびに親が再レンダー）</label>
      <input
        type="text"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="例: DevOps"
        style={{
          ...styles.slider,
          border: `1px solid ${colors.input.border}`,
          borderRadius: radii.input.md,
          padding: `${spacing.input.paddingY.md} ${spacing.input.paddingX.md}`,
          background: colors.input.bg,
          color: colors.input.text,
          fontSize: typography.body.base.fontSize,
        }}
      />

      <div>
        <p style={styles.cardDescription}>useCallback なし（ハンドラーが毎回生成されるため全ボタンが再レンダー）</p>
        <div style={styles.tagRow}>
          {TAGS.map((tag) => (
            <TagButton key={`basic-${tag}`} label={tag} active={activeBasic === tag} onSelect={selectBasic} />
          ))}
        </div>
      </div>

      <div>
        <p style={styles.cardDescription}>useCallback あり（ハンドラーをメモ化して不要な再レンダーを抑制）</p>
        <div style={styles.tagRow}>
          {TAGS.map((tag) => (
            <TagButton key={`memo-${tag}`} label={tag} active={activeOptimized === tag} onSelect={selectOptimized} />
          ))}
        </div>
      </div>
    </>
  );
};

export function UseMemoCallbackDemo() {
  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <p style={styles.kicker}>React hooks / useMemo & useCallback</p>
        <h1 style={styles.title}>useMemo と useCallback の実践メモ</h1>
        <p style={styles.lead}>
          useMemo は重い計算結果をメモ化し、依存値が変わらない限り再計算をスキップします。useCallback は関数の参照を安定化させ、メモ化した子コンポーネントの不要な再レンダーを防ぎます。
        </p>
      </header>

      <div style={styles.sectionGrid}>
        <SectionCard
          title="useMemo なし（毎回すべて再計算）"
          description="税率スライダーを動かすと、軽い入力操作でも全アイテム分の計算が実行されます。render バッジの数値が増えやすい点に注目。"
        >
          <WithoutMemo />
        </SectionCard>

        <SectionCard
          title="useMemo あり（依存値が変わった時だけ計算）"
          description="同じ UI でも計算ロジックを useMemo で包むと、税率が変わったときだけ重い処理を走らせることができます。"
        >
          <WithMemo />
        </SectionCard>
      </div>

      <SectionCard
        title="useCallback で関数の参照を安定化"
        description="親コンポーネントで入力すると再レンダーされます。useCallback なしのボタンは毎回再レンダーされますが、useCallback ありの列は必要なボタンだけ再描画されます。"
      >
        <CallbackComparison />
      </SectionCard>

      <section style={styles.summarySection}>
        <ul style={styles.summaryList}>
          <li style={styles.summaryListItem}>
            useMemo は <code style={styles.codeInline}>const value = useMemo(() =&gt; heavyWork(dep), [dep])</code> のように使い、純粋関数の結果をキャッシュします。
          </li>
          <li style={styles.summaryListItem}>
            useCallback は <code style={styles.codeInline}>const handle = useCallback(() =&gt; doSomething(id), [id])</code> のように関数をメモ化し、React.memo した子に安定した参照を渡します。
          </li>
          <li style={styles.summaryListItem}>「毎レンダーで重い計算が走る」「子コンポーネントがやたら再レンダーされる」といった症状がある時に初めて導入を検討します。</li>
          <li style={styles.summaryListItem}>むやみに使うとコードが複雑になるため、依存配列の管理が容易な純粋計算・イベントハンドラーに限定するのがベストです。</li>
        </ul>
      </section>

      <nav style={styles.navCard}>
        <p style={styles.navTitle}>他の学習デモも確認する</p>
        <Link href="/examples/use-transition" style={styles.navLink}>
          useTransition の比較ページへ移動
        </Link>
        <Link href="/examples" style={styles.navLink}>
          Examples 一覧に戻る
        </Link>
      </nav>
    </main>
  );
}
