"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/src/design-system/components";
import { Search, X, SortAsc, SortDesc } from "lucide-react";
import type { TodoSearchParams } from "@/lib/api/todos";

interface SearchFormProps {
  onSearch: (params: TodoSearchParams) => void;
  defaultValues?: TodoSearchParams;
}

export function SearchForm({ onSearch, defaultValues }: SearchFormProps) {
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
            <label
              htmlFor="search-query"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#616161",
              }}
            >
              キーワード検索
            </label>
            <input
              id="search-query"
              type="text"
              placeholder="タイトルまたは説明で検索..."
              {...register("q")}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                fontSize: "1rem",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                outline: "none",
              }}
            />
          </div>

          {/* 完了状態フィルター */}
          <div>
            <label
              htmlFor="filter-completed"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#616161",
              }}
            >
              完了状態
            </label>
            <select
              id="filter-completed"
              {...register("completed")}
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
              <option value="">すべて</option>
              <option value="false">未完了</option>
              <option value="true">完了</option>
            </select>
          </div>

          {/* 優先度フィルター */}
          <div>
            <label
              htmlFor="filter-priority"
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
              id="filter-priority"
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
              <option value="">すべて</option>
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>

          {/* ソート項目 */}
          <div>
            <label
              htmlFor="sort-by"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#616161",
              }}
            >
              並び替え
            </label>
            <select
              id="sort-by"
              {...register("sortBy")}
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
              <option value="createdAt">作成日</option>
              <option value="updatedAt">更新日</option>
              <option value="title">タイトル</option>
              <option value="priority">優先度</option>
            </select>
          </div>

          {/* ソート順 */}
          <div>
            <label
              htmlFor="sort-order"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#616161",
              }}
            >
              順序
            </label>
            <select
              id="sort-order"
              {...register("sortOrder")}
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
              <option value="desc">降順</option>
              <option value="asc">昇順</option>
            </select>
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
          >
            検索
          </Button>
        </div>
      </div>
    </form>
  );
}
