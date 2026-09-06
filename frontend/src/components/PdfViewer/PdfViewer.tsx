import { useEffect, useState } from "react";
import { getFile } from "../../api/files";
import "./PdfViewer.css";

interface PdfViewerProps {
  path: string;
  name: string;
}

export function PdfViewer({ path, name }: PdfViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    async function loadPdf() {
      setLoading(true);
      setError(null);

      try {
        const response = await getFile(path);
        const blob = await response.blob();

        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load PDF."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPdf();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [path]);

  if (loading) {
    return (
      <div className="file-viewer-state">
        Loading PDF...
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

  if (!pdfUrl) {
    return (
      <div className="file-viewer-state">
        PDF could not be loaded.
      </div>
    );
  }

  return (
    <article className="pdf-viewer">
      <header className="pdf-viewer-header">
        <h1 className="pdf-viewer-title">{name}</h1>
      </header>

      <div className="pdf-viewer-content">
        <iframe
          src={pdfUrl}
          title={name}
          className="pdf-viewer-frame"
        />
      </div>
    </article>
  );
}