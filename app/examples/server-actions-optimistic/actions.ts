"use server";

import { z } from "zod";
import type { Task, TaskInput } from "./types";

const schema = z.object({
  title: z.string().min(2, "タイトルは2文字以上").max(60),
  assignee: z.string().min(1, "担当者は必須です").max(40),
  priority: z.enum(["low", "medium", "high"]),
});

export async function addTaskAction(input: TaskInput): Promise<Task> {
  const payload = schema.parse(input);
  await new Promise((resolve) => setTimeout(resolve, 1200));

  return {
    id: crypto.randomUUID(),
    ...payload,
    status: payload.priority === "high" ? "Tracking" : payload.priority === "medium" ? "In Progress" : "Backlog",
    createdAt: new Date().toISOString(),
  };
}
