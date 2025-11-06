import { useMutation, useQuery, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { getTodos, getTodoById, createTodo, updateTodo, deleteTodo, type TodoSearchParams } from "../api/todos";
import type { CreateTodoInput, UpdateTodoInput } from "../types/todo";

/**
 * Todoリスト取得用フック（検索・フィルター・ソート対応）
 */
export function useTodos(searchParams?: TodoSearchParams) {
  return useQuery({
    queryKey: ["todos", searchParams],
    queryFn: () => getTodos(searchParams),
  });
}

/**
 * Todoリスト取得用フック（Suspense対応版）
 * React SuspenseとError Boundaryを使用してローディング・エラー状態を処理
 */
export function useTodosSuspense(searchParams?: TodoSearchParams) {
  return useSuspenseQuery({
    queryKey: ["todos", searchParams],
    queryFn: () => getTodos(searchParams),
  });
}

/**
 * 単一Todo取得用フック
 */
export function useTodo(id: string) {
  return useQuery({
    queryKey: ["todos", id],
    queryFn: () => getTodoById(id),
    enabled: !!id,
  });
}

/**
 * Todo作成用フック
 */
export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      // キャッシュを無効化してリフェッチ
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

/**
 * Todo更新用フック
 */
export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoInput }) =>
      updateTodo(id, data),
    onSuccess: (_, variables) => {
      // 該当するTodoと一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todos", variables.id] });
    },
  });
}

/**
 * Todo削除用フック
 */
export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      // 一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}
