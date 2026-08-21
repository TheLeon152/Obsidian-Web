import { useEffect, useState } from "react";

import {
  fetchTodayTasks,
  fetchUpcomingTasks,
  fetchNextTasks,
  fetchWaitingTasks,
  fetchBlockedTasks,
} from "../../api/tasks";

import { TaskTable } from "../TaskTable/TaskTable";
import { TaskSection } from "./TaskSection";
import type { Task } from "../../types/task";


interface TaskDashboardData {
  today: Task[];
  upcoming: Task[];
  next: Task[];
  waiting: Task[];
  blocked: Task[];
}


export function TaskDashboard() {

  const [data, setData] =
    useState<TaskDashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  useEffect(() => {

    async function loadDashboard() {

      try {

        const [
          today,
          upcoming,
          next,
          waiting,
          blocked,
        ] = await Promise.all([
          fetchTodayTasks(),
          fetchUpcomingTasks(7),
          fetchNextTasks(10),
          fetchWaitingTasks(),
          fetchBlockedTasks(),
        ]);


        setData({
          today,
          upcoming,
          next,
          waiting,
          blocked,
        });

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


    loadDashboard();

  }, []);


  if (loading) {
    return (
      <div>
        Loading task dashboard...
      </div>
    );
  }


  if (error) {
    return (
      <div>
        Error: {error}
      </div>
    );
  }


  if (!data) {
    return (
      <div>
        Task dashboard could not be loaded.
      </div>
    );
  }


  return (
    <div>

      <h1>
        Tasks
      </h1>


      <TaskSection
        title="🎯 Heute"
        count={data.today.length}
      >
        <TaskTable
          tasks={data.today}
        />
      </TaskSection>


      <TaskSection
        title="⚠️ Nächste 7 Tage"
        count={data.upcoming.length}
      >
        <TaskTable
          tasks={data.upcoming}
        />
      </TaskSection>


      <TaskSection
        title="🔜 Next"
        count={data.next.length}
      >
        <TaskTable
          tasks={data.next}
        />
      </TaskSection>


      <TaskSection
        title="⏳ Waiting"
        count={data.waiting.length}
      >
        <TaskTable
          tasks={data.waiting}
          showWaiting
        />
      </TaskSection>


      <TaskSection
        title="🚧 Blocked"
        count={data.blocked.length}
      >
        <TaskTable
          tasks={data.blocked}
          showBlocked
        />
      </TaskSection>

    </div>
  );
}