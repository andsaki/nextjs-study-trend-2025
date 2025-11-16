import { z } from "zod";

/**
 * Todoスキーマ（バリデーション用）
 */
export const todoSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .max(100, "タイトルは100文字以内で入力してください"),
  description: z
    .string()
    .max(500, "説明は500文字以内で入力してください")
    .optional(),
  completed: z.boolean().default(false),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

/**
 * Todo作成用スキーマ
 */
export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .max(100, "タイトルは100文字以内で入力してください"),
  description: z
    .string()
    .max(500, "説明は500文字以内で入力してください")
    .optional()
    .or(z.literal("")),
  priority: z.enum(["low", "medium", "high"]),
});

/**
 * Todo更新用スキーマ
 */
export const updateTodoSchema = todoSchema.partial();

/**
 * Todoの型定義
 */
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
}

/**
 * Todo作成用の型
 */
export interface CreateTodoInput {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
}

/**
 * Todo更新用の型
 */
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;

/**
 * APIレスポンスの型
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  message: string;
}
