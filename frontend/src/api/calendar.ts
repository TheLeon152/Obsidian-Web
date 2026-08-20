import { API_BASE_URL } from "../config";

import type { CalendarEvent } from "../types/calendar";

export async function getTodayEvents(): Promise<
  CalendarEvent[]
> {
    console.log(
    "Calendar API URL:",
    `${API_BASE_URL}/api/v1/calendar/today`
  );


  const response = await fetch(
    `${API_BASE_URL}/api/v1/calendar/today`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load calendar: ${response.status}`
    );
  }

  return response.json();
}