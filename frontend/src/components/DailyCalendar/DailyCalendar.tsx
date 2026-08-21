import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { getTodayEvents } from "../../api/calendar";
import type { CalendarEvent } from "../../types/calendar";

import "./DailyCalendar.css";


interface PositionedEvent {
  event: CalendarEvent;
  start: number;
  end: number;
  column: number;
  columnCount: number;
}


export function DailyCalendar() {

  const [events, setEvents] =
    useState<CalendarEvent[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [currentTime, setCurrentTime] =
    useState(new Date());


  /*
   * ============================================================
   * Aktuelle Uhrzeit aktualisieren
   * ============================================================
   */

  useEffect(() => {

    const interval =
      window.setInterval(() => {
        setCurrentTime(new Date());
      }, 60_000);

    return () => {
      window.clearInterval(interval);
    };

  }, []);


  /*
   * ============================================================
   * Kalender laden
   * ============================================================
   */

  useEffect(() => {

    async function loadCalendar() {

      try {

        setLoading(true);
        setError(null);

        const data =
          await getTodayEvents();

        setEvents(data);

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


    loadCalendar();

  }, []);


  /*
   * ============================================================
   * Ganztägige / normale Termine
   * ============================================================
   */

  const allDayEvents =
    useMemo(
      () =>
        events.filter(
          event => event.all_day
        ),
      [events]
    );


  const normalEvents =
    useMemo(
      () =>
        events.filter(
          event => !event.all_day
        ),
      [events]
    );


  /*
   * ============================================================
   * Positionierung überlappender Termine
   * ============================================================
   */

  const positionedEvents =
    useMemo<PositionedEvent[]>(() => {

      const items =
        normalEvents.map(
          event => {

            const start =
              new Date(event.start);

            const end =
              event.end
                ? new Date(event.end)
                : new Date(
                    start.getTime()
                    + 30 * 60 * 1000
                  );


            const startMinutes =
              start.getHours() * 60
              + start.getMinutes()
              + start.getSeconds() / 60;


            const endMinutes =
              end.getHours() * 60
              + end.getMinutes()
              + end.getSeconds() / 60;


            return {
              event,

              start:
                startMinutes,

              end:
                Math.max(
                  endMinutes,
                  startMinutes + 20
                ),

              column: 0,

              columnCount: 1,
            };
          }
        );


      /*
       * ----------------------------------------------------------
       * Spalten bestimmen
       * ----------------------------------------------------------
       */

      const columns:
        PositionedEvent[][] = [];


      for (const item of items) {

        let column = 0;


        while (true) {

          const conflict =
            columns[column]?.some(
              other =>
                item.start < other.end
                &&
                item.end > other.start
            );


          if (!conflict) {
            break;
          }


          column++;
        }


        item.column = column;


        if (!columns[column]) {
          columns[column] = [];
        }


        columns[column].push(item);
      }


      /*
       * ----------------------------------------------------------
       * Überschneidungsgruppen bestimmen
       * ----------------------------------------------------------
       */

      const groups:
        PositionedEvent[][] = [];


      for (const item of items) {

        let group =
          groups.find(
            existingGroup =>
              existingGroup.some(
                other =>
                  item.start < other.end
                  &&
                  item.end > other.start
              )
          );


        if (!group) {

          group = [];

          groups.push(group);
        }


        group.push(item);
      }


      /*
       * ----------------------------------------------------------
       * Maximale Spaltenzahl pro Gruppe
       * ----------------------------------------------------------
       */

      for (const group of groups) {

        const columnCount =
          Math.max(
            ...group.map(
              item => item.column
            )
          ) + 1;


        for (const item of group) {

          item.columnCount =
            columnCount;

        }
      }


      return items;

    }, [normalEvents]);


  /*
   * ============================================================
   * Zustände
   * ============================================================
   */

  if (loading) {

    return (
      <div className="daily-calendar-state">
        Kalender wird geladen...
      </div>
    );

  }


  if (error) {

    return (
      <div className="daily-calendar-state daily-calendar-error">
        ❌ {error}
      </div>
    );

  }


  /*
   * ============================================================
   * Aktuelle Uhrzeit
   * ============================================================
   */

  const currentMinutes =
    currentTime.getHours() * 60
    + currentTime.getMinutes()
    + currentTime.getSeconds() / 60;


  /*
   * ============================================================
   * Render
   * ============================================================
   */

  return (
    <div className="daily-calendar-container">

      {/* ======================================================
          Datum
      ====================================================== */}

      <div className="calendar-date">

        {new Date().toLocaleDateString(
          "de-DE",
          {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        )}

      </div>


      {/* ======================================================
          Ganztägige Termine
      ====================================================== */}

      {allDayEvents.length > 0 && (

        <div className="calendar-all-day">

          {allDayEvents.map(
            (event, index) => (

              <div
                key={`${event.summary}-${index}`}
                className="calendar-all-day-event"
              >
                {event.summary}
              </div>

            )
          )}

        </div>

      )}


      {/* ======================================================
          Kalender
      ====================================================== */}

      <div className="daily-calendar">

        {/* ====================================================
            Stunden
        ==================================================== */}

        {Array.from(
          { length: 24 },
          (_, hour) => (

            <div
              key={hour}
              className="calendar-hour"
              style={{
                top: `${hour * 60}px`,
              }}
            >

              <div className="calendar-hour-label">

                {String(hour).padStart(
                  2,
                  "0"
                )}:00

              </div>

            </div>

          )
        )}


        {/* ====================================================
            Halb-Stunden-Linien
        ==================================================== */}

        {Array.from(
          { length: 24 },
          (_, hour) => (

            <div
              key={`half-${hour}`}
              className="calendar-half-hour"
              style={{
                top:
                  `${hour * 60 + 30}px`,
              }}
            />

          )
        )}


        {/* ====================================================
            Kalenderfläche
        ==================================================== */}

        <div className="calendar-surface" />


        {/* ====================================================
            Aktuelle Uhrzeit
        ==================================================== */}

        <div
          className="calendar-current-time"
          style={{
            top: `${currentMinutes}px`,
          }}
        >
          <div className="calendar-current-time-dot" />
        </div>


        {/* ====================================================
            Termine
        ==================================================== */}

        {positionedEvents.map(
          (item, index) => {

            const event =
              item.event;


            const start =
              new Date(
                event.start
              );


            const gap = 4;


            /*
             * --------------------------------------------------
             * Horizontale Position
             * --------------------------------------------------
             */

            const columnWidth =
              100 / item.columnCount;


            const left =
              `calc(${item.column} * ${columnWidth}% + ${gap}px)`;


            const width =
              `calc(${columnWidth}% - ${gap * 2}px)`;


            /*
             * --------------------------------------------------
             * Vertikale Position
             * --------------------------------------------------
             */

            const top =
              item.start;


            const height =
              Math.max(
                item.end - item.start,
                20
              );


            return (

              <div
                key={`${event.summary}-${index}`}
                className="calendar-event"
                style={{
                  top: `${top}px`,
                  left,
                  width,
                  height: `${height}px`,
                }}
              >

                {/* Zeit */}

                <div className="calendar-event-time">

                  {start.toLocaleTimeString(
                    "de-DE",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}

                  {" – "}

                  {event.end &&
                    new Date(
                      event.end
                    ).toLocaleTimeString(
                      "de-DE",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}

                </div>


                {/* Titel */}

                <div className="calendar-event-title">
                  {event.summary}
                </div>


                {/* Ort */}

                {event.location && (

                  <div className="calendar-event-location">
                    📍 {event.location}
                  </div>

                )}

              </div>

            );

          }
        )}

      </div>

    </div>
  );
}