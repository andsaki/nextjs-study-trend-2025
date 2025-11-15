"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import type { ChangeEvent, CSSProperties, ReactNode } from "react";
import { colors, spacing, typography, radii, shadows } from "@/src/design-system/tokens";

const USERS = Array.from({ length: 2000 }, (_, index) => ({
  id: index + 1,
  name: `ユーザー ${index + 1}`,
  email: `user${index + 1}@example.com`,
}));

const slowFilter = (keyword: string) => {
  const trimmed = keyword.trim().toLowerCase();
  if (!trimmed) {
    return USERS;
  }

  if (typeof window !== "undefined") {
    const start = performance.now();
    while (performance.now() - start < 160) {
      // busy loop
    }
  }

  return USERS.filter((user) => user.name.toLowerCase().includes(trimmed));
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
    backgroundColor: colors.background.default,
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
    gap: spacing.scale[1],
  },
  headerTitle: {
    ...typography.heading.h2,
    color: colors.text.primary,
    marginBottom: spacing.scale[3],
  },
  headerLead: {
    ...typography.body.large,
    color: colors.text.secondary,
    margin: 0,
    maxWidth: "65ch",
  },
  sections: {
    display: "flex",
    gap: spacing.scale[6],
    flexWrap: "wrap",
  },
  sectionCard: {
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
  sectionTitle: {
    ...typography.heading.h5,
    color: colors.text.primary,
    margin: 0,
  },
  sectionDescription: {
    ...typography.body.base,
    color: colors.text.secondary,
    margin: 0,
  },
  label: {
    display: "block",
    ...typography.body.base,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.scale[2],
    color: colors.text.primary,
  },
  input: {
    width: "100%",
    borderRadius: radii.input.md,
    border: `1px solid ${colors.input.border}`,
    padding: `${spacing.input.paddingY.md} ${spacing.input.paddingX.md}`,
    fontSize: typography.body.base.fontSize,
    fontFamily: typography.fontFamily.base,
    color: colors.input.text,
    backgroundColor: colors.input.bg,
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    boxShadow: shadows.boxShadow.none,
  },
  pendingText: {
    ...typography.body.small,
    color: colors.text.secondary,
    marginTop: spacing.scale[2],
  },
  resultList: {
    borderRadius: radii.card.sm,
    border: `1px solid ${colors.border.subtle}`,
    backgroundColor: colors.background.paper,
    padding: spacing.card.padding.sm,
    marginTop: spacing.scale[4],
    minHeight: "12rem",
  },
  resultMeta: {
    ...typography.body.small,
    color: colors.text.secondary,
    margin: 0,
    marginBottom: spacing.scale[2],
  },
  resultItems: {
    maxHeight: "15rem",
    overflow: "auto",
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  resultItem: {
    ...typography.body.base,
    color: colors.text.primary,
    padding: `${spacing.scale[2]} 0`,
    borderBottom: `1px solid ${colors.border.subtle}`,
  },
  resultNote: {
    ...typography.body.small,
    color: colors.text.secondary,
    marginTop: spacing.scale[2],
  },
  summarySection: {
    backgroundColor: colors.background.paper,
    borderRadius: radii.card.md,
    padding: spacing.card.padding.md,
    border: `1px solid ${colors.border.default}`,
    boxShadow: shadows.component.card,
    lineHeight: typography.lineHeight.relaxed,
  },
  summaryTitle: {
    ...typography.heading.h4,
    color: colors.text.primary,
    margin: 0,
    marginBottom: spacing.scale[3],
  },
  summaryList: {
    paddingLeft: spacing.scale[5],
    margin: 0,
    listStyle: "disc",
  },
  summaryListItem: {
    ...typography.body.base,
    color: colors.text.primary,
    marginBottom: spacing.scale[2],
  },
  summaryCode: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    backgroundColor: colors.background.subtle,
    borderRadius: radii.borderRadius.sm,
    padding: `0 ${spacing.scale[1]}`,
    display: "inline-block",
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

const Section = ({ title, description, children }: { title: string; description: string; children: ReactNode }) => (
  <section style={styles.sectionCard}>
    <h2 style={styles.sectionTitle}>{title}</h2>
    <p style={styles.sectionDescription}>{description}</p>
    {children}
  </section>
);

const ResultList = ({ items, pending }: { items: typeof USERS; pending?: boolean }) => {
  const listItems = items.slice(0, 50);
  const lastIndex = listItems.length - 1;

  return (
    <div style={styles.resultList}>
      {pending ? (
        <p style={styles.resultMeta}>リストを更新しています...</p>
      ) : (
        <>
          <p style={styles.resultMeta}>
            表示件数: <strong>{items.length}</strong>
          </p>
          <ul style={styles.resultItems}>
            {listItems.map((user, index) => {
              const itemStyle = index === lastIndex ? { ...styles.resultItem, borderBottom: "none" } : styles.resultItem;
              return (
                <li key={user.id} style={itemStyle}>
                  {user.name} ({user.email})
                </li>
              );
            })}
          </ul>
          {items.length > listItems.length && <p style={styles.resultNote}>※ 先頭50件のみ表示しています</p>}
        </>
      )}
    </div>
  );
};

const BlockingSearch = () => {
  const [keyword, setKeyword] = useState("");
  const results = useMemo(() => slowFilter(keyword), [keyword]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  return (
    <>
      <label style={styles.label}>キーワード（すべて同期的に処理）</label>
      <input value={keyword} onChange={handleChange} placeholder="例: 500" style={styles.input} />
      <ResultList items={results} />
    </>
  );
};

const TransitionSearch = () => {
  const [immediateValue, setImmediateValue] = useState("");
  const [deferredValue, setDeferredValue] = useState("");
  const [isPending, startTransition] = useTransition();

  const results = useMemo(() => slowFilter(deferredValue), [deferredValue]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setImmediateValue(nextValue);
    startTransition(() => {
      setDeferredValue(nextValue);
    });
  };

  return (
    <>
      <label style={styles.label}>キーワード（入力を優先、検索は遅延）</label>
      <input value={immediateValue} onChange={handleChange} placeholder="例: 500" style={styles.input} />
      <p style={styles.pendingText}>
        {isPending ? "入力は優先しつつ、重たい検索処理はバックグラウンドで進行中..." : "検索処理が完了するとここに結果が反映されます"}
      </p>
      <ResultList items={results} pending={isPending} />
    </>
  );
};

export default function UseTransitionExamplePage() {
  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <p style={styles.kicker}>React 18 hooks / useTransition</p>
        <h1 style={styles.headerTitle}>useTransition の学習メモ</h1>
        <p style={styles.headerLead}>
          useTransition はユーザーから見て優先度の低い更新を遅延させ、入力フィールドなど高優先度の UI を滑らかに保つためのフックです。以下では従来のブロッキングな処理と
          useTransition を使った非ブロッキングな処理を比較します。
        </p>
      </header>

      <div style={styles.sections}>
        <Section
          title="ブロッキングな検索"
          description="入力値と重たい計算を同じタイミングで更新しているため、検索が完了するまで入力自体が引っかかります。"
        >
          <BlockingSearch />
        </Section>

        <Section
          title="useTransition で優先順位を分離"
          description="入力値はすぐに状態を更新し、その後の重たい計算だけを transition 内で遅延させることで体感を改善します。"
        >
          <TransitionSearch />
        </Section>
      </div>

      <section style={styles.summarySection}>
        <h2 style={styles.summaryTitle}>ポイントまとめ</h2>
        <ul style={styles.summaryList}>
          <li style={styles.summaryListItem}>
            useTransition は <code style={styles.summaryCode}>[isPending, startTransition]</code> の 2 要素を返し、低優先度の更新を{" "}
            <code style={styles.summaryCode}>startTransition(() =&gt; setState())</code> で包みます。
          </li>
          <li style={styles.summaryListItem}>
            <code style={styles.summaryCode}>isPending</code> を使うとローディング表示や「バックグラウンド更新中」の案内を簡単に実装できます。
          </li>
          <li style={styles.summaryListItem}>
            フォーム入力やスクロールなど即時性が重要な処理と、検索・フィルターといった重たい処理の優先順位を分けると UX が向上します。
          </li>
          <li style={styles.summaryListItem}>
            あらゆる更新を transition にする必要はなく、CPU バウンドな処理や巨大なレンダリングに限定して使うのがベストです。
          </li>
        </ul>
      </section>

      <nav style={styles.navCard}>
        <p style={styles.navTitle}>他の学習デモも確認する</p>
        <Link href="/examples/use-memo-use-callback" style={styles.navLink}>
          useMemo & useCallback の比較ページへ移動
        </Link>
        <Link href="/examples" style={styles.navLink}>
          Examples 一覧に戻る
        </Link>
      </nav>
    </main>
  );
}
