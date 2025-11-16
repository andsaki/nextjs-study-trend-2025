"use client";

import { useForm } from "react-hook-form";
import { Button, Input, Select } from "@/src/design-system/components";
import { Search, X, SortAsc, SortDesc } from "lucide-react";
import type { TodoSearchParams } from "@/lib/api/todos";

interface SearchFormProps {
  onSearch: (params: TodoSearchParams) => void;
  defaultValues?: TodoSearchParams;
  isPending?: boolean;
}

export function SearchForm({ onSearch, defaultValues, isPending = false }: SearchFormProps) {
  const { register, handleSubmit, reset, watch } = useForm<TodoSearchParams>({
    defaultValues: defaultValues || {
      q: "",
      completed: undefined,
      priority: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    },
  });

  const sortOrder = watch("sortOrder");

  const onSubmit = (data: TodoSearchParams) => {
    // 空の値を除外
    const filteredData: TodoSearchParams = {};
    if (data.q) filteredData.q = data.q;
    if (data.completed !== undefined && data.completed !== null) {
      filteredData.completed = data.completed;
    }
    if (data.priority) filteredData.priority = data.priority;
    if (data.sortBy) filteredData.sortBy = data.sortBy;
    if (data.sortOrder) filteredData.sortOrder = data.sortOrder;

    onSearch(filteredData);
  };

  const handleReset = () => {
    reset({
      q: "",
      completed: undefined,
      priority: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    onSearch({});
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        style={{
          padding: "1.5rem",
          backgroundColor: "#ffffff",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          {/* キーワード検索 */}
          <div style={{ gridColumn: "1 / -1" }}>
            <Input
              label="キーワード検索"
              placeholder="タイトルまたは説明で検索..."
              {...register("q")}
            />
          </div>

          {/* 完了状態フィルター */}
          <div>
            <Select
              label="完了状態"
              options={[
                { value: "", label: "すべて" },
                { value: "false", label: "未完了" },
                { value: "true", label: "完了" },
              ]}
              {...register("completed")}
            />
          </div>

          {/* 優先度フィルター */}
          <div>
            <Select
              label="優先度"
              options={[
                { value: "", label: "すべて" },
                { value: "high", label: "高" },
                { value: "medium", label: "中" },
                { value: "low", label: "低" },
              ]}
              {...register("priority")}
            />
          </div>

          {/* ソート項目 */}
          <div>
            <Select
              label="並び替え"
              options={[
                { value: "createdAt", label: "作成日" },
                { value: "updatedAt", label: "更新日" },
                { value: "title", label: "タイトル" },
                { value: "priority", label: "優先度" },
              ]}
              {...register("sortBy")}
            />
          </div>

          {/* ソート順 */}
          <div>
            <Select
              label="順序"
              options={[
                { value: "desc", label: "降順" },
                { value: "asc", label: "昇順" },
              ]}
              {...register("sortOrder")}
            />
          </div>
        </div>

        {/* ボタン */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "flex-end",
          }}
        >
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleReset}
            icon={<X size={16} />}
            disabled={isPending}
          >
            クリア
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={
              sortOrder === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />
            }
            isLoading={isPending}
            disabled={isPending}
          >
            検索
          </Button>
        </div>
        {isPending && (
          <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#757575" }}>
            useTransitionで検索条件を適用中です...
          </p>
        )}
      </div>
    </form>
  );
}
