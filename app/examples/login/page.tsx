"use client";

import { useState } from "react";
import { z } from "zod";
import { Form } from "@/src/design-system/components/Form";

// ログインフォームのスキーマ
const loginSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で入力してください")
    .regex(/[A-Z]/, "パスワードには大文字を含めてください")
    .regex(/[a-z]/, "パスワードには小文字を含めてください")
    .regex(/[0-9]/, "パスワードには数字を含めてください"),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleLogin = async (data: LoginInput) => {
    setIsSubmitting(true);
    setResult(null);

    // APIコールのシミュレーション
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 成功例（実際はAPIレスポンスによる）
    console.log("ログイン情報:", data);
    setResult({
      success: true,
      message: "ログインに成功しました！",
    });

    setIsSubmitting(false);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: "1.875rem", fontWeight: 700, marginBottom: "2rem" }}>
        ログイン
      </h1>

      {result && (
        <div
          style={{
            padding: "1rem",
            marginBottom: "1.5rem",
            backgroundColor: result.success ? "#e8f5e9" : "#ffebee",
            color: result.success ? "#2e7d32" : "#c62828",
            borderRadius: "8px",
            border: `1px solid ${result.success ? "#4caf50" : "#ef5350"}`,
          }}
        >
          {result.message}
        </div>
      )}

      <Form
        schema={loginSchema}
        fields={[
          {
            name: "email",
            label: "メールアドレス",
            type: "email",
            placeholder: "example@email.com",
            required: true,
            size: "md",
          },
          {
            name: "password",
            label: "パスワード",
            type: "password",
            helperText: "8文字以上、大文字・小文字・数字を含む",
            required: true,
            size: "md",
          },
        ]}
        onSubmit={handleLogin}
        submitText="ログイン"
        submitVariant="primary"
        submitSize="md"
        isSubmitting={isSubmitting}
      />

      <div
        style={{
          marginTop: "1.5rem",
          textAlign: "center",
          fontSize: "0.875rem",
          color: "#666",
        }}
      >
        <p>
          アカウントをお持ちでない方は
          <a
            href="/examples/signup"
            style={{ color: "#1976d2", textDecoration: "underline", marginLeft: "0.25rem" }}
          >
            新規登録
          </a>
        </p>
      </div>
    </div>
  );
}
