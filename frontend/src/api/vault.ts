import type {
  FolderContent,
  VaultNode,
} from "../types/vault";

import { apiFetch } from "./client";


export async function getVaultTree(): Promise<VaultNode> {

  const response = await apiFetch(
    "/api/v1/vault/tree",
  );

  return response.json();
}


export async function getFolderContent(
  path: string,
): Promise<FolderContent> {

  const response = await apiFetch(
    `/api/v1/vault/folder/${encodeURIComponent(path)}`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load folder: ${response.status}`
    );
  }

  return response.json();
}


export async function refreshVault(): Promise<void> {

  const response = await apiFetch(
    "/api/v1/vault/refresh",
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to refresh vault: ${response.status}`
    );
  }
}