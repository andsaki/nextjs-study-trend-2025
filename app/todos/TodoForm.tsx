"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTodoSchema, type CreateTodoInput, type Todo } from "@/lib/types/todo";
import { Button } from "@/src/design-system/components";
import { X } from "lucide-react";

interface TodoFormProps {
  onSubmit: (data: CreateTodoInput) => void;
  onCancel?: () => void;
  defaultValues?: Partial<Todo>;
  isLoading?: boolean;
}

export function TodoForm({ onSubmit, onCancel, defaultValues, isLoading }: TodoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: defaultValues || {
      title: "",
      description: "",
      priority: "medium",
    },
  });

  const onSubmitForm = (data: CreateTodoInput) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "1.5rem",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          border: "1px solid #e0e0e0",
        }}
      >
        {/* タイトル */}
        <div>
          <label
            htmlFor="title"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#616161",
            }}
          >
            タイトル *
          </label>
          <input
            id="title"
            type="text"
            {...register("title")}
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              fontSize: "1rem",
              border: `1px solid ${errors.title ? "#f44336" : "#e0e0e0"}`,
              borderRadius: "4px",
              outline: "none",
            }}
            aria-invalid={errors.title ? "true" : "false"}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          {errors.title && (
            <p
              id="title-error"
              role="alert"
              style={{
                marginTop: "0.25rem",
                fontSize: "0.875rem",
                color: "#f44336",
              }}
            >
              {errors.title.message}
            </p>
          )}
        </div>

        {/* 説明 */}
        <div>
          <label
            htmlFor="description"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#616161",
            }}
          >
            説明
          </label>
          <textarea
            id="description"
            rows={3}
            {...register("description")}
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              fontSize: "1rem",
              border: `1px solid ${errors.description ? "#f44336" : "#e0e0e0"}`,
              borderRadius: "4px",
              outline: "none",
              resize: "vertical",
            }}
            aria-invalid={errors.description ? "true" : "false"}
            aria-describedby={errors.description ? "description-error" : undefined}
          />
          {errors.description && (
            <p
              id="description-error"
              role="alert"
              style={{
                marginTop: "0.25rem",
                fontSize: "0.875rem",
                color: "#f44336",
              }}
            >
              {errors.description.message}
            </p>
          )}
        </div>

        {/* 優先度 */}
        <div>
          <label
            htmlFor="priority"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#616161",
            }}
          >
            優先度
          </label>
          <select
            id="priority"
            {...register("priority")}
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              fontSize: "1rem",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              outline: "none",
              backgroundColor: "#ffffff",
            }}
          >
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
        </div>

        {/* ボタン */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "flex-end",
            marginTop: "0.5rem",
          }}
        >
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onCancel}
              icon={<X size={16} />}
            >
              キャンセル
            </Button>
          )}
          <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
            {defaultValues ? "更新" : "作成"}
          </Button>
        </div>
      </div>
    </form>
  );
}
