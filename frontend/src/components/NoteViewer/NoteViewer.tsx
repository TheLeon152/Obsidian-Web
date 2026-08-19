import type { Note } from "../../types/note";
import { MarkdownRenderer } from "../MarkdownRenderer/MarkdownRenderer";

interface NoteViewerProps {
  note: Note | null;
  loading: boolean;
  error: string | null;

  onWikiLinkClick: (
    target: string
  ) => void;

  onTagClick: (
    tag: string
  ) => void;
}

export function NoteViewer({
  note,
  loading,
  error,
  onWikiLinkClick,
  onTagClick,
}: NoteViewerProps) {
  if (loading) {
    return <div>Loading note...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!note) {
    return (
      <div>
        Select a note from the vault.
      </div>
    );
  }

  return (
    <article className="note-viewer">
      <MarkdownRenderer
        content={note.content}
        onWikiLinkClick={onWikiLinkClick}
        onTagClick={onTagClick}
      />
    </article>
  );
}