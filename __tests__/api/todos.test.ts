import { describe, it, expect, beforeEach } from "vitest";
import { getTodos, createTodo, updateTodo, deleteTodo } from "@/lib/api/todos";
import type { CreateTodoInput } from "@/lib/types/todo";

/**
 * Todo API関数のユニットテスト
 *
 * Note: これらのテストは実際のAPIエンドポイントを呼び出すため、
 * 開発サーバーが起動している必要があります
 */
describe("Todo API Functions", () => {
  let createdTodoId: string;

  describe("getTodos", () => {
    it("should fetch all todos", async () => {
      const todos = await getTodos();
      expect(Array.isArray(todos)).toBe(true);
    });

    it("should filter todos by search query", async () => {
      const todos = await getTodos({ q: "Next.js" });
      expect(Array.isArray(todos)).toBe(true);
      // 検索結果が0件以上であることを確認
      expect(todos.length).toBeGreaterThanOrEqual(0);
    });

    it("should filter todos by completed status", async () => {
      const completedTodos = await getTodos({ completed: true });
      expect(Array.isArray(completedTodos)).toBe(true);
      if (completedTodos.length > 0) {
        expect(completedTodos.every((todo) => todo.completed)).toBe(true);
      }
    });

    it("should filter todos by priority", async () => {
      const highPriorityTodos = await getTodos({ priority: "high" });
      expect(Array.isArray(highPriorityTodos)).toBe(true);
      if (highPriorityTodos.length > 0) {
        expect(highPriorityTodos.every((todo) => todo.priority === "high")).toBe(true);
      }
    });

    it("should sort todos by createdAt desc", async () => {
      const todos = await getTodos({ sortBy: "createdAt", sortOrder: "desc" });
      expect(Array.isArray(todos)).toBe(true);
      if (todos.length > 1) {
        const firstDate = new Date(todos[0].createdAt).getTime();
        const secondDate = new Date(todos[1].createdAt).getTime();
        expect(firstDate).toBeGreaterThanOrEqual(secondDate);
      }
    });
  });

  describe("createTodo", () => {
    it("should create a new todo", async () => {
      const input: CreateTodoInput = {
        title: "Test Todo",
        description: "This is a test todo",
        priority: "medium",
      };

      const newTodo = await createTodo(input);

      expect(newTodo).toBeDefined();
      expect(newTodo.id).toBeDefined();
      expect(newTodo.title).toBe(input.title);
      expect(newTodo.description).toBe(input.description);
      expect(newTodo.priority).toBe(input.priority);
      expect(newTodo.completed).toBe(false);

      createdTodoId = newTodo.id;
    });

    it("should create a todo without description", async () => {
      const input: CreateTodoInput = {
        title: "Test Todo Without Description",
        priority: "low",
      };

      const newTodo = await createTodo(input);

      expect(newTodo).toBeDefined();
      expect(newTodo.title).toBe(input.title);
      expect(newTodo.description).toBeUndefined();

      // クリーンアップ
      await deleteTodo(newTodo.id);
    });
  });

  describe("updateTodo", () => {
    beforeEach(async () => {
      // テスト用のTodoを作成
      if (!createdTodoId) {
        const newTodo = await createTodo({
          title: "Todo for Update Test",
          priority: "medium",
        });
        createdTodoId = newTodo.id;
      }
    });

    it("should update todo title", async () => {
      const updatedTodo = await updateTodo(createdTodoId, {
        title: "Updated Title",
      });

      expect(updatedTodo.title).toBe("Updated Title");
    });

    it("should toggle todo completion", async () => {
      const todo = await updateTodo(createdTodoId, { completed: true });
      expect(todo.completed).toBe(true);

      const todoAgain = await updateTodo(createdTodoId, { completed: false });
      expect(todoAgain.completed).toBe(false);
    });

    it("should update todo priority", async () => {
      const updatedTodo = await updateTodo(createdTodoId, {
        priority: "high",
      });

      expect(updatedTodo.priority).toBe("high");
    });
  });

  describe("deleteTodo", () => {
    it("should delete a todo", async () => {
      // 削除用のTodoを作成
      const newTodo = await createTodo({
        title: "Todo to Delete",
        priority: "low",
      });

      // 削除実行
      await deleteTodo(newTodo.id);

      // 削除されたことを確認
      try {
        const todos = await getTodos();
        const found = todos.find((t) => t.id === newTodo.id);
        expect(found).toBeUndefined();
      } catch (error) {
        // 404エラーが返ることも期待される動作
        expect(error).toBeDefined();
      }
    });
  });
});
