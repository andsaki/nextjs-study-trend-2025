"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/design-system/components";
import { ArrowLeft } from "lucide-react";
import { TodoForm } from "../../TodoForm";
import { useTodo, useUpdateTodo } from "@/lib/hooks/useTodos";
import { useToastStore } from "@/lib/store/useToastStore";
import type { CreateTodoInput } from "@/lib/types/todo";

/**
 * Todo編集ページ
 *
 * 責務:
 * - 既存Todoの編集
 * - フォームバリデーション
 * - 更新後の詳細ページへのリダイレクト
 */
export default function TodoEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { data: todo, isLoading, error } = useTodo(id);
  const updateMutation = useUpdateTodo();
  const { success, error: showError } = useToastStore();

  const handleSubmit = (data: CreateTodoInput) => {
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          success(`「${data.title}」を更新しました`, "更新完了");
          router.push(`/todos/${id}`);
        },
        onError: (error) => {
          showError(`更新に失敗しました: ${error.message}`, "エラー");
        },
      }
    );
  };

  const handleCancel = () => {
    router.push(`/todos/${id}`);
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#fafafa",
          padding: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", color: "#9e9e9e" }}>読み込み中...</div>
      </div>
    );
  }

  if (error || !todo) {
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
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#ffebee",
              color: "#c62828",
              borderRadius: "8px",
              marginBottom: "2rem",
            }}
          >
            {error ? `エラー: ${error.message}` : "Todoが見つかりません"}
          </div>
          <Button
            variant="outline"
            size="md"
            icon={<ArrowLeft size={16} />}
            onClick={() => router.push("/todos")}
          >
            一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

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
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            marginBottom: "2rem",
          }}
        >
          <Button
            variant="outline"
            size="md"
            icon={<ArrowLeft size={16} />}
            onClick={() => router.push(`/todos/${params.id}`)}
            style={{ marginBottom: "1rem" }}
          >
            詳細に戻る
          </Button>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#212121",
              marginBottom: "0.5rem",
            }}
          >
            Todoを編集
          </h1>
          <p style={{ color: "#757575", fontSize: "0.875rem" }}>
            {todo.title}
          </p>
        </div>

        {/* フォーム */}
        <TodoForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          defaultValues={{
            title: todo.title,
            description: todo.description,
            priority: todo.priority,
          }}
          isLoading={updateMutation.isPending}
        />

        {/* エラー表示 */}
        {updateMutation.isError && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "#ffebee",
              color: "#c62828",
              borderRadius: "8px",
            }}
          >
            エラーが発生しました: {updateMutation.error.message}
          </div>
        )}
      </div>
    </div>
  );
}
