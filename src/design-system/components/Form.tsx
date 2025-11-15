import React from 'react';
import { useForm } from 'react-hook-form';
import type {
  SubmitHandler,
  UseFormReturn,
  Path,
  Resolver,
  FieldValues,
  DefaultValues,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from './Input';
import { Button } from './Button';
import { spacing } from '../tokens';
import type { WCAGLevel } from '../tokens';

export interface FormFieldConfig<T> {
  /** フィールド名 */
  name: Path<T>;
  /** ラベル */
  label: string;
  /** 入力タイプ */
  type?: React.HTMLInputTypeAttribute;
  /** プレースホルダー */
  placeholder?: string;
  /** ヘルプテキスト */
  helperText?: string;
  /** 必須かどうか */
  required?: boolean;
  /** 入力サイズ */
  size?: 'sm' | 'md' | 'lg';
}

export interface FormProps<T extends z.ZodType<FieldValues>> {
  /** Zodスキーマ */
  schema: T;
  /** フィールド設定 */
  fields: FormFieldConfig<z.infer<T>>[];
  /** 送信時のコールバック */
  onSubmit: SubmitHandler<z.infer<T>>;
  /** 送信ボタンのテキスト @default '送信' */
  submitText?: string;
  /** 送信ボタンのバリアント @default 'primary' */
  submitVariant?: 'primary' | 'secondary' | 'outline';
  /** 送信ボタンのサイズ @default 'md' */
  submitSize?: 'sm' | 'md' | 'lg';
  /** WCAGレベル @default 'AA' */
  wcagLevel?: WCAGLevel;
  /** デフォルト値 */
  defaultValues?: z.infer<T>;
  /** フォームのカスタムスタイル */
  style?: React.CSSProperties;
  /** 送信中の状態 */
  isSubmitting?: boolean;
}

/**
 * react-hook-form + Zod統合フォームコンポーネント
 *
 * 機能:
 * - Zodスキーマによるバリデーション
 * - react-hook-formによる状態管理
 * - アクセシブルなエラー表示
 * - カスタマイズ可能なフィールド設定
 */
export function Form<T extends z.ZodType<FieldValues>>({
  schema,
  fields,
  onSubmit,
  submitText = '送信',
  submitVariant = 'primary',
  submitSize = 'md',
  wcagLevel = 'AA',
  defaultValues,
  style,
  isSubmitting = false,
}: FormProps<T>) {
  type FormData = z.output<T>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema as never) as unknown as Resolver<FormData>,
    defaultValues: defaultValues as DefaultValues<FormData>,
  });

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.scale[4],
    ...style,
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={formStyle} noValidate>
      {fields.map((field) => {
        const error = errors[field.name];
        const errorMessage = error?.message as string | undefined;

        return (
          <Input
            key={field.name}
            label={field.label}
            type={field.type || 'text'}
            placeholder={field.placeholder}
            helperText={field.helperText}
            error={errorMessage}
            required={field.required}
            size={field.size}
            wcagLevel={wcagLevel}
            {...register(field.name)}
          />
        );
      })}

      <Button
        type="submit"
        variant={submitVariant}
        size={submitSize}
        wcagLevel={wcagLevel}
        isLoading={isSubmitting}
        style={{ alignSelf: 'flex-start' }}
      >
        {submitText}
      </Button>
    </form>
  );
}

/**
 * フォームフック付きバージョン - より高度なカスタマイズ用
 */
export interface FormWithHookProps<T extends FieldValues> {
  /** react-hook-formのフォームインスタンス */
  form: UseFormReturn<T>;
  /** 送信時のコールバック */
  onSubmit: SubmitHandler<T>;
  /** フォームコンテンツ */
  children: (form: UseFormReturn<T>) => React.ReactNode;
  /** フォームのカスタムスタイル */
  style?: React.CSSProperties;
}

/**
 * フォームフックを外部から渡すバージョン
 * より複雑なフォームやカスタムロジックが必要な場合に使用
 */
export function FormWithHook<T extends FieldValues>({
  form,
  onSubmit,
  children,
  style,
}: FormWithHookProps<T>) {
  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.scale[4],
    ...style,
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} style={formStyle} noValidate>
      {children(form)}
    </form>
  );
}

// よく使うZodスキーマのヘルパー
export const formSchemas = {
  email: z.string().email('有効なメールアドレスを入力してください'),
  required: (fieldName: string) => z.string().min(1, `${fieldName}は必須です`),
  minLength: (min: number, fieldName: string) =>
    z.string().min(min, `${fieldName}は${min}文字以上で入力してください`),
  maxLength: (max: number, fieldName: string) =>
    z.string().max(max, `${fieldName}は${max}文字以内で入力してください`),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(/[A-Z]/, 'パスワードには大文字を含めてください')
    .regex(/[a-z]/, 'パスワードには小文字を含めてください')
    .regex(/[0-9]/, 'パスワードには数字を含めてください'),
  urlString: z.string().url('有効なURLを入力してください'),
  phone: z.string().regex(/^[0-9-]+$/, '電話番号は数字とハイフンのみで入力してください'),
};
