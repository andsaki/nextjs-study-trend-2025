"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormWithHook } from "@/src/design-system/components/Form";
import { Input, TextArea, Select, Button } from "@/src/design-system/components";

// お問い合わせフォームのスキーマ
const contactSchema = z.object({
  name: z.string().min(1, "お名前は必須です").max(50, "お名前は50文字以内で入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  category: z.enum(["general", "support", "feedback", "other"], {
    message: "カテゴリーを選択してください",
  }),
  subject: z
    .string()
    .min(1, "件名は必須です")
    .max(100, "件名は100文字以内で入力してください"),
  message: z
    .string()
    .min(10, "お問い合わせ内容は10文字以上で入力してください")
    .max(1000, "お問い合わせ内容は1000文字以内で入力してください"),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "利用規約への同意が必要です",
  }),
});

type ContactInput = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      category: "general",
      subject: "",
      message: "",
      agreeToTerms: false,
    },
  });

  const handleSubmit = async (data: ContactInput) => {
    setResult(null);

    // useTransitionで非緊急な更新としてマーク
    startTransition(async () => {
      // APIコールのシミュレーション
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("お問い合わせ内容:", data);
      setResult({
        success: true,
        message: "お問い合わせを送信しました。ご連絡ありがとうございます！",
      });

      // フォームをリセット
      form.reset();
    });
  };

  const categoryOptions = [
    { value: "general", label: "一般的なお問い合わせ" },
    { value: "support", label: "サポート" },
    { value: "feedback", label: "フィードバック" },
    { value: "other", label: "その他" },
  ];

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: "1.875rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        お問い合わせ
      </h1>
      <p style={{ color: "#666", marginBottom: "1rem" }}>
        ご質問やご意見がございましたら、以下のフォームよりお気軽にお問い合わせください。
      </p>

      {/* useTransitionの説明 */}
      <div style={{
        padding: "1rem",
        marginBottom: "1.5rem",
        backgroundColor: "#e3f2fd",
        borderRadius: "8px",
        borderLeft: "4px solid #1976d2"
      }}>
        <div style={{ fontWeight: 600, marginBottom: "0.5rem", color: "#1976d2" }}>
          💡 useTransitionを使用
        </div>
        <div style={{ fontSize: "0.875rem", color: "#555" }}>
          送信処理を非ブロッキングで実行。送信中でもフォーム入力が可能です。
          {isPending && (
            <span style={{ display: "block", marginTop: "0.5rem", color: "#1976d2", fontWeight: 500 }}>
              ⏳ 送信処理中...（でも他の操作ができます！）
            </span>
          )}
        </div>
      </div>

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

      <FormWithHook form={form} onSubmit={handleSubmit}>
        {({ register, formState: { errors } }) => (
          <>
            <Input
              label="お名前"
              placeholder="山田 太郎"
              required
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="メールアドレス"
              type="email"
              placeholder="example@email.com"
              required
              error={errors.email?.message}
              {...register("email")}
            />

            <Select
              label="カテゴリー"
              options={categoryOptions}
              required
              error={errors.category?.message}
              {...register("category")}
            />

            <Input
              label="件名"
              placeholder="お問い合わせの件名を入力してください"
              required
              error={errors.subject?.message}
              {...register("subject")}
            />

            <TextArea
              label="お問い合わせ内容"
              rows={6}
              placeholder="お問い合わせ内容を詳しくご記入ください（10文字以上）"
              required
              error={errors.message?.message}
              {...register("message")}
            />

            <div style={{ marginTop: "1rem" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  {...register("agreeToTerms")}
                  style={{ width: "1rem", height: "1rem", cursor: "pointer" }}
                />
                <span style={{ fontSize: "0.875rem" }}>
                  <a
                    href="/terms"
                    target="_blank"
                    style={{ color: "#1976d2", textDecoration: "underline" }}
                  >
                    利用規約
                  </a>
                  に同意します
                </span>
              </label>
              {errors.agreeToTerms && (
                <p style={{ color: "#d32f2f", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                  {errors.agreeToTerms.message}
                </p>
              )}
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isPending}
                disabled={isPending}
                style={{ width: "100%" }}
              >
                送信する
              </Button>
            </div>
          </>
        )}
      </FormWithHook>
    </div>
  );
}
