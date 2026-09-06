import { apiFetch } from "./client";


export interface TagIndexResponse {
  tags: string[];
}


export interface TagNotesResponse {
  tag: string;
  notes: string[];
}


export async function fetchTags(): Promise<
  TagIndexResponse
> {
  const response = await apiFetch(
    "/api/v1/tags",
  );

  return response.json();
}


export async function fetchNotesForTag(
  tag: string,
): Promise<TagNotesResponse> {

  const response = await apiFetch(
    `/api/v1/tags/${encodeURIComponent(tag)}`,
  );

  return response.json();
}