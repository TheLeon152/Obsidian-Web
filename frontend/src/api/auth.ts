import type {
  LoginRequest,
  TokenResponse,
} from "../types/auth";

import { API_BASE_URL } from "../config";


export async function login(
  credentials: LoginRequest,
): Promise<TokenResponse> {

  const response = await fetch(
    `${API_BASE_URL}/api/v1/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(credentials),
    },
  );


  if (!response.ok) {

    let message =
      "Login failed.";

    try {

      const body =
        await response.json();

      if (
        body &&
        typeof body.detail === "string"
      ) {
        message = body.detail;
      }

    } catch {
      // Response enthält kein JSON.
    }

    throw new Error(message);
  }


  return response.json();
}


export async function refreshToken(
  refresh_token: string,
): Promise<TokenResponse> {

  const response = await fetch(
    `${API_BASE_URL}/api/v1/auth/refresh`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        refresh_token,
      }),
    },
  );


  if (!response.ok) {
    throw new Error("Refresh token is invalid.");
  }


  return response.json();
}