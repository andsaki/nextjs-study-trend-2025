type ExampleInfo = {
  title: string;
  description: string;
  tags: string[];
};

export const examplesData: Record<string, ExampleInfo> = {
  login: {
    title: "ログインフォーム",
    description: "React Hook Form + Zodでバリデーションを行う基本的なログインフォーム。",
    tags: ["Form", "Validation", "Zod"],
  },
  contact: {
    title: "お問い合わせフォーム",
    description: "useTransitionとトースト通知を組み合わせた複雑なフォーム処理。",
    tags: ["Form", "useTransition", "FormWithHook"],
  },
  "use-transition": {
    title: "useTransition学習",
    description: "非ブロッキング状態更新を体験しながらリストフィルタ処理を最適化。",
    tags: ["useTransition", "Performance", "React 18"],
  },
  "use-memo-use-callback": {
    title: "useMemo & useCallback学習",
    description: "メモ化による再計算・再レンダー最適化を可視化するデモ。",
    tags: ["useMemo", "useCallback", "Performance"],
  },
  "use-deferred-value": {
    title: "useDeferredValue検索",
    description: "重いリストフィルターを遅延させてUIレスポンスを保つ検索インターフェース。",
    tags: ["useDeferredValue", "Suspense", "Performance"],
  },
  "server-actions-optimistic": {
    title: "Server Actions + Optimistic UI",
    description: "サーバーアクションを用いたタスク登録とuseOptimisticによる即時UI反映。",
    tags: ["Server Actions", "useOptimistic", "App Router"],
  },
  "flight-payload-demo": {
    title: "App Router & Flight Payload",
    description: "クライアント側画面遷移がCSRではない理由を実際に体験できるデモ。",
    tags: ["App Router", "RSC", "Flight Payload"],
  },
  "hooks-memo-verification": {
    title: "Hooks & Memo 検証ページ",
    description: "useMemo、useCallback、React.memoの挙動を実際に確認できる検証ページ。",
    tags: ["useMemo", "useCallback", "React.memo", "Performance"],
  },
  "build-vs-tsc": {
    title: "Build vs TSC",
    description: "npm run build と tsc の違いを理解するための解説ページ。",
    tags: ["TypeScript", "Build", "Documentation"],
  },
  "rsc-react-query-hybrid": {
    title: "RSC + React Query ハイブリッド",
    description: "Server ComponentとReact Queryを組み合わせた最強パターンの実装例。",
    tags: ["RSC", "React Query", "Hybrid", "Performance"],
  },
  "react-query-vs-swr": {
    title: "React Query vs SWR 比較デモ",
    description: "実際のコードで両者の違いを体験できる比較デモ。mutation管理、検索パラメータ、キャッシュ無効化を実装例で理解。",
    tags: ["React Query", "SWR", "Comparison", "Data Fetching"],
  },
};

export type ExamplesData = typeof examplesData;
