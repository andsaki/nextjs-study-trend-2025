"use client";

import Link from "next/link";
import { Text } from "@/src/design-system/components/Text";
import { Button } from "@/src/design-system/components";
import { colors, spacing, typography, radii, shadows } from "@/src/design-system/tokens";
import { ArrowRight, BookOpen, CheckSquare, Layers } from "lucide-react";
import type { CSSProperties } from "react";

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: colors.background.default,
    fontFamily: typography.fontFamily.base,
  },
  main: {
    maxWidth: spacing.layout.container.maxWidth,
    margin: "0 auto",
    padding: `${spacing.scale[16]} ${spacing.layout.container.paddingX}`,
    display: "flex",
    flexDirection: "column",
    gap: spacing.scale[16],
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: spacing.scale[8],
    padding: spacing.scale[12],
    borderRadius: radii.card.lg,
    border: `1px solid ${colors.border.subtle}`,
    backgroundImage: `linear-gradient(135deg, ${colors.background.paper}, ${colors.background.active})`,
    boxShadow: shadows.component.card,
  },
  heroContent: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.scale[4],
  },
  eyebrow: {
    ...typography.textStyle.overline,
    color: colors.brand.primary,
  },
  title: {
    ...typography.heading.h1,
    color: colors.text.primary,
    margin: 0,
    lineHeight: typography.lineHeight.tight,
  },
  subtitle: {
    ...typography.body.large,
    color: colors.text.secondary,
    margin: 0,
    maxWidth: "48ch",
  },
  heroActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: spacing.scale[3],
    alignItems: "center",
  },
  heroPrimaryLink: {
    display: "inline-flex",
  },
  heroSecondaryLink: {
    ...typography.body.base,
    color: colors.brand.primary,
    textDecoration: "none",
    fontWeight: typography.fontWeight.semibold,
  },
  heroStats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: spacing.scale[4],
  },
  statCard: {
    borderRadius: radii.card.md,
    border: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.default,
    padding: spacing.scale[4],
    boxShadow: shadows.component.card,
  },
  statValue: {
    ...typography.heading.h2,
    color: colors.text.primary,
    margin: 0,
  },
  statLabel: {
    ...typography.body.small,
    color: colors.text.secondary,
    margin: 0,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.scale[6],
  },
  sectionHeader: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.scale[2],
    maxWidth: "640px",
  },
  sectionTitle: {
    ...typography.heading.h2,
    color: colors.text.primary,
    margin: 0,
  },
  sectionDescription: {
    ...typography.body.large,
    color: colors.text.secondary,
    margin: 0,
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: spacing.scale[6],
  },
  card: {
    borderRadius: radii.card.md,
    border: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.paper,
    padding: spacing.card.padding.lg,
    boxShadow: shadows.component.card,
    display: "flex",
    flexDirection: "column",
    gap: spacing.scale[4],
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  iconWrapper: {
    width: "3rem",
    height: "3rem",
    borderRadius: radii.component.avatar,
    backgroundColor: colors.background.active,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.brand.primary,
  },
  cardTitle: {
    ...typography.heading.h3,
    color: colors.text.primary,
    margin: 0,
  },
  cardDescription: {
    ...typography.body.base,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed,
    margin: 0,
    flex: 1,
  },
  cardButton: {
    width: "100%",
  },
  trackGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: spacing.scale[6],
  },
  trackCard: {
    borderRadius: radii.card.md,
    border: `1px solid ${colors.border.subtle}`,
    padding: spacing.card.padding.lg,
    backgroundColor: colors.background.default,
    boxShadow: shadows.component.card,
    display: "flex",
    flexDirection: "column",
    gap: spacing.scale[4],
  },
  trackTitle: {
    ...typography.heading.h3,
    color: colors.text.primary,
    margin: 0,
  },
  trackDescription: {
    ...typography.body.base,
    color: colors.text.secondary,
    margin: 0,
  },
  trackHighlights: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: spacing.scale[2],
  },
  trackHighlightItem: {
    display: "flex",
    alignItems: "center",
    gap: spacing.scale[2],
    color: colors.text.secondary,
    fontSize: typography.body.base.fontSize,
  },
  trackDot: {
    width: "0.5rem",
    height: "0.5rem",
    borderRadius: radii.component.badge,
    backgroundColor: colors.brand.primary,
    flexShrink: 0,
  },
  resourcesSection: {
    borderRadius: radii.card.lg,
    border: `1px solid ${colors.border.subtle}`,
    padding: spacing.scale[10],
    backgroundColor: colors.background.paper,
    boxShadow: shadows.component.card,
    display: "flex",
    flexDirection: "column",
    gap: spacing.scale[6],
  },
  resourcesList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: spacing.scale[4],
  },
  resourceLink: {
    textDecoration: "none",
  },
  resourceCard: {
    borderRadius: radii.card.md,
    border: `1px solid ${colors.border.default}`,
    padding: spacing.scale[4],
    backgroundColor: colors.background.default,
    minHeight: "160px",
    display: "flex",
    flexDirection: "column",
    gap: spacing.scale[2],
  },
  resourceMeta: {
    ...typography.textStyle.overline,
    color: colors.text.secondary,
  },
  resourceTitle: {
    ...typography.heading.h4,
    color: colors.text.primary,
    margin: 0,
  },
  resourceDescription: {
    ...typography.body.base,
    color: colors.text.secondary,
    margin: 0,
    flex: 1,
  },
  resourceAction: {
    ...typography.body.small,
    color: colors.brand.primary,
    fontWeight: typography.fontWeight.semibold,
  },
} satisfies Record<string, CSSProperties>;

const features = [
  {
    icon: <BookOpen size={24} />,
    title: "Examples",
    description: "実装例とデモのコレクション。フォーム、React Hooksの学習デモなど、実践的なサンプルコードを確認できます。",
    href: "/examples",
    buttonText: "Examples を見る",
  },
  {
    icon: <CheckSquare size={24} />,
    title: "Todos アプリ",
    description: "タスク管理アプリケーション。CRUD操作、状態管理、UIコンポーネントの実装例を体験できます。",
    href: "/todos",
    buttonText: "Todos を開く",
  },
];

const heroStats = [
  { value: "10+", label: "Examplesデモ" },
  { value: "5+", label: "学習モジュール" },
  { value: "2", label: "フルスタック実装" },
];

const tracks = [
  {
    title: "UI コンポーネント設計",
    description: "Typography・Spacing・Shadowなどのトークンを活用して、アクセシビリティ対応のコンポーネントを組み立てます。",
    highlights: ["デザインシステムの原則", "Story firstな開発", "ライト/ダーク考慮"],
  },
  {
    title: "状態管理 & Hooks",
    description: "React Hooksとカスタムフックでデータフローを整理。フォームやポイントなインタラクションを段階的に学べます。",
    highlights: ["フォームのバリデーション", "Server Actions", "Custom Hooks"],
  },
  {
    title: "フルスタック実装",
    description: "Todosアプリを通じてPrisma・API Routes・Playwrightを横断。Next.jsで完結する開発体験を掴みます。",
    highlights: ["Prisma & DB", "E2Eテスト", "UI/データ同期"],
  },
];

const resources = [
  {
    title: "Examples ワークショップ",
    description: "Hooksやフォームデモなど、即実行できる教材を一覧できます。",
    href: "/examples",
  },
  {
    title: "Todos ケーススタディ",
    description: "CRUD・状態管理・UI統合をまとめた実践的なサンプルです。",
    href: "/todos",
  },
];

export default function Home() {
  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <span style={styles.eyebrow}>Hands-on Next.js</span>
            <h1 style={styles.title}>Next.js 学習ラボ</h1>
            <p style={styles.subtitle}>
              デザインシステム、Reactのベストプラクティス、アクセシビリティを一つのリポジトリで横断。実践的なUIと
              フルスタック実装を組み合わせて学べます。
            </p>
            <div style={styles.heroActions}>
              <Link href="/examples" style={styles.heroPrimaryLink}>
                <Button variant="primary" size="lg" icon={<ArrowRight size={18} />}>
                  Examples を見る
                </Button>
              </Link>
              <Link href="/todos" style={styles.heroSecondaryLink}>
                Todos アプリを試す →
              </Link>
            </div>
          </div>
          <div style={styles.heroStats}>
            {heroStats.map((stat) => (
              <div key={stat.label} style={styles.statCard}>
                <p style={styles.statValue}>{stat.value}</p>
                <p style={styles.statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <Text variant="overline" color={colors.brand.primary}>
              FOUNDATION
            </Text>
            <h2 style={styles.sectionTitle}>学習の起点となるエリア</h2>
            <p style={styles.sectionDescription}>
              具体的なアプリやコンポーネントを触りながら、Next.jsのApp Router、デザインシステム、テスト戦略を一気に理解します。
            </p>
          </div>
          <div style={styles.featureGrid}>
            {features.map((feature) => (
              <FeatureCard key={feature.href} {...feature} />
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <Text variant="overline" color={colors.brand.primary}>
              LEARNING TRACKS
            </Text>
            <h2 style={styles.sectionTitle}>目的別のラーニングパス</h2>
            <p style={styles.sectionDescription}>
              触りたいテーマに合わせて学習ルートを選択。Next.jsのアーキテクチャを分解しながら、段階的にスキルを積み上げます。
            </p>
          </div>
          <div style={styles.trackGrid}>
            {tracks.map((track) => (
              <TrackCard key={track.title} {...track} />
            ))}
          </div>
        </section>

        <section style={styles.resourcesSection}>
          <div style={styles.sectionHeader}>
            <Text variant="overline" color={colors.brand.primary}>
              QUICK ACCESS
            </Text>
            <h2 style={styles.sectionTitle}>よく使うリソース</h2>
            <p style={styles.sectionDescription}>
              ドキュメント、デモ、ケーススタディへすばやくアクセス。日々の開発中でも迷わずナビゲートできます。
            </p>
          </div>
          <div style={styles.resourcesList}>
            {resources.map((resource) => (
              <ResourceCard key={resource.href} {...resource} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  href,
  buttonText,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  buttonText: string;
}) {
  return (
    <article style={styles.card}>
      <div style={styles.iconWrapper}>{icon}</div>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardDescription}>{description}</p>
      <Link href={href}>
        <Button variant="primary" size="md" icon={<ArrowRight size={16} />} style={styles.cardButton}>
          {buttonText}
        </Button>
      </Link>
    </article>
  );
}

function TrackCard({
  title,
  description,
  highlights,
}: {
  title: string;
  description: string;
  highlights: string[];
}) {
  return (
    <article style={styles.trackCard}>
      <div>
        <h3 style={styles.trackTitle}>{title}</h3>
        <p style={styles.trackDescription}>{description}</p>
      </div>
      <ul style={styles.trackHighlights}>
        {highlights.map((highlight) => (
          <li key={highlight} style={styles.trackHighlightItem}>
            <span style={styles.trackDot} aria-hidden="true" />
            {highlight}
          </li>
        ))}
      </ul>
    </article>
  );
}

function ResourceCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} style={styles.resourceLink}>
      <article style={styles.resourceCard}>
        <span style={styles.resourceMeta}>RESOURCE</span>
        <h3 style={styles.resourceTitle}>{title}</h3>
        <p style={styles.resourceDescription}>{description}</p>
        <span style={styles.resourceAction}>詳しく見る →</span>
      </article>
    </Link>
  );
}
