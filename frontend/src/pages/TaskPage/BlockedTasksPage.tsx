import { useEffect, useState } from "react";

import {
  fetchBlockedTasks,
} from "../../api/tasks";

import { TaskTable } from "../../components/TaskTable/TaskTable";
import type { Task } from "../../types/task";


export function BlockedTasksPage() {

  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  useEffect(() => {

    async function loadTasks() {

      try {

        const result =
          await fetchBlockedTasks();

        setTasks(result);

      } catch (error) {

        setError(
          error instanceof Error
            ? error.message
            : "Unknown error"
        );

      } finally {

        setLoading(false);

      }
    }

    loadTasks();

  }, []);


  if (loading) {
    return <div>Loading tasks...</div>;
  }


  if (error) {
    return (
      <div>
        Error: {error}
      </div>
    );
  }


  return (
    <div>

      <h1>
        🚧 Blocked
      </h1>

      <TaskTable
        tasks={tasks}
        showBlocked
      />

    </div>
  );
}