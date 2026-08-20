import type { Note } from "../../types/note";
import { MarkdownRenderer } from "../MarkdownRenderer/MarkdownRenderer";
import { NoteLink } from "../NoteLink/NoteLink";
import { NoteProperties } from "../NoteProperties/NoteProperties";

import "./NoteViewer.css";

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

  onNoteClick: (
    path: string
  ) => void;
}

export function NoteViewer({
  note,
  loading,
  error,
  onWikiLinkClick,
  onTagClick,
  onNoteClick,
}: NoteViewerProps) {
  if (loading) {
    return (
      <div className="note-state">
        Loading note...
      </div>
    );
  }

  if (error) {
    return (
      <div className="note-state note-state-error">
        Error: {error}
      </div>
    );
  }

  if (!note) {
    return (
      <div className="note-state">
        Select a note from the vault.
      </div>
    );
  }

  return (
    <article className="note-viewer">

      <header className="note-header">

        <h1 className="note-title">
          {note.name.replace(/\.md$/i, "")}
        </h1>

        <div className="note-path">
          {note.path}
        </div>

      </header>

      <NoteProperties
        frontmatter={note.frontmatter}
      />

      {note.tags.length > 0 && (
        <div className="note-tags">
          {note.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className="note-tag"
              onClick={() =>
                onTagClick(tag)
              }
            >
              #{tag}
            </button>
          ))}
        </div>
      )}


      <div className="note-content">

        <MarkdownRenderer
          content={note.content}
          onWikiLinkClick={onWikiLinkClick}
          onTagClick={onTagClick}
          onNoteClick={onNoteClick}
          resolvedLinks={note.resolved_links}
        />

      </div>

      {(note.resolved_links.length > 0 ||
        note.backlinks.length > 0) && (
        <footer className="note-navigation">

          {note.resolved_links.length > 0 && (
            <section className="note-navigation-section">

              <h2>
                <span>→</span>
                Links
              </h2>

              <ul>
                {note.resolved_links.map(
                  (link) => (
                    <li key={link.path}>
                      <NoteLink
                        name={link.name}
                        path={link.path}
                        direction="forward"
                        onClick={
                          onNoteClick
                        }
                      />
                    </li>
                  )
                )}
              </ul>

            </section>
          )}


          {note.backlinks.length > 0 && (
            <section className="note-navigation-section">

              <h2>
                <span>←</span>
                Backlinks
              </h2>

              <ul>
                {note.backlinks.map(
                  (backlink) => (
                    <li key={backlink.path}>
                      <NoteLink
                        name={backlink.name}
                        path={backlink.path}
                        direction="backward"
                        onClick={
                          onNoteClick
                        }
                      />
                    </li>
                  )
                )}
              </ul>

            </section>
          )}

        </footer>
      )}

    </article>
  );
}