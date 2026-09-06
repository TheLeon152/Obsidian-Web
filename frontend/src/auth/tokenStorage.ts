const ACCESS_TOKEN_KEY =
  "obsidian_web_access_token";

const REFRESH_TOKEN_KEY =
  "obsidian_web_refresh_token";


export function getAccessToken(): string | null {

  return sessionStorage.getItem(
    ACCESS_TOKEN_KEY
  );
}


export function getRefreshToken(): string | null {

  return sessionStorage.getItem(
    REFRESH_TOKEN_KEY
  );
}


export function setTokens(
  accessToken: string,
  refreshToken: string,
): void {

  sessionStorage.setItem(
    ACCESS_TOKEN_KEY,
    accessToken,
  );

  sessionStorage.setItem(
    REFRESH_TOKEN_KEY,
    refreshToken,
  );
}


export function clearTokens(): void {

  sessionStorage.removeItem(
    ACCESS_TOKEN_KEY
  );

  sessionStorage.removeItem(
    REFRESH_TOKEN_KEY
  );
}