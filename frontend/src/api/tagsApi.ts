const API_BASE_URL =
  "http://localhost:8000";


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
  const response = await fetch(
    `${API_BASE_URL}/api/v1/tags`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load tags."
    );
  }

  return response.json();
}


export async function fetchNotesForTag(
  tag: string
): Promise<TagNotesResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/tags/${encodeURIComponent(tag)}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to load notes for tag."
    );
  }

  return response.json();
}