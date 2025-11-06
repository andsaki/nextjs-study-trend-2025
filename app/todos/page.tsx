"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/src/design-system/components";
import { Plus, Search as SearchIcon } from "lucide-react";
import { SearchForm } from "./SearchForm";
import { TodoList } from "./TodoList";
import { useTodos, useUpdateTodo, useDeleteTodo } from "@/lib/hooks/useTodos";
import { useTodoSearchStore } from "@/lib/store/useTodoSearchStore";
import type { TodoSearchParams } from "@/lib/api/todos";

/**
 * Todoリストページ
 *
 * 責務:
 * - Todo一覧の表示
 * - 検索・フィルター・ソート
 * - 完了状態のトグル
 * - 削除
 * - 他のページへのナビゲーション
 */
export default function TodosPage() {
  const router = useRouter();
  const searchParamsFromUrl = useSearchParams();

  // Zustand store
  const {
    searchParams,
    showSearch,
    setSearchParams,
    setShowSearch,
    toggleShowSearch,
  } = useTodoSearchStore();

  // URLからクエリパラメータを読み込み、Zustand storeに反映
  useEffect(() => {
    const params: TodoSearchParams = {};
    const q = searchParamsFromUrl.get("q");
    const completed = searchParamsFromUrl.get("completed");
    const priority = searchParamsFromUrl.get("priority");
    const sortBy = searchParamsFromUrl.get("sortBy");
    const sortOrder = searchParamsFromUrl.get("sortOrder");

    if (q) params.q = q;
    if (completed === "true") params.completed = true;
    if (completed === "false") params.completed = false;
    if (priority && ["low", "medium", "high"].includes(priority)) {
      params.priority = priority as "low" | "medium" | "high";
    }
    if (sortBy) params.sortBy = sortBy as "createdAt" | "updatedAt" | "title" | "priority";
    if (sortOrder) params.sortOrder = sortOrder as "asc" | "desc";

    // Zustand storeに保存
    setSearchParams(params);

    // クエリパラメータがある場合は検索フォームを表示
    if (Object.keys(params).length > 0) {
      setShowSearch(true);
    }
  }, [searchParamsFromUrl, setSearchParams, setShowSearch]);

  // TanStack Query hooks
  const { data: todos = [], isLoading, error } = useTodos(searchParams);
  const updateMutation = useUpdateTodo();
  const deleteMutation = useDeleteTodo();

  const handleSearch = (params: TodoSearchParams) => {
    // Zustand storeに保存
    setSearchParams(params);

    // URLクエリパラメータを更新
    const urlParams = new URLSearchParams();
    if (params.q) urlParams.set("q", params.q);
    if (params.completed !== undefined) urlParams.set("completed", String(params.completed));
    if (params.priority) urlParams.set("priority", params.priority);
    if (params.sortBy) urlParams.set("sortBy", params.sortBy);
    if (params.sortOrder) urlParams.set("sortOrder", params.sortOrder);

    router.push(`/todos?${urlParams.toString()}`);
  };

  const handleDelete = (id: string) => {
    if (confirm("このTodoを削除しますか？")) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    updateMutation.mutate({ id, data: { completed } });
  };

  const handleEdit = (id: string) => {
    router.push(`/todos/${id}/edit`);
  };

  const handleViewDetail = (id: string) => {
    router.push(`/todos/${id}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fafafa",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: "#212121",
                marginBottom: "0.5rem",
              }}
            >
              Todo一覧
            </h1>
            <p style={{ color: "#757575", fontSize: "0.875rem" }}>
              Todo管理システム - 一覧・検索・フィルター
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button
              variant="outline"
              size="lg"
              icon={<SearchIcon size={20} />}
              onClick={toggleShowSearch}
            >
              {showSearch ? "検索を閉じる" : "検索"}
            </Button>
            <Button
              variant="primary"
              size="lg"
              icon={<Plus size={20} />}
              onClick={() => router.push("/todos/new")}
            >
              新規作成
            </Button>
          </div>
        </div>

        {/* 検索フォーム */}
        {showSearch && (
          <div style={{ marginBottom: "2rem" }}>
            <SearchForm onSearch={handleSearch} defaultValues={searchParams} />
          </div>
        )}

        {/* ローディング状態 */}
        {isLoading && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "#9e9e9e",
            }}
          >
            読み込み中...
          </div>
        )}

        {/* エラー状態 */}
        {error && (
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#ffebee",
              color: "#c62828",
              borderRadius: "8px",
              marginBottom: "2rem",
            }}
          >
            エラーが発生しました: {error.message}
          </div>
        )}

        {/* Todoリスト */}
        {!isLoading && !error && (
          <>
            <TodoList
              todos={todos}
              onDelete={handleDelete}
              onEdit={(todo) => handleEdit(todo.id)}
              onToggleComplete={handleToggleComplete}
              onViewDetail={(todo) => handleViewDetail(todo.id)}
              isDeleting={deleteMutation.isPending}
              isUpdating={updateMutation.isPending}
            />

            {/* 統計情報 */}
            {todos.length > 0 && (
              <div
                style={{
                  marginTop: "2rem",
                  padding: "1rem",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  display: "flex",
                  gap: "2rem",
                  justifyContent: "center",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#2196f3" }}>
                    {todos.length}
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#757575" }}>全体</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#4caf50" }}>
                    {todos.filter((t) => t.completed).length}
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#757575" }}>完了</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#ff9800" }}>
                    {todos.filter((t) => !t.completed).length}
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#757575" }}>未完了</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
