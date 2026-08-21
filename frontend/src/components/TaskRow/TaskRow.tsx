import { useState, type ReactNode } from "react";

import type { Task } from "../../types/task";
import { updateTask } from "../../api/tasks";

import "./TaskRow.css";


interface TaskRowProps {
  task: Task;
  onUpdated?: (task: Task) => void;
  secondaryContent?: ReactNode;
}


export function TaskRow({
  task,
  onUpdated,
  secondaryContent,
}: TaskRowProps) {

  const [updating, setUpdating] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);


  async function handleToggle() {

    if (updating) {
      return;
    }

    try {

      setUpdating(true);
      setError(null);

      const updatedTask =
        await updateTask(
          task.path,
          task.line,
          !task.completed,
        );

      onUpdated?.(updatedTask);

    } catch (error) {

      console.error(
        "Could not update task:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Task konnte nicht aktualisiert werden.",
      );

    } finally {

      setUpdating(false);

    }
  }


  return (
    <div
      className={
        `task-row ${
          task.completed
            ? "task-row-completed"
            : ""
        }`
      }
    >

      <input
        type="checkbox"
        checked={task.completed}
        disabled={updating}
        onChange={handleToggle}
        aria-label={
          task.completed
            ? "Task als offen markieren"
            : "Task als erledigt markieren"
        }
      />


      <div className="task-row-main">

        <div className="task-row-content">

          <span className="task-text">
            {task.text}
          </span>


          <span
            className={
              `task-priority priority-${
                task.priority ?? "none"
              }`
            }
          >
            {task.priority ?? "—"}
          </span>

        </div>


        {secondaryContent && (
          <div className="task-row-secondary">
            {secondaryContent}
          </div>
        )}


        {error && (
          <span className="task-error">
            {error}
          </span>
        )}

      </div>

    </div>
  );
}