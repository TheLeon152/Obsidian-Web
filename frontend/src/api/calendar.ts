import type { CalendarEvent } from "../types/calendar";
import { apiFetch } from "./client";

export async function getTodayEvents(): Promise<
  CalendarEvent[]
>{
  const response = await apiFetch(
    `/api/v1/calendar/today`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load calendar: ${response.status}`
    );
  }

  return response.json();
}