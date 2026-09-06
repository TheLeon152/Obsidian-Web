import { apiFetch } from "./client";


export interface SearchResult {
  name: string;
  path: string;
  tags: string[];
  context: string | null;
}


export interface SearchResponse {
  results: SearchResult[];
}


export async function searchNotes(
  query: string
): Promise<SearchResponse> {

  const response = await apiFetch(
    `/api/v1/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to search notes: ${response.status}`
    );
  }

  return response.json();
}