"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/design-system/components";
import { ArrowLeft, Edit, Trash2, Check, X } from "lucide-react";
import { useTodo, useUpdateTodo, useDeleteTodo } from "@/lib/hooks/useTodos";
import { useToastStore } from "@/lib/store/useToastStore";

/**
 * Todo詳細ページ
 *
 * 責務:
 * - Todo詳細情報の表示
 * - 完了状態のトグル
 * - 編集・削除へのナビゲーション
 */
export default function TodoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { data: todo, isLoading, error } = useTodo(id);
  const updateMutation = useUpdateTodo();
  const deleteMutation = useDeleteTodo();
  const { success, error: showError } = useToastStore();

  const handleToggleComplete = () => {
    if (!todo) return;
    const newCompleted = !todo.completed;
    updateMutation.mutate(
      { id: todo.id, data: { completed: newCompleted } },
      {
        onSuccess: () => {
          success(
            newCompleted ? `「${todo.title}」を完了にしました` : `「${todo.title}」を未完了に戻しました`,
            newCompleted ? "完了" : "未完了"
          );
        },
        onError: (error) => {
          showError(`更新に失敗しました: ${error.message}`, "エラー");
        },
      }
    );
  };

  const handleDelete = () => {
    if (!todo) return;
    if (confirm("このTodoを削除しますか？")) {
      deleteMutation.mutate(todo.id, {
        onSuccess: () => {
          success(`「${todo.title}」を削除しました`, "削除完了");
          router.push("/todos");
        },
        onError: (error) => {
          showError(`削除に失敗しました: ${error.message}`, "エラー");
        },
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#f44336";
      case "medium":
        return "#ff9800";
      case "low":
        return "#4caf50";
      default:
        return "#9e9e9e";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "高";
      case "medium":
        return "中";
      case "low":
        return "低";
      default:
        return "";
    }
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <Button
            variant="outline"
            size="md"
            icon={<ArrowLeft size={16} />}
            onClick={() => router.push("/todos")}
          >
            一覧に戻る
          </Button>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button
              variant="outline"
              size="md"
              icon={<Edit size={16} />}
              onClick={() => router.push(`/todos/${todo.id}/edit`)}
            >
              編集
            </Button>
            <Button
              variant="outline"
              size="md"
              icon={<Trash2 size={16} />}
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
            >
              削除
            </Button>
          </div>
        </div>

        {/* Todo詳細 */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            padding: "2rem",
          }}
        >
          {/* タイトルと完了ステータス */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
              marginBottom: "1.5rem",
              paddingBottom: "1.5rem",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <button
              onClick={handleToggleComplete}
              disabled={updateMutation.isPending}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "4px",
                border: `2px solid ${todo.completed ? "#2196f3" : "#e0e0e0"}`,
                backgroundColor: todo.completed ? "#2196f3" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: updateMutation.isPending ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
              aria-label={todo.completed ? "未完了にする" : "完了にする"}
            >
              {todo.completed && <Check size={20} color="#ffffff" />}
            </button>
            <div style={{ flex: 1 }}>
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "#212121",
                  marginBottom: "0.75rem",
                  textDecoration: todo.completed ? "line-through" : "none",
                  wordBreak: "break-word",
                }}
              >
                {todo.title}
              </h1>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <span
                  style={{
                    padding: "0.25rem 0.75rem",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#ffffff",
                    backgroundColor: getPriorityColor(todo.priority),
                    borderRadius: "4px",
                  }}
                >
                  優先度: {getPriorityLabel(todo.priority)}
                </span>
                <span
                  style={{
                    padding: "0.25rem 0.75rem",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: todo.completed ? "#4caf50" : "#ff9800",
                    backgroundColor: todo.completed ? "#e8f5e9" : "#fff3e0",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  {todo.completed ? (
                    <>
                      <Check size={14} />
                      完了
                    </>
                  ) : (
                    <>
                      <X size={14} />
                      未完了
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* 説明 */}
          {todo.description && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h2
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#616161",
                  marginBottom: "0.75rem",
                }}
              >
                説明
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#212121",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {todo.description}
              </p>
            </div>
          )}

          {/* メタ情報 */}
          <div
            style={{
              paddingTop: "1.5rem",
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "#616161",
                marginBottom: "0.75rem",
              }}
            >
              詳細情報
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", fontSize: "0.875rem" }}>
                <span style={{ color: "#757575", width: "100px" }}>作成日:</span>
                <span style={{ color: "#212121" }}>
                  {new Date(todo.createdAt).toLocaleString("ja-JP")}
                </span>
              </div>
              <div style={{ display: "flex", fontSize: "0.875rem" }}>
                <span style={{ color: "#757575", width: "100px" }}>更新日:</span>
                <span style={{ color: "#212121" }}>
                  {new Date(todo.updatedAt).toLocaleString("ja-JP")}
                </span>
              </div>
              <div style={{ display: "flex", fontSize: "0.875rem" }}>
                <span style={{ color: "#757575", width: "100px" }}>ID:</span>
                <span style={{ color: "#212121", fontFamily: "monospace" }}>{todo.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
