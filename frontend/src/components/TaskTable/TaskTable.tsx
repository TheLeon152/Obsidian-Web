import { useState } from "react";

import type { Task } from "../../types/task";
import { updateTask } from "../../api/tasks";

import "./TaskTable.css";


interface TaskTableProps {
  tasks: Task[];
  showWaiting?: boolean;
  showBlocked?: boolean;
  onTaskUpdated?: () => void;
}


export function TaskTable({
  tasks,
  showWaiting = false,
  showBlocked = false,
  onTaskUpdated,
}: TaskTableProps) {

  const [updatingTask, setUpdatingTask] =
    useState<string | null>(null);


  function formatDate(
    value: string | null
  ): string {

    if (!value) {
      return "—";
    }

    const [year, month, day] =
      value.split("-");

    return `${day}.${month}.${year}`;
  }


  function getPriorityLabel(
    priority: Task["priority"]
  ): string {

    if (!priority) {
      return "—";
    }

    return priority;
  }


  function getPriorityClass(
    priority: Task["priority"]
  ): string {

    if (!priority) {
      return "";
    }

    return `task-priority-${priority}`;
  }


  async function handleToggle(
    task: Task
  ) {

    const taskId =
      `${task.path}:${task.line}`;


    if (updatingTask) {
      return;
    }


    try {

      setUpdatingTask(taskId);


      await updateTask(
        task.path,
        task.line,
        !task.completed,
      );


      await onTaskUpdated?.();

    } catch (error) {

      console.error(
        "Could not update task:",
        error
      );

    } finally {

      setUpdatingTask(null);

    }
  }


  if (tasks.length === 0) {

    return (
      <p className="task-table-empty">
        Keine Tasks vorhanden.
      </p>
    );

  }


  const sortedTasks = [
    ...tasks,
  ].sort(
    (a, b) =>
      Number(a.completed)
      - Number(b.completed)
  );


  return (
    <div className="task-table-container">

      <table className="task-table">

        <thead>

          <tr>

            <th className="task-table-status">
              Status
            </th>

            <th>
              Task
            </th>

            {!showWaiting &&
              !showBlocked && (
                <>
                  <th>
                    Bereich
                  </th>

                  <th>
                    Deadline
                  </th>

                  <th>
                    Priorität
                  </th>
                </>
            )}

            {showWaiting && (
              <>
                <th>
                  Worauf / auf wen
                </th>

                <th>
                  Seit
                </th>

                <th>
                  Nachfassen
                </th>
              </>
            )}

            {showBlocked && (
              <th>
                Blockiert durch
              </th>
            )}

          </tr>

        </thead>


        <tbody>

          {sortedTasks.map(
            (task) => {

              const taskId =
                `${task.path}:${task.line}`;

              const isUpdating =
                updatingTask === taskId;


              return (
                <tr
                  key={taskId}
                  className={
                    task.completed
                      ? "task-table-row-completed"
                      : ""
                  }
                >

                  <td
                    className="task-table-status"
                  >

                    <input
                      type="checkbox"
                      checked={task.completed}
                      disabled={isUpdating}
                      onChange={() =>
                        handleToggle(task)
                      }
                      aria-label={
                        task.completed
                          ? "Task als offen markieren"
                          : "Task als erledigt markieren"
                      }
                    />

                  </td>


                  <td className="task-table-text">

                    {task.text}

                  </td>


                  {!showWaiting &&
                    !showBlocked && (
                      <>

                        <td>
                          {task.path}
                        </td>

                        <td>
                          {formatDate(
                            task.deadline
                          )}
                        </td>

                        <td>

                          <span
                            className={getPriorityClass(
                              task.priority
                            )}
                          >
                            {getPriorityLabel(
                              task.priority
                            )}
                          </span>

                        </td>

                      </>
                  )}


                  {showWaiting && (
                    <>

                      <td>
                        {task.waiting_for ?? "—"}
                      </td>

                      <td>
                        {formatDate(
                          task.waiting_since
                        )}
                      </td>

                      <td>
                        {formatDate(
                          task.follow_up
                        )}
                      </td>

                    </>
                  )}


                  {showBlocked && (
                    <td>
                      {task.blocked_by ?? "—"}
                    </td>
                  )}

                </tr>
              );

            }
          )}

        </tbody>

      </table>

    </div>
  );
}