"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTodoSchema, type CreateTodoInput, type Todo } from "@/lib/types/todo";
import { Button, Input, TextArea, Select } from "@/src/design-system/components";
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
        <Input
          label="タイトル"
          required
          error={errors.title?.message}
          {...register("title")}
        />

        {/* 説明 */}
        <TextArea
          label="説明"
          rows={3}
          error={errors.description?.message}
          {...register("description")}
        />

        {/* 優先度 */}
        <Select
          label="優先度"
          options={[
            { value: "low", label: "低" },
            { value: "medium", label: "中" },
            { value: "high", label: "高" },
          ]}
          {...register("priority")}
        />

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
