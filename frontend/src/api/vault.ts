import type { VaultNode } from "../types/vault";

const API_BASE_URL = "http://localhost:8000";

export async function getVaultTree(): Promise<VaultNode> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/vault/tree`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load vault tree: ${response.status}`
    );
  }

  return response.json();
}