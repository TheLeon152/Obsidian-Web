import type { VaultNode } from "../types/vault";
import { apiFetch } from "./client";


export async function getVaultTree(): Promise<VaultNode> {

  const response = await apiFetch(
    "/api/v1/vault/tree",
  );

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