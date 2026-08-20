import { API_BASE_URL } from "../config";
import type {
  Task,
  TaskWorkload,
} from "../types/task";

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/tasks`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load tasks: ${response.status}`
    );
  }

  return response.json();
}


export async function fetchTodayTasks(): Promise<Task[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/tasks/today`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load today's tasks: ${response.status}`
    );
  }

  return response.json();
}


export async function fetchUpcomingTasks(
  days: number = 7
): Promise<Task[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/tasks/upcoming?days=${days}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load upcoming tasks: ${response.status}`
    );
  }

  return response.json();
}


export async function fetchNextTasks(
  limit: number = 10
): Promise<Task[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/tasks/next?limit=${limit}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load next tasks: ${response.status}`
    );
  }

  return response.json();
}


export async function fetchWaitingTasks(): Promise<Task[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/tasks/waiting`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load waiting tasks: ${response.status}`
    );
  }

  return response.json();
}


export async function fetchBlockedTasks(): Promise<Task[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/tasks/blocked`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load blocked tasks: ${response.status}`
    );
  }

  return response.json();
}


export async function getTaskWorkload(
  days: number = 7
): Promise<TaskWorkload> {

  const response = await fetch(
    `${API_BASE_URL}/api/v1/tasks/workload?days=${days}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load task workload: ${response.status}`
    );
  }

  return response.json();
}