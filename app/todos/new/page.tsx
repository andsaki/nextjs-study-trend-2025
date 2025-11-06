"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/src/design-system/components";
import { ArrowLeft } from "lucide-react";
import { TodoForm } from "../TodoForm";
import { useCreateTodo } from "@/lib/hooks/useTodos";
import type { CreateTodoInput } from "@/lib/types/todo";

/**
 * Todo作成ページ
 *
 * 責務:
 * - 新しいTodoの作成
 * - フォームバリデーション
 * - 作成後の一覧ページへのリダイレクト
 */
export default function TodoCreatePage() {
  const router = useRouter();
  const createMutation = useCreateTodo();

  const handleSubmit = (data: CreateTodoInput) => {
    createMutation.mutate(data, {
      onSuccess: (newTodo) => {
        router.push(`/todos/${newTodo.id}`);
      },
    });
  };

  const handleCancel = () => {
    router.push("/todos");
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
            onClick={() => router.push("/todos")}
            style={{ marginBottom: "1rem" }}
          >
            一覧に戻る
          </Button>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#212121",
              marginBottom: "0.5rem",
            }}
          >
            新しいTodoを作成
          </h1>
          <p style={{ color: "#757575", fontSize: "0.875rem" }}>
            必要な情報を入力してTodoを作成してください
          </p>
        </div>

        {/* フォーム */}
        <TodoForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={createMutation.isPending}
        />

        {/* エラー表示 */}
        {createMutation.isError && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "#ffebee",
              color: "#c62828",
              borderRadius: "8px",
            }}
          >
            エラーが発生しました: {createMutation.error.message}
          </div>
        )}
      </div>
    </div>
  );
}
