import { API_BASE_URL } from "../config";


export interface SearchResult {
  name: string;
  path: string;
  tags: string[];
}


export interface SearchResponse {
  results: SearchResult[];
}


export async function searchNotes(
  query: string
): Promise<SearchResponse> {

  const response = await fetch(
    `${API_BASE_URL}/api/v1/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to search notes: ${response.status}`
    );
  }

  return response.json();
}