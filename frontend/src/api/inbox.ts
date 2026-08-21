import { API_BASE_URL } from "../config";

import type { CreateInboxNote, InboxNote, InboxNoteSummary } from "../types/inbox";


export async function fetchInboxNotes(): Promise<
  InboxNoteSummary[]
> {

  const response = await fetch(
    `${API_BASE_URL}/api/v1/inbox`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load inbox: ${response.status}`
    );
  }

  return response.json();
}


export async function fetchInboxNote(
  filename: string,
): Promise<InboxNote> {

  const response = await fetch(
    `${API_BASE_URL}/api/v1/inbox/${encodeURIComponent(
      filename
    )}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load inbox note: ${response.status}`
    );
  }

  return response.json();
}


export async function createInboxNote(
  note: CreateInboxNote,
): Promise<InboxNote> {

  const response = await fetch(
    `${API_BASE_URL}/api/v1/inbox`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(note),
    }
  );

  if (!response.ok) {

    const detail =
      await response.text();

    throw new Error(
      `Failed to create inbox note: ${response.status} ${detail}`
    );
  }

  return response.json();
}


export async function updateInboxNote(
  filename: string,
  content: string,
): Promise<InboxNote> {

  const response = await fetch(
    `${API_BASE_URL}/api/v1/inbox/${encodeURIComponent(
      filename
    )}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        content,
      }),
    }
  );

  if (!response.ok) {

    const detail =
      await response.text();

    throw new Error(
      `Failed to update inbox note: ${response.status} ${detail}`
    );
  }

  return response.json();
}


export async function deleteInboxNote(
  filename: string,
): Promise<void> {

  const response = await fetch(
    `${API_BASE_URL}/api/v1/inbox/${encodeURIComponent(
      filename
    )}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {

    const detail =
      await response.text();

    throw new Error(
      `Failed to delete inbox note: ${response.status} ${detail}`
    );
  }
}