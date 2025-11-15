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
};

export type ExamplesData = typeof examplesData;
