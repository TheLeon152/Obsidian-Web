import { API_BASE_URL } from "../config";
import { refreshToken } from "./auth";


let accessToken: string | null =
  localStorage.getItem("access_token");


let refreshTokenValue: string | null =
  localStorage.getItem("refresh_token");


export function setTokens(
  access: string,
  refresh: string,
) {
  accessToken = access;
  refreshTokenValue = refresh;

  localStorage.setItem(
    "access_token",
    access,
  );

  localStorage.setItem(
    "refresh_token",
    refresh,
  );
}


export function clearTokens() {
  accessToken = null;
  refreshTokenValue = null;

  localStorage.removeItem(
    "access_token",
  );

  localStorage.removeItem(
    "refresh_token",
  );
}


export function getAccessToken(): string | null {
  return accessToken;
}


async function refreshAccessToken(): Promise<boolean> {

  if (!refreshTokenValue) {
    return false;
  }

  try {

    const tokens =
      await refreshToken(
        refreshTokenValue,
      );

    setTokens(
      tokens.access_token,
      tokens.refresh_token,
    );

    return true;

  } catch {

    clearTokens();

    return false;
  }
}


export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {

  const headers =
    new Headers(
      options.headers,
    );


  if (accessToken) {

    headers.set(
      "Authorization",
      `Bearer ${accessToken}`,
    );
  }


  let response =
    await fetch(
      `${API_BASE_URL}${path}`,
      {
        ...options,
        headers,
      },
    );


  /*
   * Access Token abgelaufen.
   * Einmal Refresh versuchen.
   */

  if (
    response.status === 401 &&
    refreshTokenValue
  ) {

    const refreshed =
      await refreshAccessToken();


    if (refreshed) {

      headers.set(
        "Authorization",
        `Bearer ${accessToken}`,
      );

      response =
        await fetch(
          `${API_BASE_URL}${path}`,
          {
            ...options,
            headers,
          },
        );
    }
  }


  return response;
}