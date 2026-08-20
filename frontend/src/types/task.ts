export type TaskPriority =
  | "high"
  | "medium"
  | "low";


export type TaskState =
  | "▶️"
  | "⏳"
  | "🚧";


export type WorkloadLevel =
  | "Niedrig"
  | "Moderat"
  | "Hoch"
  | "Sehr hoch";


export interface Task {
  text: string;
  path: string;
  line: number;

  completed: boolean;

  priority: TaskPriority | null;
  deadline: string | null;

  task_state: TaskState | null;

  waiting_for: string | null;
  waiting_since: string | null;
  follow_up: string | null;

  blocked_by: string | null;
}


export interface TaskWorkload {
  days: number;

  deadline_count: number;
  high_priority_count: number;

  waiting_count: number;
  blocked_count: number;

  level: WorkloadLevel;
  score: number;
}