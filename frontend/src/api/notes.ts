import type { Note } from "../types/note";
import { apiFetch } from "./client";


interface NoteReference {
  name: string;
  path: string;
}


export async function getNote(
  path: string,
): Promise<Note> {

  const response = await apiFetch(
    `/api/v1/notes/${encodeURI(path)}`,
  );

  return response.json();
}


export async function resolveNote(
  target: string,
): Promise<NoteReference> {

  const response = await apiFetch(
    `/api/v1/notes/resolve/${encodeURIComponent(target)}`,
  );

  return response.json();
}