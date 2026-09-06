import { useEffect, useState } from "react";
import { getFile } from "../../api/files";
import "./CsvViewer.css";

interface CsvViewerProps {
  path: string;
  name: string;
}

export function CsvViewer({ path, name }: CsvViewerProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCsv() {
      setLoading(true);
      setError(null);

      try {
        const response = await getFile(path);
        const text = await response.text();

        setContent(text);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load CSV."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCsv();
  }, [path]);

  if (loading) {
    return (
      <div className="file-viewer-state">
        Loading CSV...
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
        CSV could not be loaded.
      </div>
    );
  }

  const rows = parseCsv(content);

  return (
    <article className="csv-viewer">
      <header className="csv-viewer-header">
        <h1 className="csv-viewer-title">{name}</h1>
      </header>

      <div className="csv-viewer-content">
        <div className="csv-viewer-table-wrapper">
          <table className="csv-viewer-table">
            <thead>
              <tr>
                {rows[0]?.map((cell, index) => (
                  <th key={index}>{cell}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </article>
  );
}

function parseCsv(content: string): string[][] {
  const lines = content
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .filter(line => line.trim() !== "");

  return lines.map(parseCsvLine);
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const character = line[i];

    if (character === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (character === "," && !insideQuotes) {
      cells.push(current);
      current = "";
    } else {
      current += character;
    }
  }

  cells.push(current);

  return cells;
}