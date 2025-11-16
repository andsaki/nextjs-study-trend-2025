"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import type { CSSProperties } from "react";
import { Button } from "@/src/design-system/components";
import { Text } from "@/src/design-system/components/Text";
import { colors, spacing, typography, radii, shadows } from "@/src/design-system/tokens";
import type { Task, TaskInput } from "./types";

type Props = {
  initialTasks: Task[];
  addTask: (input: TaskInput) => Promise<Task>;
};

const priorityLabel: Record<Task["priority"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const styles = {
  main: {
    maxWidth: spacing.layout.container.maxWidth,
    margin: "0 auto",
    padding: `${spacing.scale[12]} ${spacing.layout.container.paddingX} ${spacing.scale[16]}`,
    fontFamily: typography.fontFamily.base,
    display: "flex",
    flexDirection: "column",
    gap: spacing.scale[8],
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: spacing.scale[6],
  },
  panel: {
    borderRadius: radii.card.lg,
    border: `1px solid ${colors.border.subtle}`,
    padding: spacing.scale[6],
    backgroundColor: colors.background.paper,
    boxShadow: shadows.component.card,
    display: "flex",
    flexDirection: "column",
    gap: spacing.scale[4],
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.scale[2],
  },
  label: {
    fontSize: typography.body.small.fontSize,
    color: colors.text.secondary,
  },
  input: {
    borderRadius: radii.input.md,
    border: `1px solid ${colors.input.border}`,
    padding: `${spacing.input.paddingY.md} ${spacing.input.paddingX.md}`,
    fontSize: typography.body.base.fontSize,
  },
  select: {
    borderRadius: radii.input.md,
    border: `1px solid ${colors.input.border}`,
    padding: `${spacing.input.paddingY.md} ${spacing.input.paddingX.md}`,
    fontSize: typography.body.base.fontSize,
    backgroundColor: colors.background.default,
  },
  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: spacing.scale[4],
  },
  taskCard: {
    borderRadius: radii.card.md,
    border: `1px solid ${colors.border.default}`,
    padding: spacing.scale[5],
    backgroundColor: colors.background.default,
    boxShadow: shadows.component.card,
  },
  badgeRow: {
    display: "flex",
    gap: spacing.scale[2],
    flexWrap: "wrap",
  },
  badge: {
    ...typography.textStyle.overline,
    padding: `${spacing.scale[1]} ${spacing.scale[2]}`,
    borderRadius: radii.component.badge,
    border: `1px solid ${colors.border.subtle}`,
  },
  optimisticBadge: {
    backgroundColor: colors.feedback.info.bg,
    color: colors.feedback.info.text,
    borderColor: colors.feedback.info.border,
  },
} satisfies Record<string, CSSProperties>;

export function ServerActionsOptimisticDemo({ initialTasks, addTask }: Props) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [form, setForm] = useState<TaskInput>({ title: "", assignee: "", priority: "medium" });
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [optimisticTasks, addOptimisticTask] = useOptimistic(tasks, (current, optimisticTask: Task) => [
    optimisticTask,
    ...current,
  ]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!form.title || !form.assignee) {
      setFormError("タイトルと担当者は必須です。");
      return;
    }

    const optimisticTask: Task = {
      id: `temp-${Date.now()}`,
      title: form.title,
      assignee: form.assignee,
      priority: form.priority,
      status: "In Progress",
      createdAt: new Date().toISOString(),
      optimistic: true,
    };

    setForm({ title: "", assignee: "", priority: "medium" });

    startTransition(() => {
      addOptimisticTask(optimisticTask);

      (async () => {
        try {
          const created = await addTask({
            title: optimisticTask.title,
            assignee: optimisticTask.assignee,
            priority: optimisticTask.priority,
          });
          setTasks((prev) => [created, ...prev]);
        } catch (error) {
          console.error(error);
          setFormError("サーバーアクションに失敗しました。もう一度お試しください。");
          setTasks((prev) => [...prev]);
        }
      })();
    });
  };

  const stats = useMemo(() => {
    return [
      { label: "総タスク", value: optimisticTasks.length },
      {
        label: "High優先度",
        value: optimisticTasks.filter((task) => task.priority === "high").length,
      },
      {
        label: "同期済み",
        value: optimisticTasks.filter((task) => !task.optimistic).length,
      },
    ];
  }, [optimisticTasks]);

  return (
    <div style={styles.main}>
      <header>
        <Text variant="overline" color={colors.brand.primary}>
          SERVER ACTIONS
        </Text>
        <Text variant="h1" style={{ marginBottom: spacing.scale[2] }}>
          Server Actions + useOptimistic
        </Text>
        <Text variant="body-large" color={colors.text.secondary}>
          フォーム送信をサーバーアクションに委譲しながら、useOptimisticでUIを即時更新するベストプラクティスです。
        </Text>
      </header>

      <section style={styles.grid}>
        <form style={styles.panel} onSubmit={handleSubmit}>
          <Text variant="h3">タスクを追加</Text>
          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="title">
              タイトル
            </label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="例: App Routerレビュー"
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="assignee">
              担当者
            </label>
            <input
              id="assignee"
              name="assignee"
              value={form.assignee}
              onChange={handleChange}
              placeholder="例: 田中"
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="priority">
              優先度
            </label>
            <select
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {formError && (
            <Text variant="body-small" color={colors.feedback.error.text}>
              {formError}
            </Text>
          )}

          <Button type="submit" variant="primary" size="md" isLoading={isPending} disabled={isPending}>
            タスクを送信
          </Button>

          <Text variant="body-small" color={colors.text.secondary}>
            送信時にサーバーアクションが実行されます。useOptimisticによって即座にカードへ追加されます。
          </Text>
        </form>

        <div style={styles.panel}>
          <Text variant="h3">状態モニタリング</Text>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: spacing.scale[3] }}>
            {stats.map((stat) => (
              <div
                key={stat.label}
                style={{
                  borderRadius: radii.card.sm,
                  border: `1px solid ${colors.border.default}`,
                  padding: spacing.scale[3],
                  backgroundColor: colors.background.default,
                }}
              >
                <Text variant="overline" color={colors.text.secondary}>
                  {stat.label}
                </Text>
                <Text variant="h3">{stat.value}</Text>
              </div>
            ))}
          </div>
          <Text variant="body" color={colors.text.secondary}>
            Pendingの間はボタンがローディングし、楽観的なカードには「SYNCING」バッジを付与しています。
          </Text>
        </div>
      </section>

      <section>
        <Text variant="h2" style={{ marginBottom: spacing.scale[4] }}>
          プロジェクトボード
        </Text>
        <div style={styles.taskList}>
          {optimisticTasks.map((task) => (
            <article key={task.id} style={styles.taskCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Text variant="h4">{task.title}</Text>
                <span
                  style={{
                    ...styles.badge,
                    color:
                      task.priority === "high"
                        ? colors.feedback.warning.text
                        : task.priority === "medium"
                        ? colors.brand.primary
                        : colors.text.secondary,
                  }}
                >
                  {priorityLabel[task.priority]}
                </span>
              </div>
              <Text variant="body" color={colors.text.secondary} style={{ marginBottom: spacing.scale[2] }}>
                担当: {task.assignee} / ステータス: {task.status}
              </Text>
              <div style={styles.badgeRow}>
                <span style={styles.badge}>作成: {new Date(task.createdAt).toLocaleString("ja-JP")}</span>
                {task.optimistic && <span style={{ ...styles.badge, ...styles.optimisticBadge }}>SYNCING</span>}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
