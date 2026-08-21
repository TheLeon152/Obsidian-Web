import {
  useEffect,
  useState,
} from "react";

import type {
  Task,
} from "../../types/task";

import "./DailyPage.css";

import {
  fetchBlockedTasks,
  fetchUpcomingTasks,
  fetchWaitingTasks,
  fetchTodayTasks,
} from "../../api/tasks";

import {
  WorkloadWidget,
} from "../../components/WorkloadWidget/WorkloadWidget";

import {
  DailyCalendar,
} from "../../components/DailyCalendar/DailyCalendar";

import {
  TaskRow,
} from "../../components/TaskRow/TaskRow";


export function DailyPage() {

  const [todayTasks, setTodayTasks] =
    useState<Task[]>([]);

  const [upcomingTasks, setUpcomingTasks] =
    useState<Task[]>([]);

  const [waitingTasks, setWaitingTasks] =
    useState<Task[]>([]);

  const [blockedTasks, setBlockedTasks] =
    useState<Task[]>([]);


  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  async function loadTasks() {

    try {

      setLoading(true);
      setError(null);

      const [
        today,
        upcoming,
        waiting,
        blocked,
      ] = await Promise.all([
        fetchTodayTasks(),
        fetchUpcomingTasks(7),
        fetchWaitingTasks(),
        fetchBlockedTasks(),
      ]);

      setTodayTasks(today);
      setUpcomingTasks(upcoming);
      setWaitingTasks(waiting);
      setBlockedTasks(blocked);

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

    loadTasks();

  }, []);


  const today =
    new Date();


  const formattedDate =
    today.toLocaleDateString(
      "de-DE",
      {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );


  if (loading) {

    return (
      <div className="daily-page">
        <p>Loading dashboard...</p>
      </div>
    );
  }


  if (error) {

    return (
      <div className="daily-page">
        <p>
          Error: {error}
        </p>
      </div>
    );
  }


  return (
    <div className="daily-page">

      {/* ========================================================
          Header
      ======================================================== */}

      <header className="daily-header">

        <h1>
          📅 Tagesübersicht
        </h1>

        <p>
          {formattedDate}
        </p>

      </header>


      {/* ========================================================
          Kalender
      ======================================================== */}

      <section className="daily-calendar-section">

        <DailyCalendar />

      </section>


      {/* ========================================================
          Heute + Belastung
      ======================================================== */}

      <div className="daily-grid">

        <TodayTasks
          tasks={todayTasks}
          onTaskUpdated={loadTasks}
        />

        <WorkloadWidget />

      </div>


      {/* ========================================================
          Upcoming Tasks
      ======================================================== */}

      <UpcomingTasks
        tasks={upcomingTasks}
        onTaskUpdated={loadTasks}
      />


      {/* ========================================================
          Waiting + Blocked
      ======================================================== */}

      <div className="daily-grid">

        <WaitingTasks
          tasks={waitingTasks}
          onTaskUpdated={loadTasks}
        />

        <BlockedTasks
          tasks={blockedTasks}
          onTaskUpdated={loadTasks}
        />

      </div>

    </div>
  );
}


interface TaskListProps {
  tasks: Task[];
  onTaskUpdated: () => void;
}


function TodayTasks({
  tasks,
  onTaskUpdated,
}: TaskListProps) {

  const sortedTasks = [
    ...tasks,
  ].sort(
    (a, b) =>
      Number(a.completed)
      - Number(b.completed)
  );


  return (
    <section className="daily-card">

      <h2>
        🎯 Today's Tasks
      </h2>


      {sortedTasks.length === 0 ? (

        <p className="empty-state">
          Keine Aufgaben für heute.
        </p>

      ) : (

        <div className="task-list">

          {sortedTasks.map(task => (

            <TaskRow
              key={`${task.path}:${task.line}`}
              task={task}
              onUpdated={onTaskUpdated}
            />

          ))}

        </div>

      )}

    </section>
  );
}


function UpcomingTasks({
  tasks,
  onTaskUpdated,
}: TaskListProps) {

  const sortedTasks = [
    ...tasks,
  ].sort(
    (a, b) => {

      const dateA =
        a.deadline ?? "";

      const dateB =
        b.deadline ?? "";

      return dateA.localeCompare(
        dateB
      );
    }
  );


  return (
    <section className="daily-card">

      <h2>
        ⚠️ Deadlines – nächste 7 Tage
      </h2>


      {sortedTasks.length === 0 ? (

        <p className="empty-state">
          Keine bevorstehenden Deadlines.
        </p>

      ) : (

        <div className="task-list">

          {sortedTasks.map(task => (

            <TaskRow
              key={`${task.path}:${task.line}`}
              task={task}
              onUpdated={onTaskUpdated}
              secondaryContent={(
                <span>
                  📅 {formatDate(task.deadline)}
                </span>
              )}
            />

          ))}

        </div>

      )}

    </section>
  );
}


function WaitingTasks({
  tasks,
  onTaskUpdated,
}: TaskListProps) {

  const sortedTasks = [
    ...tasks,
  ].sort(
    (a, b) => {

      const dateA =
        a.follow_up ?? "9999-12-31";

      const dateB =
        b.follow_up ?? "9999-12-31";

      return dateA.localeCompare(
        dateB
      );
    }
  );


  return (
    <section className="daily-card">

      <h2>
        ⏳ Waiting
      </h2>


      {sortedTasks.length === 0 ? (

        <p className="empty-state">
          Keine Waiting Tasks.
        </p>

      ) : (

        <div className="task-list">

          {sortedTasks.map(task => (

            <TaskRow
              key={`${task.path}:${task.line}`}
              task={task}
              onUpdated={onTaskUpdated}
              secondaryContent={(
                <>
                  <span>
                    Wartet auf:{" "}
                    {task.waiting_for ?? "—"}
                  </span>

                  <span>
                    Nachfassen:{" "}
                    {formatDate(task.follow_up)}
                  </span>
                </>
              )}
            />

          ))}

        </div>

      )}

    </section>
  );
}


function BlockedTasks({
  tasks,
  onTaskUpdated,
}: TaskListProps) {

  return (
    <section className="daily-card">

      <h2>
        🚧 Blocked
      </h2>


      {tasks.length === 0 ? (

        <p className="empty-state">
          Keine blockierten Tasks.
        </p>

      ) : (

        <div className="task-list">

          {tasks.map(task => (

            <TaskRow
              key={`${task.path}:${task.line}`}
              task={task}
              onUpdated={onTaskUpdated}
              secondaryContent={(
                <span>
                  Blockiert durch:{" "}
                  {task.blocked_by ?? "—"}
                </span>
              )}
            />

          ))}

        </div>

      )}

    </section>
  );
}


function formatDate(
  value: string | null
): string {

  if (!value) {
    return "—";
  }

  const date =
    new Date(`${value}T00:00:00`);

  return date.toLocaleDateString(
    "de-DE"
  );
}