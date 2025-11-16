import { ServerActionsOptimisticDemo } from "./client";
import { addTaskAction } from "./actions";
import type { Task } from "./types";

const initialTasks: Task[] = [
  {
    id: "T-101",
    title: "デザインシステムのアップデート",
    assignee: "佐藤",
    priority: "high",
    status: "Tracking",
    createdAt: "2024-03-12T08:30:00.000Z",
  },
  {
    id: "T-098",
    title: "Server Actions ドキュメント整備",
    assignee: "林",
    priority: "medium",
    status: "In Progress",
    createdAt: "2024-03-10T10:15:00.000Z",
  },
  {
    id: "T-087",
    title: "E2Eテストのフレーキネス解消",
    assignee: "高橋",
    priority: "low",
    status: "Review",
    createdAt: "2024-03-08T09:00:00.000Z",
  },
];

export default function ServerActionsOptimisticPage() {
  return <ServerActionsOptimisticDemo initialTasks={initialTasks} addTask={addTaskAction} />;
}
