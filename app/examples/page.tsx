"use client";

import Link from "next/link";
import { Text } from "@/src/design-system/components/Text";
import { colors, spacing, radii } from "@/src/design-system/tokens";
import { useState } from "react";

const examples = [
  {
    title: "ログインフォーム",
    description: "React Hook Form + Zodを使用したログインフォームの実装例",
    href: "/examples/login",
    tags: ["Form", "Validation", "Zod"],
  },
  {
    title: "お問い合わせフォーム",
    description: "FormWithHook + useTransitionを使用した複雑なフォームの実装例",
    href: "/examples/contact",
    tags: ["Form", "useTransition", "FormWithHook"],
  },
  {
    title: "useTransition学習",
    description: "非ブロッキング状態更新によるUI応答性向上のデモ",
    href: "/examples/use-transition",
    tags: ["useTransition", "Performance", "React 18"],
  },
];

function ExampleCard({ example }: { example: typeof examples[0] }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={example.href}
      style={{
        textDecoration: "none",
        color: "inherit",
        border: `1px solid ${isHovered ? colors.brand.primary : colors.border.default}`,
        borderRadius: radii.card.md,
        padding: spacing.scale[6],
        transition: "all 0.2s ease-in-out",
        display: "block",
        boxShadow: isHovered ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Text variant="h3" color={colors.brand.primary} style={{ marginBottom: spacing.scale[3] }}>
        {example.title}
      </Text>
      <Text variant="body" color={colors.text.secondary} style={{ marginBottom: spacing.scale[4] }}>
        {example.description}
      </Text>
      <div style={{ display: "flex", gap: spacing.scale[2], flexWrap: "wrap" }}>
        {example.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: "0.75rem",
              padding: `${spacing.scale[1]} ${spacing.scale[3]}`,
              backgroundColor: colors.background.active,
              color: colors.brand.primary,
              borderRadius: radii.component.badge,
              fontWeight: 500,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}

export default function ExamplesPage() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: spacing.scale[8] }}>
      <Text variant="h1" style={{ marginBottom: spacing.scale[4] }}>
        Examples
      </Text>
      <Text
        variant="body-large"
        color={colors.text.secondary}
        style={{ marginBottom: spacing.scale[12] }}
      >
        実装例とデモのコレクション
      </Text>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: spacing.scale[6],
        }}
      >
        {examples.map((example) => (
          <ExampleCard key={example.href} example={example} />
        ))}
      </div>

      <div
        style={{
          marginTop: spacing.scale[12],
          padding: spacing.scale[6],
          backgroundColor: colors.background.subtle,
          borderRadius: radii.card.md,
        }}
      >
        <Text variant="h4" style={{ marginBottom: spacing.scale[3] }}>
          📚 関連ドキュメント
        </Text>
        <ul style={{ paddingLeft: spacing.scale[6], lineHeight: 2 }}>
          <li>
            <Link
              href="/docs/adr"
              style={{ color: colors.brand.primary, textDecoration: "underline" }}
            >
              ADR (Architecture Decision Records)
            </Link>
          </li>
          <li>
            <Link href="/todos" style={{ color: colors.brand.primary, textDecoration: "underline" }}>
              Todosアプリ
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
