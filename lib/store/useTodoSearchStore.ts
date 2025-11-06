import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { TodoSearchParams } from "@/lib/api/todos";

interface TodoSearchState {
  // 検索パラメータ
  searchParams: TodoSearchParams;

  // UI状態
  showSearch: boolean;

  // アクション
  setSearchParams: (params: TodoSearchParams) => void;
  updateSearchParam: <K extends keyof TodoSearchParams>(
    key: K,
    value: TodoSearchParams[K]
  ) => void;
  resetSearchParams: () => void;
  toggleShowSearch: () => void;
  setShowSearch: (show: boolean) => void;
}

const defaultSearchParams: TodoSearchParams = {
  sortBy: "createdAt",
  sortOrder: "desc",
};

export const useTodoSearchStore = create<TodoSearchState>()(
  devtools(
    persist(
      (set) => ({
        // 初期状態
        searchParams: defaultSearchParams,
        showSearch: false,

        // 検索パラメータを一括設定
        setSearchParams: (params) =>
          set({ searchParams: params }, false, "setSearchParams"),

        // 特定の検索パラメータを更新
        updateSearchParam: (key, value) =>
          set(
            (state) => ({
              searchParams: { ...state.searchParams, [key]: value },
            }),
            false,
            "updateSearchParam"
          ),

        // 検索パラメータをリセット
        resetSearchParams: () =>
          set({ searchParams: defaultSearchParams }, false, "resetSearchParams"),

        // 検索フォームの表示/非表示をトグル
        toggleShowSearch: () =>
          set((state) => ({ showSearch: !state.showSearch }), false, "toggleShowSearch"),

        // 検索フォームの表示/非表示を設定
        setShowSearch: (show) =>
          set({ showSearch: show }, false, "setShowSearch"),
      }),
      {
        name: "todo-search-storage",
        // URLパラメータと同期するので、検索パラメータは永続化しない
        partialize: (state) => ({ showSearch: state.showSearch }),
      }
    )
  )
);
