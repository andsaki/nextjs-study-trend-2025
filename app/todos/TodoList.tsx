"use client";

import { useState } from "react";
import { Button } from "@/src/design-system/components";
import { Trash2, Edit, Check } from "lucide-react";
import type { Todo } from "@/lib/types/todo";

interface TodoListProps {
  todos: Todo[];
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  onViewDetail?: (todo: Todo) => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

export function TodoList({
  todos,
  onDelete,
  onEdit,
  onToggleComplete,
  onViewDetail,
  isDeleting,
  isUpdating,
}: TodoListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
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

  if (todos.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem",
          color: "#9e9e9e",
          fontSize: "1rem",
        }}
      >
        Todoがありません。新しいTodoを作成してください。
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {todos.map((todo) => (
        <div
          key={todo.id}
          style={{
            padding: "1.25rem",
            backgroundColor: "#ffffff",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "1rem",
            opacity: todo.completed ? 0.6 : 1,
            transition: "all 0.2s ease",
          }}
        >
          {/* コンテンツ */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleComplete(todo.id, !todo.completed);
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                type="button"
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "4px",
                  border: `2px solid ${todo.completed ? "#2196f3" : "#e0e0e0"}`,
                  backgroundColor: todo.completed ? "#2196f3" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  flexShrink: 0,
                  position: "relative",
                  zIndex: 10,
                }}
                aria-label={todo.completed ? "未完了にする" : "完了にする"}
              >
                {todo.completed && <Check size={16} color="#ffffff" />}
              </button>
              <h3
                onClick={() => onViewDetail?.(todo)}
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "#212121",
                  textDecoration: todo.completed ? "line-through" : "none",
                  wordBreak: "break-word",
                  cursor: onViewDetail ? "pointer" : "default",
                  flex: 1,
                }}
              >
                {todo.title}
              </h3>
              <span
                style={{
                  padding: "0.25rem 0.5rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#ffffff",
                  backgroundColor: getPriorityColor(todo.priority),
                  borderRadius: "4px",
                  whiteSpace: "nowrap",
                }}
              >
                {getPriorityLabel(todo.priority)}
              </span>
            </div>
            {todo.description && (
              <p
                style={{
                  marginLeft: "2rem",
                  fontSize: "0.875rem",
                  color: "#757575",
                  lineHeight: 1.6,
                  wordBreak: "break-word",
                }}
              >
                {todo.description}
              </p>
            )}
            <p
              style={{
                marginLeft: "2rem",
                marginTop: "0.5rem",
                fontSize: "0.75rem",
                color: "#9e9e9e",
              }}
            >
              作成日: {new Date(todo.createdAt).toLocaleString("ja-JP")}
            </p>
          </div>

          {/* アクションボタン */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(todo)}
              icon={<Edit size={16} />}
              disabled={isUpdating}
            >
              編集
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(todo.id)}
              icon={<Trash2 size={16} />}
              isLoading={deletingId === todo.id && isDeleting}
              disabled={isDeleting}
            >
              削除
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
