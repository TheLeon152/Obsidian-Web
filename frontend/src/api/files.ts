import type { FileType } from "../types/vault";
import { apiFetch } from "./client";


export interface FileMetadata {
  name: string;
  path: string;
  file_type: FileType;
  size: number;
}


export async function getFileMetadata(
  path: string,
): Promise<FileMetadata> {

  const response = await apiFetch(
    `/api/v1/files/metadata/${encodeURI(path)}`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load file metadata: ${response.status}`,
    );
  }

  return response.json();
}


export async function getFile(
  path: string,
): Promise<Response> {

  const response = await apiFetch(
    `/api/v1/files/${encodeURI(path)}`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load file: ${response.status}`,
    );
  }

  return response;
}

export async function getDocxContent(path: string): Promise<string> {
  const response = await apiFetch(
    `/api/v1/files/docx/${encodeURI(path)}`
  );

  if (!response.ok) {
    throw new Error(`Failed to load DOCX: ${response.status}`);
  }

  return response.text();
}