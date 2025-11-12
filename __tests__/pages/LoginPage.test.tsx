import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/examples/login/page";

/**
 * LoginPageコンポーネントのテスト
 */
describe("LoginPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render login form with all fields", () => {
    render(<LoginPage />);

    expect(screen.getByRole("heading", { name: /ログイン/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/パスワード/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ログイン/i })).toBeInTheDocument();
  });

  it("should show validation error when email is empty", async () => {
    render(<LoginPage />);

    const submitButton = screen.getByRole("button", { name: /ログイン/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/有効なメールアドレスを入力してください/i)).toBeInTheDocument();
    });
  });

  it("should show validation error when email format is invalid", async () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/メールアドレス/i);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    const submitButton = screen.getByRole("button", { name: /ログイン/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/有効なメールアドレスを入力してください/i)).toBeInTheDocument();
    });
  });

  it("should show validation error when password is too short", async () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/メールアドレス/i);
    const passwordInput = screen.getByLabelText(/パスワード/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Pass1" } }); // 短すぎる

    const submitButton = screen.getByRole("button", { name: /ログイン/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/パスワードは8文字以上で入力してください/i)).toBeInTheDocument();
    });
  });

  it("should show validation error when password lacks uppercase", async () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/メールアドレス/i);
    const passwordInput = screen.getByLabelText(/パスワード/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } }); // 大文字なし

    const submitButton = screen.getByRole("button", { name: /ログイン/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/パスワードには大文字を含めてください/i)).toBeInTheDocument();
    });
  });

  it("should show validation error when password lacks lowercase", async () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/メールアドレス/i);
    const passwordInput = screen.getByLabelText(/パスワード/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "PASSWORD123" } }); // 小文字なし

    const submitButton = screen.getByRole("button", { name: /ログイン/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/パスワードには小文字を含めてください/i)).toBeInTheDocument();
    });
  });

  it("should show validation error when password lacks number", async () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/メールアドレス/i);
    const passwordInput = screen.getByLabelText(/パスワード/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password" } }); // 数字なし

    const submitButton = screen.getByRole("button", { name: /ログイン/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/パスワードには数字を含めてください/i)).toBeInTheDocument();
    });
  });

  it("should submit form with valid credentials", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/メールアドレス/i);
    const passwordInput = screen.getByLabelText(/パスワード/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123" } });

    const submitButton = screen.getByRole("button", { name: /ログイン/i });
    fireEvent.click(submitButton);

    // 送信中はボタンが無効化される
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    // 成功メッセージが表示される
    await waitFor(
      () => {
        expect(screen.getByText(/ログインに成功しました/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // コンソールにログイン情報が出力される
    expect(consoleSpy).toHaveBeenCalledWith("ログイン情報:", {
      email: "test@example.com",
      password: "Password123",
    });

    consoleSpy.mockRestore();
  });

  it("should show helper text for password field", () => {
    render(<LoginPage />);

    expect(screen.getByText(/8文字以上、大文字・小文字・数字を含む/i)).toBeInTheDocument();
  });

  it("should have a link to signup page", () => {
    render(<LoginPage />);

    const signupLink = screen.getByRole("link", { name: /新規登録/i });
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute("href", "/examples/signup");
  });

  it("should display loading state during submission", async () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/メールアドレス/i);
    const passwordInput = screen.getByLabelText(/パスワード/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123" } });

    const submitButton = screen.getByRole("button", { name: /ログイン/i });
    fireEvent.click(submitButton);

    // ローディング中はボタンが無効化される
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
});
