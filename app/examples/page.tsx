"use client";

import Link from "next/link";
import { useState } from "react";
import { Text } from "@/src/design-system/components/Text";
import { colors, spacing, radii } from "@/src/design-system/tokens";
import { examplesData } from "./data";

type Example = {
  title: string;
  description: string;
  tags: string[];
  href: string;
};

const exampleList: Example[] = Object.entries(examplesData).map(([slug, meta]) => ({
  ...meta,
  href: `/examples/${slug}`,
}));

function ExampleCard({ example }: { example: Example }) {
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
        {exampleList.map((example) => (
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
