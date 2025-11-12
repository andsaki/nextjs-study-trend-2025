import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactPage from "@/app/examples/contact/page";

/**
 * ContactPageコンポーネントのテスト
 */
describe("ContactPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render contact form with all fields", () => {
    render(<ContactPage />);

    expect(screen.getByRole("heading", { name: /お問い合わせ/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/お名前/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/カテゴリー/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/件名/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/お問い合わせ内容/i)).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /送信する/i })).toBeInTheDocument();
  });

  it("should show validation error when name is empty", async () => {
    render(<ContactPage />);

    const submitButton = screen.getByRole("button", { name: /送信する/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/お名前は必須です/i)).toBeInTheDocument();
    });
  });

  it("should show validation error when name exceeds 50 characters", async () => {
    render(<ContactPage />);

    const nameInput = screen.getByLabelText(/お名前/i);
    const longName = "あ".repeat(51);

    fireEvent.change(nameInput, { target: { value: longName } });

    const submitButton = screen.getByRole("button", { name: /送信する/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/お名前は50文字以内で入力してください/i)).toBeInTheDocument();
    });
  });

  it("should show validation error when email format is invalid", async () => {
    render(<ContactPage />);

    const emailInput = screen.getByLabelText(/メールアドレス/i);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    const submitButton = screen.getByRole("button", { name: /送信する/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/有効なメールアドレスを入力してください/i)).toBeInTheDocument();
    });
  });

  it("should show validation error when subject is empty", async () => {
    render(<ContactPage />);

    const submitButton = screen.getByRole("button", { name: /送信する/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/件名は必須です/i)).toBeInTheDocument();
    });
  });

  it("should show validation error when subject exceeds 100 characters", async () => {
    render(<ContactPage />);

    const subjectInput = screen.getByLabelText(/件名/i);
    const longSubject = "a".repeat(101);

    fireEvent.change(subjectInput, { target: { value: longSubject } });

    const submitButton = screen.getByRole("button", { name: /送信する/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/件名は100文字以内で入力してください/i)).toBeInTheDocument();
    });
  });

  it("should show validation error when message is too short", async () => {
    render(<ContactPage />);

    const messageInput = screen.getByLabelText(/お問い合わせ内容/i);
    fireEvent.change(messageInput, { target: { value: "短い" } }); // 10文字未満

    const submitButton = screen.getByRole("button", { name: /送信する/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/お問い合わせ内容は10文字以上で入力してください/i)
      ).toBeInTheDocument();
    });
  });

  it("should show validation error when message exceeds 1000 characters", async () => {
    render(<ContactPage />);

    const messageInput = screen.getByLabelText(/お問い合わせ内容/i);
    const longMessage = "a".repeat(1001);

    fireEvent.change(messageInput, { target: { value: longMessage } });

    const submitButton = screen.getByRole("button", { name: /送信する/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/お問い合わせ内容は1000文字以内で入力してください/i)
      ).toBeInTheDocument();
    });
  });

  it("should show validation error when terms are not agreed", async () => {
    render(<ContactPage />);

    const nameInput = screen.getByLabelText(/お名前/i);
    const emailInput = screen.getByLabelText(/メールアドレス/i);
    const subjectInput = screen.getByLabelText(/件名/i);
    const messageInput = screen.getByLabelText(/お問い合わせ内容/i);

    fireEvent.change(nameInput, { target: { value: "山田太郎" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(subjectInput, { target: { value: "テスト件名" } });
    fireEvent.change(messageInput, { target: { value: "テストメッセージです。10文字以上です。" } });

    // チェックボックスをチェックしない

    const submitButton = screen.getByRole("button", { name: /送信する/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/利用規約への同意が必要です/i)).toBeInTheDocument();
    });
  });

  it("should render category select with all options", () => {
    render(<ContactPage />);

    const categorySelect = screen.getByLabelText(/カテゴリー/i);
    const options = Array.from(categorySelect.querySelectorAll("option"));

    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent("一般的なお問い合わせ");
    expect(options[1]).toHaveTextContent("サポート");
    expect(options[2]).toHaveTextContent("フィードバック");
    expect(options[3]).toHaveTextContent("その他");
  });

  it("should submit form with valid data", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    render(<ContactPage />);

    const nameInput = screen.getByLabelText(/お名前/i);
    const emailInput = screen.getByLabelText(/メールアドレス/i);
    const categorySelect = screen.getByLabelText(/カテゴリー/i);
    const subjectInput = screen.getByLabelText(/件名/i);
    const messageInput = screen.getByLabelText(/お問い合わせ内容/i);
    const termsCheckbox = screen.getByRole("checkbox");

    fireEvent.change(nameInput, { target: { value: "山田太郎" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(categorySelect, { target: { value: "support" } });
    fireEvent.change(subjectInput, { target: { value: "テスト件名" } });
    fireEvent.change(messageInput, {
      target: { value: "これはテストメッセージです。10文字以上あります。" },
    });
    fireEvent.click(termsCheckbox);

    const submitButton = screen.getByRole("button", { name: /送信する/i });
    fireEvent.click(submitButton);

    // 送信中はボタンが無効化される
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    // 成功メッセージが表示される
    await waitFor(
      () => {
        expect(
          screen.getByText(/お問い合わせを送信しました。ご連絡ありがとうございます/i)
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // コンソールにお問い合わせ内容が出力される
    expect(consoleSpy).toHaveBeenCalledWith("お問い合わせ内容:", {
      name: "山田太郎",
      email: "test@example.com",
      category: "support",
      subject: "テスト件名",
      message: "これはテストメッセージです。10文字以上あります。",
      agreeToTerms: true,
    });

    consoleSpy.mockRestore();
  });

  it("should reset form after successful submission", async () => {
    render(<ContactPage />);

    const nameInput = screen.getByLabelText(/お名前/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/メールアドレス/i) as HTMLInputElement;
    const subjectInput = screen.getByLabelText(/件名/i) as HTMLInputElement;
    const messageInput = screen.getByLabelText(/お問い合わせ内容/i) as HTMLTextAreaElement;
    const termsCheckbox = screen.getByRole("checkbox") as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: "山田太郎" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(subjectInput, { target: { value: "テスト件名" } });
    fireEvent.change(messageInput, { target: { value: "テストメッセージです。" } });
    fireEvent.click(termsCheckbox);

    const submitButton = screen.getByRole("button", { name: /送信する/i });
    fireEvent.click(submitButton);

    // 成功メッセージが表示されるまで待つ
    await waitFor(
      () => {
        expect(screen.getByText(/お問い合わせを送信しました/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // フォームがリセットされていることを確認
    await waitFor(() => {
      expect(nameInput.value).toBe("");
      expect(emailInput.value).toBe("");
      expect(subjectInput.value).toBe("");
      expect(messageInput.value).toBe("");
      expect(termsCheckbox.checked).toBe(false);
    });
  });

  it("should have a link to terms page in checkbox label", () => {
    render(<ContactPage />);

    const termsLink = screen.getByRole("link", { name: /利用規約/i });
    expect(termsLink).toBeInTheDocument();
    expect(termsLink).toHaveAttribute("href", "/terms");
    expect(termsLink).toHaveAttribute("target", "_blank");
  });

  it("should display description text", () => {
    render(<ContactPage />);

    expect(
      screen.getByText(/ご質問やご意見がございましたら、以下のフォームよりお気軽にお問い合わせください/i)
    ).toBeInTheDocument();
  });

  it("should display loading state during submission", async () => {
    render(<ContactPage />);

    const nameInput = screen.getByLabelText(/お名前/i);
    const emailInput = screen.getByLabelText(/メールアドレス/i);
    const subjectInput = screen.getByLabelText(/件名/i);
    const messageInput = screen.getByLabelText(/お問い合わせ内容/i);
    const termsCheckbox = screen.getByRole("checkbox");

    fireEvent.change(nameInput, { target: { value: "山田太郎" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(subjectInput, { target: { value: "テスト件名" } });
    fireEvent.change(messageInput, { target: { value: "テストメッセージです。10文字以上です。" } });
    fireEvent.click(termsCheckbox);

    const submitButton = screen.getByRole("button", { name: /送信する/i });
    fireEvent.click(submitButton);

    // ローディング中はボタンが無効化される
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
});
