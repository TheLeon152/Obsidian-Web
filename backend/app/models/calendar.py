from datetime import datetime

from pydantic import BaseModel


class CalendarEvent(BaseModel):

    summary: str
    start: datetime
    end: datetime | None = None

    location: str | None = None

    all_day: bool = False