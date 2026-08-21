import {
  useEffect,
  useState,
} from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import {
  createInboxNote,
  deleteInboxNote,
  fetchInboxNote,
  fetchInboxNotes,
  updateInboxNote,
} from "../../api/inbox";

import type {
  InboxNoteSummary,
} from "../../types/inbox";

import "./InboxPage.css";

import "highlight.js/styles/github-dark.css";


export function InboxPage() {

  const [notes, setNotes] =
    useState<InboxNoteSummary[]>([]);

  const [selectedFilename, setSelectedFilename] =
    useState<string | null>(null);

  const [content, setContent] =
    useState("");

  const [newFilename, setNewFilename] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [loadingNote, setLoadingNote] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);


  useEffect(() => {

    loadNotes();

  }, []);


  async function loadNotes() {

    try {

      setLoading(true);
      setError(null);

      const data =
        await fetchInboxNotes();

      setNotes(data);

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Inbox konnte nicht geladen werden."
      );

    } finally {

      setLoading(false);

    }
  }


  async function handleSelectNote(
    filename: string,
  ) {

    try {

      setLoadingNote(true);
      setError(null);

      const note =
        await fetchInboxNote(
          filename
        );

      setSelectedFilename(
        note.filename
      );

      setContent(
        note.content
      );

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Note konnte nicht geladen werden."
      );

    } finally {

      setLoadingNote(false);

    }
  }


  async function handleCreateNote() {

    const filename =
      newFilename.trim();

    if (!filename) {
      return;
    }


    try {

      setCreating(true);
      setError(null);

      const note =
        await createInboxNote({
          filename,
          content: "",
        });


      setNewFilename("");

      await loadNotes();

      setSelectedFilename(
        note.filename
      );

      setContent(
        note.content
      );

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Note konnte nicht erstellt werden."
      );

    } finally {

      setCreating(false);

    }
  }


  async function handleSave() {

    if (!selectedFilename) {
      return;
    }


    try {

      setSaving(true);
      setError(null);

      const note =
        await updateInboxNote(
          selectedFilename,
          content,
        );

      setContent(
        note.content
      );

      await loadNotes();

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Note konnte nicht gespeichert werden."
      );

    } finally {

      setSaving(false);

    }
  }


  async function handleDelete() {

    if (!selectedFilename) {
      return;
    }

    const confirmed =
      window.confirm(
        `Möchtest du die Notiz "${selectedFilename}" wirklich löschen?`
      );

    if (!confirmed) {
      return;
    }


    try {

      setDeleting(true);
      setError(null);

      await deleteInboxNote(
        selectedFilename
      );

      setSelectedFilename(null);
      setContent("");

      await loadNotes();

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Note konnte nicht gelöscht werden."
      );

    } finally {

      setDeleting(false);

    }
  }


  if (loading) {

    return (
      <div className="inbox-page">
        <p>Inbox wird geladen...</p>
      </div>
    );
  }


  return (
    <div className="inbox-page">

      <header className="inbox-header">

        <div>

          <h1>
            📥 Inbox
          </h1>

          <p>
            Temporäre Notizen erstellen und bearbeiten.
          </p>

        </div>

      </header>


      {error && (

        <div className="inbox-error">
          ❌ {error}
        </div>

      )}


      <div className="inbox-layout">

        {/* ====================================================
            Linke Seite: Notizen
        ==================================================== */}

        <aside className="inbox-sidebar">

          <div className="inbox-sidebar-header">

            <h2>
              Notizen
            </h2>

            <span>
              {notes.length}
            </span>

          </div>


          <div className="inbox-create">

            <input
              type="text"
              value={newFilename}
              onChange={event =>
                setNewFilename(
                  event.target.value
                )
              }
              onKeyDown={event => {

                if (
                  event.key === "Enter"
                ) {
                  handleCreateNote();
                }

              }}
              placeholder="Neue Notiz..."
              disabled={creating}
            />

            <button
              type="button"
              onClick={
                handleCreateNote
              }
              disabled={
                creating
                || !newFilename.trim()
              }
            >
              {creating
                ? "..."
                : "+ Neu"}
            </button>

          </div>


          <div className="inbox-note-list">

            {notes.length === 0 ? (

              <p className="inbox-empty">
                Noch keine Inbox-Notizen.
              </p>

            ) : (

              notes.map(note => (

                <button
                  type="button"
                  key={note.filename}
                  className={
                    `inbox-note-item ${
                      selectedFilename ===
                      note.filename
                        ? "selected"
                        : ""
                    }`
                  }
                  onClick={() =>
                    handleSelectNote(
                      note.filename
                    )
                  }
                >

                  <span>
                    {note.filename}
                  </span>

                  {note.modified_at && (

                    <small>
                      {formatModifiedAt(
                        note.modified_at
                      )}
                    </small>

                  )}

                </button>

              ))

            )}

          </div>

        </aside>


        {/* ====================================================
            Rechte Seite: Editor
        ==================================================== */}

        <main className="inbox-editor">

          {!selectedFilename ? (

            <div className="inbox-editor-empty">

              <div>
                📄
              </div>

              <h2>
                Keine Notiz ausgewählt
              </h2>

              <p>
                Wähle links eine Notiz aus oder
                erstelle eine neue.
              </p>

            </div>

          ) : (

            <>

              <div className="inbox-editor-header">

                <div>

                  <h2>
                    {selectedFilename}
                  </h2>

                </div>


                <div className="inbox-editor-actions">

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={
                      saving
                      || deleting
                      || loadingNote
                    }
                  >
                    {saving
                      ? "Speichern..."
                      : "Speichern"}
                  </button>


                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={
                      saving
                      || deleting
                      || loadingNote
                    }
                  >
                    {deleting
                      ? "Löschen..."
                      : "Löschen"}
                  </button>

                </div>

              </div>


              {loadingNote ? (

                <div className="inbox-loading">
                  Note wird geladen...
                </div>

              ) : (

                <div className="inbox-editor-workspace">

                  {/* ==================================================
                      Markdown Editor
                  ================================================== */}

                  <div className="inbox-editor-pane">

                    <div className="inbox-pane-header">
                      Markdown
                    </div>

                    <textarea
                      className="inbox-textarea"
                      value={content}
                      onChange={event =>
                        setContent(
                          event.target.value
                        )
                      }
                      spellCheck={false}
                    />

                  </div>


                  {/* ==================================================
                      Live Preview
                  ================================================== */}

                  <div className="inbox-preview-pane">

                    <div className="inbox-pane-header">
                      Vorschau
                    </div>

                    <article className="markdown-preview">

                      <ReactMarkdown
                        remarkPlugins={[
                          remarkGfm,
                        ]}
                        rehypePlugins={[
                          rehypeHighlight,
                        ]}
                      >
                        {content}
                      </ReactMarkdown>

                    </article>

                  </div>

                </div>

              )}

            </>

          )}

        </main>

      </div>

    </div>
  );
}


function formatModifiedAt(
  value: string,
): string {

  const date =
    new Date(value);

  return date.toLocaleString(
    "de-DE",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}