import type { Note } from "../types/note";

interface NoteReference {
  name: string;
  path: string;
}


const API_BASE_URL =
  "http://localhost:8000";


export async function getNote(
  path: string
): Promise<Note> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/notes/${encodeURI(path)}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load note: ${response.status}`
    );
  }

  return response.json();
}


export async function resolveNote(
  target: string
): Promise<NoteReference> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/notes/resolve/${encodeURIComponent(target)}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to resolve note: ${response.status}`
    );
  }

  return response.json();
}