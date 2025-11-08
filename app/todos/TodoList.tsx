"use client";

import { Button, Checkbox } from "@/src/design-system/components";
import { Trash2, Edit } from "lucide-react";
import type { Todo } from "@/lib/types/todo";
import styles from "./TodoList.module.css";

interface TodoListProps {
  todos: Todo[];
  onDelete: (todo: Todo) => void;
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
    return <div className={styles.emptyState}>Todoがありません。新しいTodoを作成してください。</div>;
  }

  return (
    <div className={styles.todoList}>
      {todos.map((todo) => (
        <div key={todo.id} className={`${styles.todoItem} ${todo.completed ? styles.completed : ""}`}>
          {/* コンテンツ */}
          <div className={styles.content}>
            <div className={styles.header}>
              <div className={styles.checkboxWrapper}>
                <Checkbox
                  label=""
                  checked={todo.completed}
                  onChange={() => onToggleComplete(todo.id, !todo.completed)}
                  disabled={isUpdating}
                  aria-label={todo.completed ? "未完了にする" : "完了にする"}
                />
              </div>
              <h3
                onClick={() => onViewDetail?.(todo)}
                className={`${styles.title} ${onViewDetail ? styles.clickable : ""} ${
                  todo.completed ? styles.completed : ""
                }`}
              >
                {todo.title}
              </h3>
              <span
                className={styles.priorityBadge}
                style={{ backgroundColor: getPriorityColor(todo.priority) }}
              >
                {getPriorityLabel(todo.priority)}
              </span>
            </div>
            {todo.description && <p className={styles.description}>{todo.description}</p>}
            <p className={styles.createdAt}>作成日: {new Date(todo.createdAt).toLocaleString("ja-JP")}</p>
          </div>

          {/* アクションボタン */}
          <div className={styles.actions}>
            <Button variant="outline" size="sm" onClick={() => onEdit(todo)} icon={<Edit size={16} />} disabled={isUpdating}>
              編集
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(todo)}
              icon={<Trash2 size={16} />}
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
