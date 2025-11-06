import type { Todo, CreateTodoInput, UpdateTodoInput, ApiResponse } from "../types/todo";

const API_BASE_URL = "/api/todos";

/**
 * 検索パラメータの型定義
 */
export interface TodoSearchParams {
  q?: string;
  completed?: boolean;
  priority?: "low" | "medium" | "high";
  sortBy?: "createdAt" | "updatedAt" | "title" | "priority";
  sortOrder?: "asc" | "desc";
}

/**
 * 全てのTodoを取得（検索・フィルター・ソート対応）
 */
export async function getTodos(params?: TodoSearchParams): Promise<Todo[]> {
  const searchParams = new URLSearchParams();

  if (params?.q) searchParams.set("q", params.q);
  if (params?.completed !== undefined) searchParams.set("completed", String(params.completed));
  if (params?.priority) searchParams.set("priority", params.priority);
  if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const url = searchParams.toString()
    ? `${API_BASE_URL}?${searchParams.toString()}`
    : API_BASE_URL;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }
  const data: ApiResponse<Todo[]> = await response.json();
  return data.data;
}

/**
 * IDでTodoを取得
 */
export async function getTodoById(id: string): Promise<Todo> {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch todo with id: ${id}`);
  }
  const data: ApiResponse<Todo> = await response.json();
  return data.data;
}

/**
 * Todoを作成
 */
export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error("Failed to create todo");
  }
  const data: ApiResponse<Todo> = await response.json();
  return data.data;
}

/**
 * Todoを更新
 */
export async function updateTodo(id: string, input: UpdateTodoInput): Promise<Todo> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error(`Failed to update todo with id: ${id}`);
  }
  const data: ApiResponse<Todo> = await response.json();
  return data.data;
}

/**
 * Todoを削除
 */
export async function deleteTodo(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete todo with id: ${id}`);
  }
}
