
export interface CalendarEvent {
  summary: string;
  start: string;
  end: string | null;
  location: string | null;
  all_day: boolean;
}