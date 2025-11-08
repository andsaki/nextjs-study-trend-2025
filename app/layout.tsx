import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "./providers/QueryProvider";
import { BreadcrumbNav } from "./components/BreadcrumbNav";
import { ToastContainer } from "./components/ToastContainer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js Study - 2025 Trend Stack",
  description: "Modern Next.js 14 app with TanStack Query, Zustand, React Hook Form, Zod, Vitest, and Playwright",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <BreadcrumbNav />
          {children}
          <ToastContainer />
        </QueryProvider>
      </body>
    </html>
  );
}
