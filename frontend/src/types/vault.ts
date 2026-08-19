export type VaultNodeType = "file" | "folder";

export interface VaultNode {
  name: string;
  type: VaultNodeType;
  path: string;
  children?: VaultNode[];
}