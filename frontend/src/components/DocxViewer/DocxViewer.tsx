import { useEffect, useState } from "react";
import { getDocxContent } from "../../api/files";
import "./DocxViewer.css";

interface DocxViewerProps {
  path: string;
  name: string;
}

export function DocxViewer({
  path,
  name,
}: DocxViewerProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDocument() {
      setLoading(true);
      setError(null);

      try {
        const html = await getDocxContent(path);
        setContent(html);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load DOCX."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDocument();
  }, [path]);

  if (loading) {
    return (
      <div className="file-viewer-state">
        Loading document...
      </div>
    );
  }

  if (error) {
    return (
      <div className="file-viewer-state file-viewer-state-error">
        Error: {error}
      </div>
    );
  }

  if (content === null) {
    return (
      <div className="file-viewer-state">
        Document could not be loaded.
      </div>
    );
  }

  return (
    <article className="docx-viewer">
      <header className="docx-viewer-header">
        <h1 className="docx-viewer-title">
          {name}
        </h1>
      </header>

      <div
        className="docx-viewer-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}