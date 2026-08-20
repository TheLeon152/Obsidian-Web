from datetime import date

from fastapi import APIRouter, HTTPException

from app.config import settings
from app.models.calendar import CalendarEvent
from app.services.calendar_service import CalendarService


router = APIRouter(
    prefix="/api/v1/calendar",
    tags=["calendar"],
)


calendar_service = CalendarService(
    settings.google_calendar_url
)


@router.get(
    "/today",
    response_model=list[CalendarEvent],
)
def get_today_events() -> list[CalendarEvent]:

    try:

        return calendar_service.get_today_events()

    except Exception as error:

        raise HTTPException(
            status_code=502,
            detail=f"Could not load calendar: {error}",
        )