"use client";

import { useDeferredValue, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Text } from "@/src/design-system/components/Text";
import { colors, spacing, typography, radii, shadows } from "@/src/design-system/tokens";

const categories = ["すべて", "UI", "Performance", "Data", "AI", "Testing"] as const;

type Category = (typeof categories)[number];

const articles = Array.from({ length: 36 }, (_, index) => {
  const bucket = categories[(index % (categories.length - 1)) + 1] as Category;
  return {
    id: index + 1,
    title: `ケーススタディ #${index + 1}`,
    summary:
      index % 2 === 0
        ? "App Routerでの段階的データフェッチとUI遅延のバランスを検証。"
        : "入力を即時反映しつつ、重い計算をuseDeferredValueで遅延評価。",
    tag: bucket,
    updatedAt: `2024-${String((index % 9) + 1).padStart(2, "0")}-${String((index % 27) + 1).padStart(2, "0")}`,
  };
});

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
    display: "flex",
    flexDirection: "column",
    gap: spacing.scale[3],
    marginBottom: spacing.scale[4],
  },
  heroCard: {
    borderRadius: radii.card.lg,
    border: `1px solid ${colors.border.subtle}`,
    padding: spacing.scale[10],
    backgroundImage: `linear-gradient(135deg, ${colors.background.paper}, ${colors.background.active})`,
    boxShadow: shadows.component.card,
    display: "flex",
    flexDirection: "column",
    gap: spacing.scale[4],
  },
  controlPanel: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: spacing.scale[6],
    marginBottom: spacing.scale[4],
  },
  inputField: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.scale[2],
  },
  input: {
    width: "100%",
    borderRadius: radii.input.md,
    border: `1px solid ${colors.input.border}`,
    padding: `${spacing.input.paddingY.lg} ${spacing.input.paddingX.lg}`,
    fontSize: typography.body.large.fontSize,
    fontFamily: typography.fontFamily.base,
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },
  tagGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: spacing.scale[2],
  },
  tagButton: {
    borderRadius: radii.component.chip,
    border: `1px solid ${colors.border.subtle}`,
    padding: `${spacing.scale[1]} ${spacing.scale[3]}`,
    backgroundColor: colors.background.default,
    color: colors.text.secondary,
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontSize: typography.body.small.fontSize,
  },
  tagButtonActive: {
    backgroundColor: colors.brand.primary,
    color: colors.background.default,
    borderColor: colors.brand.primary,
  },
  statusPanel: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: spacing.scale[4],
  },
  statusCard: {
    borderRadius: radii.card.md,
    border: `1px solid ${colors.border.default}`,
    padding: spacing.scale[5],
    backgroundColor: colors.background.paper,
    boxShadow: shadows.component.card,
  },
  badge: {
    ...typography.textStyle.overline,
    color: colors.brand.primary,
  },
  listSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: spacing.scale[6],
  },
  card: {
    borderRadius: radii.card.md,
    border: `1px solid ${colors.border.default}`,
    padding: spacing.scale[5],
    backgroundColor: colors.background.paper,
    boxShadow: shadows.component.card,
    display: "flex",
    flexDirection: "column",
    gap: spacing.scale[3],
  },
  muted: {
    ...typography.body.small,
    color: colors.text.secondary,
  },
} satisfies Record<string, CSSProperties>;

const heavyFilter = (keyword: string, tag: Category) => {
  const normalized = keyword.trim().toLowerCase();
  // simulate heavy CPU filter
  if (typeof window !== "undefined") {
    const start = performance.now();
    while (performance.now() - start < 140) {
      // busy loop
    }
  }

  return articles.filter((article) => {
    const matchesKeyword =
      normalized.length === 0 ||
      article.title.toLowerCase().includes(normalized) ||
      article.summary.toLowerCase().includes(normalized);

    const matchesTag = tag === "すべて" || article.tag === tag;
    return matchesKeyword && matchesTag;
  });
};

export function UseDeferredValueDemo() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<Category>("すべて");
  const deferredKeyword = useDeferredValue(keyword);

  const filteredArticles = useMemo(() => heavyFilter(deferredKeyword, category), [deferredKeyword, category]);
  const isStale = deferredKeyword !== keyword;

  return (
    <div style={styles.main}>
      <header style={styles.header}>
        <span style={styles.badge}>RESPONSIVE SEARCH</span>
        <Text variant="h1">useDeferredValueで作る知識ベース検索</Text>
        <Text variant="body-large" color={colors.text.secondary}>
          入力は即時反応させつつ、重いフィルタリング処理は遅延させることでUXを損なわずにパフォーマンスを確保します。
        </Text>
      </header>

      <section style={styles.heroCard}>
        <div style={styles.controlPanel}>
          <div style={styles.inputField}>
            <Text variant="overline" color={colors.text.secondary}>
              キーワード
            </Text>
            <input
              type="search"
              placeholder="例: Suspense, App Router..."
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              style={styles.input}
            />
            <Text variant="body-small" color={colors.text.secondary}>
              入力値は即座に表示に反映されますが、実際のフィルタリングは遅延させています。
            </Text>
          </div>

          <div>
            <Text variant="overline" color={colors.text.secondary} style={{ marginBottom: spacing.scale[2] }}>
              カテゴリー
            </Text>
            <div style={styles.tagGroup}>
              {categories.map((tag) => {
                const active = tag === category;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setCategory(tag)}
                    style={{ ...styles.tagButton, ...(active ? styles.tagButtonActive : {}) }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={styles.statusPanel}>
          <div style={styles.statusCard} aria-live="polite">
            <Text variant="overline" color={colors.text.secondary}>
              現在の入力
            </Text>
            <Text variant="h3">{keyword || "（未入力）"}</Text>
            <Text variant="body" color={colors.text.secondary}>
              用户入力は即時で表示、deferred状態かどうかをトグルで確認できます。
            </Text>
          </div>
          <div style={styles.statusCard}>
            <Text variant="overline" color={colors.text.secondary}>
              useDeferredValueに渡されている値
            </Text>
            <Text variant="h3">{deferredKeyword || "（未入力）"}</Text>
            <Text variant="body" color={colors.text.secondary}>
              {isStale
                ? "重い再計算中…描画が終わり次第この値も追いつきます。"
                : "最新の入力と同期済みです。"}
            </Text>
          </div>
          <div style={styles.statusCard}>
            <Text variant="overline" color={colors.text.secondary}>
              レンダリング状態
            </Text>
            <Text variant="h3" color={isStale ? colors.feedback.warning.text : colors.feedback.success.text}>
              {isStale ? "遅延反映中" : "同期済み"}
            </Text>
            <Text variant="body" color={colors.text.secondary}>
              ここでは意図的にCPU負荷をかけ、検索が重いケースでの体験を再現しています。
            </Text>
          </div>
        </div>
      </section>

      <section>
        <div style={{ marginBottom: spacing.scale[4], display: "flex", justifyContent: "space-between" }}>
          <Text variant="h2">検索結果（{filteredArticles.length}件）</Text>
          {isStale && (
            <span style={{ ...styles.muted, color: colors.feedback.warning.text }}>再計算中...</span>
          )}
        </div>

        <div style={styles.listSection}>
          {filteredArticles.map((article) => (
            <article key={article.id} style={styles.card}>
              <Text variant="overline" color={colors.brand.primary}>
                {article.tag}
              </Text>
              <Text variant="h4">{article.title}</Text>
              <Text variant="body" color={colors.text.secondary}>
                {article.summary}
              </Text>
              <Text variant="body-small" color={colors.text.secondary}>
                最終更新: {article.updatedAt}
              </Text>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
