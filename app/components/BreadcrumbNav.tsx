"use client";

import { usePathname } from "next/navigation";
import { Breadcrumbs, BreadcrumbList, BreadcrumbItem, BreadcrumbLink } from "@/src/design-system/components";

interface BreadcrumbItem {
  label: string;
  href: string;
}

/**
 * パンくずリストコンポーネント
 * パスに基づいて自動的にパンくずリストを生成
 */
export function BreadcrumbNav() {
  const pathname = usePathname();

  // パスからパンくずリストを生成
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: "ホーム", href: "/" }];

    let currentPath = "";
    for (let i = 0; i < paths.length; i++) {
      currentPath += `/${paths[i]}`;

      // ラベルをカスタマイズ
      let label = paths[i];
      if (paths[i] === "todos") {
        label = "Todo管理";
      } else if (paths[i] === "new") {
        label = "新規作成";
      } else if (paths[i] === "edit") {
        label = "編集";
      } else if (i > 0 && paths[i - 1] === "todos" && paths[i] !== "new") {
        // IDの場合は「詳細」と表示
        label = "詳細";
      }

      breadcrumbs.push({ label, href: currentPath });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // ホームページでは表示しない
  if (pathname === "/") {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e0e0e0",
        padding: "0.75rem 2rem",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Breadcrumbs label="ページナビゲーション">
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <BreadcrumbItem key={item.href} isCurrent={isLast}>
                  {isLast ? (
                    <span>{item.label}</span>
                  ) : (
                    <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumbs>
      </div>
    </div>
  );
}
