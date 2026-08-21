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


  async function loadDashboard() {

    try {

      setError(null);

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


  useEffect(() => {

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
          onTaskUpdated={loadDashboard}
        />
      </TaskSection>


      <TaskSection
        title="⚠️ Nächste 7 Tage"
        count={data.upcoming.length}
      >
        <TaskTable
          tasks={data.upcoming}
          onTaskUpdated={loadDashboard}
        />
      </TaskSection>


      <TaskSection
        title="🔜 Next"
        count={data.next.length}
      >
        <TaskTable
          tasks={data.next}
          onTaskUpdated={loadDashboard}
        />
      </TaskSection>


      <TaskSection
        title="⏳ Waiting"
        count={data.waiting.length}
      >
        <TaskTable
          tasks={data.waiting}
          showWaiting
          onTaskUpdated={loadDashboard}
        />
      </TaskSection>


      <TaskSection
        title="🚧 Blocked"
        count={data.blocked.length}
      >
        <TaskTable
          tasks={data.blocked}
          showBlocked
          onTaskUpdated={loadDashboard}
        />
      </TaskSection>

    </div>
  );
}