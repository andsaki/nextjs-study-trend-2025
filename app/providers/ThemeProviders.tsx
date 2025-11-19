"use client";

import { ThemeProvider } from "@/src/design-system/theme/ThemeProvider";

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
