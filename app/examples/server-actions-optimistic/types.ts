export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  assignee: string;
  priority: TaskPriority;
  status: "Backlog" | "In Progress" | "Tracking" | "Review";
  createdAt: string;
  optimistic?: boolean;
};

export type TaskInput = {
  title: string;
  assignee: string;
  priority: TaskPriority;
};
