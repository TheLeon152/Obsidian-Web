export type VaultNodeType =
  | "file"
  | "folder";


export interface VaultNode {
  name: string;
  type: VaultNodeType;
  path: string;
  children?: VaultNode[];
}


export interface FolderEntry {
  name: string;
  path: string;
}


export interface FolderContent {
  name: string;
  path: string;

  folders: FolderEntry[];
  notes: FolderEntry[];
}