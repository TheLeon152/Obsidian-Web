export type VaultNodeType =
  | "file"
  | "folder";


export type FileType =
  | "markdown"
  | "canvas"
  | "image"
  | "pdf"
  | "csv"
  | "docx";


export interface VaultNode {
  name: string;
  type: VaultNodeType;
  path: string;
  file_type?: FileType;
  children?: VaultNode[];
}


export interface FolderEntry {
  name: string;
  path: string;
  file_type?: FileType;
}


export interface FolderContent {
  name: string;
  path: string;

  folders: FolderEntry[];
  files: FolderEntry[];
}