"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Loading, Modal } from "@/src/design-system/components";
import { Plus, Search as SearchIcon } from "lucide-react";
import { SearchForm } from "./SearchForm";
import { TodoList } from "./TodoList";
import { useTodos, useUpdateTodo, useDeleteTodo } from "@/lib/hooks/useTodos";
import { useTodoSearchStore } from "@/lib/store/useTodoSearchStore";
import { useToastStore } from "@/lib/store/useToastStore";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";
import { ConfirmModal } from "@/app/components/ConfirmModal";
import type { TodoSearchParams } from "@/lib/api/todos";
import type { Todo } from "@/lib/types/todo";
import styles from "./page.module.css";

/**
 * ローディングフォールバック
 */
function TodosLoadingFallback() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "3rem",
      }}
    >
      <Loading size="lg" />
      <p style={{ marginTop: "1rem", color: "#9e9e9e" }}>読み込み中...</p>
    </div>
  );
}

/**
 * エラーバウンダリフォールバック
 */
function TodosErrorFallback({ error }: { error: Error }) {
  return (
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
  );
}

/**
 * Todoリストコンテンツ（Suspense内で使用）
 */
function TodosContent({ searchParams }: { searchParams: TodoSearchParams }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Todo | null>(null);
  const { success, error: showError } = useToastStore();

  // Suspense対応フック（isLoading, errorは不要）
  const { data: todos } = useTodos(searchParams);
  const updateMutation = useUpdateTodo();
  const deleteMutation = useDeleteTodo();

  const handleDeleteClick = (todo: Todo) => {
    setDeleteTarget(todo);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
        success(`「${deleteTarget.title}」を削除しました`, "削除完了");
      },
      onError: (error) => {
        showError(`削除に失敗しました: ${error.message}`, "エラー");
      },
    });
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    const todo = todos.find((t) => t.id === id);
    updateMutation.mutate(
      { id, data: { completed } },
      {
        onSuccess: () => {
          success(
            completed ? `「${todo?.title}」を完了にしました` : `「${todo?.title}」を未完了に戻しました`,
            completed ? "完了" : "未完了"
          );
        },
        onError: (error) => {
          showError(`更新に失敗しました: ${error.message}`, "エラー");
        },
      }
    );
  };

  const handleEdit = (id: string) => {
    router.push(`/todos/${id}/edit`);
  };

  const handleViewDetail = (id: string) => {
    router.push(`/todos/${id}`);
  };

  return (
    <>
      <TodoList
        todos={todos}
        onDelete={handleDeleteClick}
        onEdit={(todo) => handleEdit(todo.id)}
        onToggleComplete={handleToggleComplete}
        onViewDetail={(todo) => handleViewDetail(todo.id)}
        isDeleting={deleteMutation.isPending}
        isUpdating={updateMutation.isPending}
      />

      {/* 削除確認モーダル */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Todoを削除"
        message={`「${deleteTarget?.title}」を削除しますか？`}
        confirmLabel="削除"
        cancelLabel="キャンセル"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* 統計情報 */}
      {todos.length > 0 && (
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <div className={`${styles.statValue} ${styles.total}`}>{todos.length}</div>
            <div className={styles.statLabel}>全体</div>
          </div>
          <div className={styles.statItem}>
            <div className={`${styles.statValue} ${styles.completed}`}>{todos.filter((t) => t.completed).length}</div>
            <div className={styles.statLabel}>完了</div>
          </div>
          <div className={styles.statItem}>
            <div className={`${styles.statValue} ${styles.incomplete}`}>{todos.filter((t) => !t.completed).length}</div>
            <div className={styles.statLabel}>未完了</div>
          </div>
        </div>
      )}
    </>
  );
}

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
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

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

    // モバイルモーダルを閉じる
    setIsMobileModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* ヘッダー */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Todo一覧</h1>
            <p>Todo管理システム - 一覧・検索・フィルター</p>
          </div>
          <div className={styles.headerActions}>
            <Button
              variant="outline"
              size="lg"
              icon={<SearchIcon size={20} />}
              onClick={() => {
                toggleShowSearch();
                setIsMobileModalOpen(!isMobileModalOpen);
              }}
            >
              検索
            </Button>
            <Button variant="primary" size="lg" icon={<Plus size={20} />} onClick={() => router.push("/todos/new")}>
              新規作成
            </Button>
          </div>
        </div>

        {/* 検索フォーム（PC: インライン、Mobile: モーダル） */}
        <Modal
          isOpen={isMobileModalOpen}
          onClose={() => {
            setIsMobileModalOpen(false);
            setShowSearch(false);
          }}
          title="検索・フィルター"
          size="md"
        >
          <SearchForm onSearch={handleSearch} defaultValues={searchParams} />
        </Modal>

        {showSearch && (
          <div className={styles.searchFormWrapper}>
            <SearchForm onSearch={handleSearch} defaultValues={searchParams} />
          </div>
        )}

        {/* Todoリスト（Suspense + ErrorBoundary対応） */}
        <ErrorBoundary fallback={(error) => <TodosErrorFallback error={error} />}>
          <Suspense fallback={<TodosLoadingFallback />}>
            <TodosContent searchParams={searchParams} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
