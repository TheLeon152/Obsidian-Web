import { useEffect, useState } from "react";

import {
  fetchNextTasks,
} from "../../api/tasks";

import { TaskTable } from "../../components/TaskTable/TaskTable";
import type { Task } from "../../types/task";


export function NextTasksPage() {

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
          await fetchNextTasks(10);

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
        🔜 Next
      </h1>

      <TaskTable
        tasks={tasks}
      />

    </div>
  );
}