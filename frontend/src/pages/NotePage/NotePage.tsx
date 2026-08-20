import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Note } from "../../types/note";
import { getNote } from "../../api/notes";
import { NoteViewer } from "../../components/NoteViewer/NoteViewer";


interface NotePageProps {
  refreshKey: number;

  onWikiLinkClick: (
    target: string
  ) => void;

  onTagClick: (
    tag: string
  ) => void;

  onNoteClick: (
    path: string
  ) => void;
}


export function NotePage({
  refreshKey,
  onWikiLinkClick,
  onTagClick,
  onNoteClick,
}: NotePageProps) {
  const { "*": notePath } = useParams();

  const [note, setNote] =
    useState<Note | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  useEffect(() => {
    if (!notePath) {
      return;
    }

    async function loadNote() {
      setLoading(true);
      setError(null);

      try {
        const decodedPath =
          decodeURIComponent(notePath!);

        const loadedNote =
          await getNote(decodedPath);

        setNote(loadedNote);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unknown error"
        );

        setNote(null);
      } finally {
        setLoading(false);
      }
    }

    loadNote();
  }, [notePath, refreshKey]);


  return (
    <NoteViewer
      note={note}
      loading={loading}
      error={error}
      onWikiLinkClick={onWikiLinkClick}
      onTagClick={onTagClick}
      onNoteClick={onNoteClick}
    />
  );
}