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

import { WorkloadWidget } from "../../components/WorkloadWidget/WorkloadWidget";

import { DailyCalendar } from "../../components/DailyCalendar/DailyCalendar";


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


  useEffect(() => {

    async function loadTasks() {

      try {

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
        />

        <WorkloadWidget />

      </div>


      {/* ========================================================
          Upcoming Tasks
      ======================================================== */}

      <UpcomingTasks
        tasks={upcomingTasks}
      />


      {/* ========================================================
          Waiting + Blocked
      ======================================================== */}

      <div className="daily-grid">

        <WaitingTasks
          tasks={waitingTasks}
        />

        <BlockedTasks
          tasks={blockedTasks}
        />

      </div>

    </div>
  );
}


interface TaskListProps {
  tasks: Task[];
}


function TodayTasks({
  tasks,
}: TaskListProps) {

  return (
    <section className="daily-card">

      <h2>
        🎯 Today's Tasks
      </h2>


      {tasks.length === 0 ? (

        <p className="empty-state">
          Keine Aufgaben für heute.
        </p>

      ) : (

        <div className="task-list">

          {tasks.map(task => (

            <div
              className="task-row"
              key={`${task.path}:${task.line}`}
            >

              <span className="task-text">
                {task.text}
              </span>

              <span
                className={
                  `task-priority priority-${task.priority ?? "none"}`
                }
              >
                {task.priority ?? "—"}
              </span>

            </div>

          ))}

        </div>

      )}

    </section>
  );
}


function UpcomingTasks({
  tasks,
}: TaskListProps) {

  return (
    <section className="daily-card">

      <h2>
        ⚠️ Deadlines – nächste 7 Tage
      </h2>


      {tasks.length === 0 ? (

        <p className="empty-state">
          Keine bevorstehenden Deadlines.
        </p>

      ) : (

        <table className="task-table">

          <thead>

            <tr>

              <th>
                Task
              </th>

              <th>
                Bereich
              </th>

              <th>
                Deadline
              </th>

              <th>
                Priorität
              </th>

            </tr>

          </thead>


          <tbody>

            {tasks.map(task => (

              <tr
                key={`${task.path}:${task.line}`}
              >

                <td>
                  {task.text}
                </td>

                <td>
                  {task.path}
                </td>

                <td>
                  {formatDate(task.deadline)}
                </td>

                <td>

                  <span
                    className={
                      `task-priority priority-${task.priority ?? "none"}`
                    }
                  >
                    {task.priority ?? "—"}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

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


function WaitingTasks({
  tasks,
}: TaskListProps) {

  return (
    <section className="daily-card">

      <h2>
        ⏳ Waiting
      </h2>


      {tasks.length === 0 ? (

        <p className="empty-state">
          Keine Waiting Tasks.
        </p>

      ) : (

        <div className="task-list">

          {tasks.map(task => (

            <div
              className="task-row task-row-column"
              key={`${task.path}:${task.line}`}
            >

              <strong>
                {task.text}
              </strong>

              <span>
                {task.waiting_for ?? "—"}
              </span>

              <small>
                Nachfassen:{" "}
                {formatDate(task.follow_up)}
              </small>

            </div>

          ))}

        </div>

      )}

    </section>
  );
}


function BlockedTasks({
  tasks,
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

            <div
              className="task-row task-row-column"
              key={`${task.path}:${task.line}`}
            >

              <strong>
                {task.text}
              </strong>

              <span>
                Blockiert durch:{" "}
                {task.blocked_by ?? "—"}
              </span>

            </div>

          ))}

        </div>

      )}

    </section>
  );
}