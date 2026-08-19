import {
  useEffect,
  useState,
} from "react";

import {
  fetchNotesForTag,
} from "../../api/tagsApi";


interface TagPageProps {
  tag: string;

  onOpenNote: (
    path: string
  ) => void;
}


export function TagPage({
  tag,
  onOpenNote,
}: TagPageProps) {

  const [notes, setNotes] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  useEffect(() => {
    async function loadNotes() {
      try {
        setLoading(true);
        setError(null);

        const result =
          await fetchNotesForTag(tag);

        setNotes(result.notes);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load tag."
        );
      } finally {
        setLoading(false);
      }
    }

    loadNotes();
  }, [tag]);


  return (
    <main className="tag-page">

      <h1>
        #{tag}
      </h1>

      {loading && (
        <p>
          Loading notes...
        </p>
      )}

      {error && (
        <p>
          Error: {error}
        </p>
      )}

      {!loading &&
        !error &&
        notes.length === 0 && (
          <p>
            No notes found for this tag.
          </p>
        )}

      {!loading &&
        !error &&
        notes.length > 0 && (
          <>
            <p>
              {notes.length}{" "}
              {notes.length === 1
                ? "note"
                : "notes"}
            </p>

            <ul>
              {notes.map((note) => (
                <li key={note}>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenNote(note)
                    }
                  >
                    {note}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

    </main>
  );
}