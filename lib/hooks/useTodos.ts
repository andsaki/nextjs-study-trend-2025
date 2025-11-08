import { useMutation, useSuspenseQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTodos, getTodoById, createTodo, updateTodo, deleteTodo, type TodoSearchParams } from "../api/todos";
import type { CreateTodoInput, UpdateTodoInput } from "../types/todo";

/**
 * Todoリスト取得用フック（Suspense対応）
 *
 * React SuspenseとError Boundaryを使用してローディング・エラー状態を処理します。
 * このフックを使用するコンポーネントは、必ず<Suspense>と<ErrorBoundary>で囲む必要があります。
 *
 * @param searchParams - 検索・フィルター・ソートのパラメータ
 * @returns useSuspenseQueryの結果（data, refetch, etc.）
 *
 * @example
 * ```tsx
 * function TodoList() {
 *   const { data: todos } = useTodos({ q: 'test', completed: false });
 *   return <div>{todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}</div>;
 * }
 *
 * // 使用側
 * <ErrorBoundary fallback={<Error />}>
 *   <Suspense fallback={<Loading />}>
 *     <TodoList />
 *   </Suspense>
 * </ErrorBoundary>
 * ```
 */
export function useTodos(searchParams?: TodoSearchParams) {
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
