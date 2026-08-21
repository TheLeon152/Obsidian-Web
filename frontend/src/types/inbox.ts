export interface InboxNote {
  filename: string;
  content: string;
}


export interface InboxNoteSummary {
  filename: string;
  modified_at: string | null;
}


export interface CreateInboxNote {
  filename: string;
  content: string;
}