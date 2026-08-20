import { useEffect, useState } from "react";

import {
  fetchWaitingTasks,
} from "../../api/tasks";

import { TaskTable } from "../../components/TaskTable/TaskTable";
import type { Task } from "../../types/task";

//test
import { WorkloadWidget } from "../../components/WorkloadWidget/WorkloadWidget";


export function WaitingTasksPage() {

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
          await fetchWaitingTasks();

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
        ⏳ Waiting
      </h1>

      <TaskTable
        tasks={tasks}
        showWaiting
      />

      <WorkloadWidget />

    </div>
  );
}