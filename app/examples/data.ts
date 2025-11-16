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
};

export type ExamplesData = typeof examplesData;
