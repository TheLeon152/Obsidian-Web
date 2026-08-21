import { useEffect, useState } from "react";

import "./WorkloadWidget.css";

import type { TaskWorkload } from "../../types/task";
import { getTaskWorkload } from "../../api/tasks";


export function WorkloadWidget() {

  const [workload, setWorkload] =
    useState<TaskWorkload | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  useEffect(() => {

    async function loadWorkload() {

      try {

        const data =
          await getTaskWorkload(7);

        setWorkload(data);

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


    loadWorkload();

  }, []);


  if (loading) {
    return (
      <section className="workload-widget">
        <div className="workload-header">
          <div>
            <h2>📊 Arbeitslast</h2>
            <span className="workload-period">
              wird geladen...
            </span>
          </div>
        </div>
      </section>
    );
  }


  if (error) {
    return (
      <section className="workload-widget">
        <div className="workload-header">
          <div>
            <h2>📊 Arbeitslast</h2>
            <span className="workload-period">
              Fehler beim Laden
            </span>
          </div>
        </div>

        <p className="workload-error">
          {error}
        </p>
      </section>
    );
  }


  if (!workload) {
    return null;
  }


  const filled =
    Math.min(
      Math.max(workload.score, 0),
      10
    );

  const empty =
    10 - filled;


  const bar =
    "█".repeat(filled) +
    "░".repeat(empty);


  return (
    <section className="workload-widget">

        <div className="workload-header">
        <div>
            <h2>📊 Arbeitslast</h2>

            <span className="workload-period">
            nächste {workload.days} Tage
            </span>
        </div>
        </div>


        <div className="workload-stats">

        <div className="workload-stat">
            <span>Deadlines</span>
            <strong>
            {workload.deadline_count}
            </strong>
        </div>

        <div className="workload-stat">
            <span>High Priority</span>
            <strong>
            {workload.high_priority_count}
            </strong>
        </div>

        <div className="workload-stat">
            <span>Waiting</span>
            <strong>
            {workload.waiting_count}
            </strong>
        </div>

        <div className="workload-stat">
            <span>Blocked</span>
            <strong>
            {workload.blocked_count}
            </strong>
        </div>

        </div>


        <div className="workload-assessment">

        <div className="workload-bar">
            <span>
            {bar}
            </span>
        </div>

        <strong>
            {workload.level}
        </strong>

        </div>

    </section>
    );
}