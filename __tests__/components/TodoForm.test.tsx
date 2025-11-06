import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TodoForm } from "@/app/todos/TodoForm";
import type { CreateTodoInput } from "@/lib/types/todo";

/**
 * TodoFormコンポーネントのテスト
 */
describe("TodoForm Component", () => {
  it("should render form with all fields", () => {
    const mockOnSubmit = vi.fn();
    render(<TodoForm onSubmit={mockOnSubmit} />);

    // フォーム要素が存在することを確認
    expect(screen.getByLabelText(/タイトル/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/説明/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/優先度/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /作成/i })).toBeInTheDocument();
  });

  it("should show validation error when title is empty", async () => {
    const mockOnSubmit = vi.fn();
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole("button", { name: /作成/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/タイトルは必須です/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("should show validation error when title exceeds 100 characters", async () => {
    const mockOnSubmit = vi.fn();
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/タイトル/i);
    const longTitle = "a".repeat(101);

    fireEvent.change(titleInput, { target: { value: longTitle } });

    const submitButton = screen.getByRole("button", { name: /作成/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/タイトルは100文字以内/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("should submit form with valid data", async () => {
    const mockOnSubmit = vi.fn();
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/タイトル/i);
    const descriptionInput = screen.getByLabelText(/説明/i);
    const prioritySelect = screen.getByLabelText(/優先度/i);

    fireEvent.change(titleInput, { target: { value: "Test Todo" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Test Description" },
    });
    fireEvent.change(prioritySelect, { target: { value: "high" } });

    const submitButton = screen.getByRole("button", { name: /作成/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: "Test Todo",
        description: "Test Description",
        priority: "high",
      });
    });
  });

  it("should call onCancel when cancel button is clicked", () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();
    render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByRole("button", { name: /キャンセル/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("should render with default values for editing", () => {
    const mockOnSubmit = vi.fn();
    const defaultValues = {
      title: "Existing Todo",
      description: "Existing Description",
      priority: "high" as const,
    };

    render(<TodoForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />);

    const titleInput = screen.getByLabelText(/タイトル/i) as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(/説明/i) as HTMLTextAreaElement;
    const prioritySelect = screen.getByLabelText(/優先度/i) as HTMLSelectElement;

    expect(titleInput.value).toBe("Existing Todo");
    expect(descriptionInput.value).toBe("Existing Description");
    expect(prioritySelect.value).toBe("high");
    expect(screen.getByRole("button", { name: /更新/i })).toBeInTheDocument();
  });

  it("should disable submit button when isLoading is true", () => {
    const mockOnSubmit = vi.fn();
    render(<TodoForm onSubmit={mockOnSubmit} isLoading={true} />);

    const submitButton = screen.getByRole("button", { name: /作成/i });
    expect(submitButton).toBeDisabled();
  });

  it("should reset form after successful submission", async () => {
    const mockOnSubmit = vi.fn();
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/タイトル/i) as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: "Test Todo" } });

    const submitButton = screen.getByRole("button", { name: /作成/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    // フォームがリセットされていることを確認
    await waitFor(() => {
      expect(titleInput.value).toBe("");
    });
  });
});
