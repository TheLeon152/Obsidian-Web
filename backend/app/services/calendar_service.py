from datetime import date, datetime, time, timedelta
from zoneinfo import ZoneInfo

import httpx
from icalendar import Calendar

from app.models.calendar import CalendarEvent


class CalendarService:

    def __init__(
        self,
        calendar_url: str,
    ):
        self.calendar_url = calendar_url

        self.timezone = ZoneInfo(
            "Europe/Berlin"
        )


    def get_today_events(
        self,
        today: date | None = None,
    ) -> list[CalendarEvent]:

        if today is None:
            today = date.today()

        ics_text = self._fetch_calendar()

        events = self._parse_calendar(
            ics_text
        )

        return self._filter_today(
            events,
            today,
        )


    def _fetch_calendar(self) -> str:

        response = httpx.get(
            self.calendar_url,
            timeout=10.0,
        )

        response.raise_for_status()

        return response.text


    def _parse_calendar(
        self,
        ics_text: str,
    ) -> list[CalendarEvent]:

        calendar = Calendar.from_ical(
            ics_text
        )

        events: list[CalendarEvent] = []

        for component in calendar.walk():

            if component.name != "VEVENT":
                continue


            # ----------------------------------------------------
            # Titel
            # ----------------------------------------------------

            summary = str(
                component.get(
                    "SUMMARY",
                    "(Ohne Titel)",
                )
            )


            # ----------------------------------------------------
            # Start
            # ----------------------------------------------------

            start_value = component.get(
                "DTSTART"
            )

            if start_value is None:
                continue

            start = start_value.dt


            # ----------------------------------------------------
            # Ende
            # ----------------------------------------------------

            end_value = component.get(
                "DTEND"
            )

            end = (
                end_value.dt
                if end_value is not None
                else None
            )


            # ----------------------------------------------------
            # Ort
            # ----------------------------------------------------

            location_value = component.get(
                "LOCATION"
            )

            location = (
                str(location_value)
                if location_value is not None
                else None
            )


            # ----------------------------------------------------
            # Ganztägiger Termin
            # ----------------------------------------------------

            all_day = (
                isinstance(start, date)
                and not isinstance(start, datetime)
            )


            if all_day:

                start = datetime.combine(
                    start,
                    time.min,
                    tzinfo=self.timezone,
                )

                if (
                    isinstance(end, date)
                    and not isinstance(end, datetime)
                ):
                    end = datetime.combine(
                        end,
                        time.min,
                        tzinfo=self.timezone,
                    )


            # ----------------------------------------------------
            # Normaler Termin
            # ----------------------------------------------------

            else:

                if start.tzinfo is None:
                    start = start.replace(
                        tzinfo=self.timezone
                    )
                else:
                    start = start.astimezone(
                        self.timezone
                    )

                if end is not None:

                    if end.tzinfo is None:
                        end = end.replace(
                            tzinfo=self.timezone
                        )
                    else:
                        end = end.astimezone(
                            self.timezone
                        )


            events.append(
                CalendarEvent(
                    summary=summary,
                    start=start,
                    end=end,
                    location=location,
                    all_day=all_day,
                )
            )


        return events


    def _filter_today(
        self,
        events: list[CalendarEvent],
        today: date,
    ) -> list[CalendarEvent]:

        start_of_day = datetime.combine(
            today,
            time.min,
            tzinfo=self.timezone,
        )

        end_of_day = (
            start_of_day
            + timedelta(days=1)
        )


        result: list[CalendarEvent] = []


        for event in events:

            # ====================================================
            # GANZTÄGIGE TERMINE
            # ====================================================

            if event.all_day:

                start = event.start

                end = event.end


                if (
                    start < end_of_day
                    and (
                        end is None
                        or end > start_of_day
                    )
                ):
                    result.append(event)

                continue


            # ====================================================
            # NORMALE TERMINE
            # ====================================================

            start = event.start

            end = event.end


            if start.tzinfo is None:
                start = start.replace(
                    tzinfo=self.timezone
                )
            else:
                start = start.astimezone(
                    self.timezone
                )


            if end is not None:

                if end.tzinfo is None:
                    end = end.replace(
                        tzinfo=self.timezone
                    )
                else:
                    end = end.astimezone(
                        self.timezone
                    )


            if (
                start < end_of_day
                and (
                    end is None
                    or end > start_of_day
                )
            ):

                result.append(
                    CalendarEvent(
                        summary=event.summary,
                        start=start,
                        end=end,
                        location=event.location,
                        all_day=False,
                    )
                )


        return sorted(
            result,
            key=lambda event: event.start,
        )