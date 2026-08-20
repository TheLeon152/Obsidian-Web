import type { Task } from "../../api/tasks";


interface TaskTableProps {
  tasks: Task[];
  showWaiting?: boolean;
  showBlocked?: boolean;
}


export function TaskTable({
  tasks,
  showWaiting = false,
  showBlocked = false,
}: TaskTableProps) {

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


  if (tasks.length === 0) {
    return (
      <p>
        Keine Tasks vorhanden.
      </p>
    );
  }


  return (
    <div
      style={{
        overflowX: "auto",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>

            <th>
              Task
            </th>

            {!showWaiting && !showBlocked && (
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

          {tasks.map((task) => (

            <tr
              key={`${task.path}:${task.line}`}
            >

              <td>
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

          ))}

        </tbody>
      </table>
    </div>
  );
}