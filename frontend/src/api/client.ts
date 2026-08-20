import { API_BASE_URL } from "../config";
import { ApiError } from "./ApiError";


export async function apiFetch(
  path: string,
  options?: RequestInit,
): Promise<Response> {

  let response: Response;

  try {
    response = await fetch(
      `${API_BASE_URL}${path}`,
      options,
    );
  } catch {
    throw new Error(
      "Backend is not reachable.",
    );
  }

  if (!response.ok) {
    let message =
      `API request failed: ${response.status}`;

    try {
      const body = await response.json();

      if (
        body &&
        typeof body.detail === "string"
      ) {
        message = body.detail;
      }
    } catch {
      // Response enthält kein JSON.
    }

    throw new ApiError(
      response.status,
      message,
    );
  }

  return response;
}