import { useEffect, useMemo, useState } from "react";

import { getTodayEvents } from "../../api/calendar";
import type { CalendarEvent } from "../../types/calendar";


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

    useEffect(() => {

        const interval = window.setInterval(() => {
            setCurrentTime(new Date());
        }, 60_000);

        return () => {
            window.clearInterval(interval);
        };

    }, []);


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

      const items = normalEvents.map(
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
            start: startMinutes,
            end: Math.max(
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

      const columns: PositionedEvent[][] =
        [];


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

      const groups: PositionedEvent[][] =
        [];


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


  if (loading) {

    return (
      <div>
        Kalender wird geladen...
      </div>
    );
  }


  if (error) {

    return (
      <div>
        ❌ {error}
      </div>
    );
  }

  const currentMinutes =
    currentTime.getHours() * 60
    + currentTime.getMinutes()
    + currentTime.getSeconds() / 60;


  return (
    <div
      style={{
        width: "100%",
      }}
    >

      {/* ========================================================
          Datum
      ======================================================== */}

      <div
        style={{
          marginBottom: "16px",

          color:
            "var(--text-muted)",

          fontSize:
            "0.9rem",
        }}
      >
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


      {/* ========================================================
          Ganztägige Termine
      ======================================================== */}

      {allDayEvents.length > 0 && (

        <div
          style={{
            marginBottom: "16px",
            marginLeft: "65px",
          }}
        >

          {allDayEvents.map(
            (event, index) => (

              <div
                key={`${event.summary}-${index}`}
                style={{
                  background:
                    "var(--interactive-accent)",

                  color:
                    "var(--text-on-accent)",

                  borderRadius:
                    "5px",

                  padding:
                    "6px 10px",

                  marginBottom:
                    "4px",

                  fontSize:
                    "0.85rem",
                }}
              >
                {event.summary}
              </div>

            )
          )}

        </div>

      )}


      {/* ========================================================
          Kalender
      ======================================================== */}

      <div
        style={{
          position: "relative",

          height: "1440px",

          width: "100%",
        }}
      >

        {/* ======================================================
            Stunden
        ====================================================== */}

        {Array.from(
          { length: 24 },
          (_, hour) => (

            <div
              key={hour}
              style={{
                position:
                  "absolute",

                top:
                  `${hour * 60}px`,

                left: 0,
                right: 0,

                height: "60px",

                borderTop:
                  "1px solid var(--background-modifier-border)",
              }}
            >

              <div
                style={{
                  position:
                    "absolute",

                  left: 0,

                  top:
                    "-9px",

                  width:
                    "55px",

                  paddingRight:
                    "10px",

                  textAlign:
                    "right",

                  color:
                    "var(--text-muted)",

                  fontSize:
                    "0.75rem",
                }}
              >
                {String(hour).padStart(
                  2,
                  "0"
                )}:00
              </div>

            </div>

          )
        )}


        {/* ======================================================
            Halb-Stunden-Linien
        ====================================================== */}

        {Array.from(
          { length: 24 },
          (_, hour) => (

            <div
              key={`half-${hour}`}
              style={{
                position:
                  "absolute",

                top:
                  `${hour * 60 + 30}px`,

                left:
                  "65px",

                right: 0,

                borderTop:
                  "1px dashed var(--background-modifier-border-hover)",

                pointerEvents:
                  "none",
              }}
            />

          )
        )}


        {/* ======================================================
            Kalenderfläche
        ====================================================== */}

        <div
          style={{
            position:
              "absolute",

            top: 0,
            bottom: 0,

            left:
              "65px",

            right: 0,

            borderLeft:
              "1px solid var(--background-modifier-border)",
          }}
        />


        {/* ======================================================
            Aktuelle Uhrzeit
        ====================================================== */}

        <div
        style={{
            position: "absolute",

            top: `${currentMinutes}px`,
            left: "65px",
            right: 0,

            height: "4px",

            backgroundColor: "red",

            zIndex: 9999,

            pointerEvents: "none",
        }}
        >
        <div
            style={{
            position: "absolute",

            left: "-6px",
            top: "-3px",

            width: "10px",
            height: "10px",

            borderRadius: "50%",

            backgroundColor: "red",
            }}
        />
        </div>


        {/* ======================================================
            Termine
        ====================================================== */}

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
             * ----------------------------------------------------
             * Horizontale Position
             * ----------------------------------------------------
             */

            const columnWidth =
              100 / item.columnCount;


            const left =
              `calc(${item.column} * ${columnWidth}% + ${gap}px)`;


            const width =
              `calc(${columnWidth}% - ${gap * 2}px)`;


            /*
             * ----------------------------------------------------
             * Vertikale Position
             * ----------------------------------------------------
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
                style={{
                  position:
                    "absolute",

                  top:
                    `${top}px`,

                  left,

                  width,

                  height:
                    `${height}px`,

                  borderLeft:
                    "4px solid var(--interactive-accent)",

                  background:
                    "var(--background-secondary)",

                  borderRadius:
                    "5px",

                  padding:
                    "5px 8px",

                  overflow:
                    "hidden",

                  cursor:
                    "default",

                  zIndex:
                    10 + item.column,

                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.08)",

                  transition:
                    "background 0.15s ease, box-shadow 0.15s ease",
                }}
              >

                {/* Zeit */}

                <div
                  style={{
                    fontSize:
                      "0.7rem",

                    color:
                      "var(--text-muted)",

                    marginBottom:
                      "2px",
                  }}
                >
                  {start.toLocaleTimeString(
                    "de-DE",
                    {
                      hour:
                        "2-digit",

                      minute:
                        "2-digit",
                    }
                  )}

                  {" – "}

                  {event.end &&
                    new Date(
                      event.end
                    ).toLocaleTimeString(
                      "de-DE",
                      {
                        hour:
                          "2-digit",

                        minute:
                          "2-digit",
                      }
                    )}
                </div>


                {/* Titel */}

                <div
                  style={{
                    fontSize:
                      "0.85rem",

                    fontWeight:
                      600,

                    lineHeight:
                      1.2,
                  }}
                >
                  {event.summary}
                </div>


                {/* Ort */}

                {event.location && (

                  <div
                    style={{
                      fontSize:
                        "0.7rem",

                      color:
                        "var(--text-muted)",

                      marginTop:
                        "3px",

                      whiteSpace:
                        "nowrap",

                      overflow:
                        "hidden",

                      textOverflow:
                        "ellipsis",
                    }}
                  >
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