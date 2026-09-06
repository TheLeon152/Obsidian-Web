import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getFolderContent,
} from "../../api/vault";

import type {
  FolderContent,
} from "../../types/vault";

import "./FolderPage.css";


interface FolderBreadcrumbsProps {
  path: string;
}


function FolderBreadcrumbs({
  path,
}: FolderBreadcrumbsProps) {

  const navigate =
    useNavigate();

  const parts =
    path
      .split("/")
      .filter(
        (part) => part.length > 0
      );


  function handleRootClick() {
    navigate("/folder/");
  }


  function handlePartClick(
    currentPath: string
  ) {
    navigate(
      `/folder/${encodeURI(
        currentPath
      )}`
    );
  }


  return (
    <nav
      className="folder-breadcrumbs"
      aria-label="Breadcrumb"
    >

      <button
        type="button"
        onClick={handleRootClick}
        className="folder-breadcrumb-link"
      >
        🏠 Vault
      </button>


      {parts.map(
        (part, index) => {

          const currentPath =
            parts
              .slice(
                0,
                index + 1
              )
              .join("/");

          const isLast =
            index ===
            parts.length - 1;


          return (
            <span
              key={currentPath}
              className="folder-breadcrumb-item"
            >

              <span
                className="folder-breadcrumb-separator"
                aria-hidden="true"
              >
                /
              </span>


              {isLast ? (

                <span
                  className="folder-breadcrumb-current"
                  aria-current="page"
                >
                  {part}
                </span>

              ) : (

                <button
                  type="button"
                  onClick={() =>
                    handlePartClick(
                      currentPath
                    )
                  }
                  className="folder-breadcrumb-link"
                >
                  {part}
                </button>

              )}

            </span>
          );
        }
      )}

    </nav>
  );
}


interface FolderPageProps {
  onFileClick: (
    path: string
  ) => void;
}


export function FolderPage({
  onFileClick,
}: FolderPageProps) {

  const navigate =
    useNavigate();

  const {
    "*": folderPath,
  } = useParams();


  const [
    folder,
    setFolder,
  ] = useState<FolderContent | null>(
    null
  );


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );


  useEffect(() => {

    const decodedPath =
      folderPath
        ? decodeURIComponent(
            folderPath
          )
        : "";


    async function loadFolder() {

      setLoading(true);
      setError(null);


      try {

        const result =
          await getFolderContent(
            decodedPath
          );

        setFolder(result);

      } catch (error) {

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load folder."
        );

        setFolder(null);

      } finally {

        setLoading(false);

      }

    }


    loadFolder();

  }, [folderPath]);


  function handleFolderClick(
    path: string
  ) {

    navigate(
      `/folder/${encodeURI(path)}`
    );

  }


  function handleBack() {

    navigate(-1);

  }


  function getNoteName(
    name: string
  ): string {

    if (
      name
        .toLowerCase()
        .endsWith(".md")
    ) {

      return name.slice(
        0,
        -3
      );

    }

    return name;
  }


  if (loading) {

    return (
      <div className="folder-state">
        Ordner wird geladen...
      </div>
    );

  }


  if (error) {

    return (
      <div className="folder-state">

        <button
          type="button"
          onClick={handleBack}
          className="folder-back-button"
        >
          ← Zurück
        </button>

        <p>
          Fehler: {error}
        </p>

      </div>
    );

  }


  if (!folder) {

    return (
      <div className="folder-state">

        <button
          type="button"
          onClick={handleBack}
          className="folder-back-button"
        >
          ← Zurück
        </button>

        <p>
          Ordner wurde nicht gefunden.
        </p>

      </div>
    );

  }


  return (
    <div className="folder-page">

      <button
        type="button"
        onClick={handleBack}
        className="folder-back-button"
      >
        ← Zurück
      </button>


      <FolderBreadcrumbs
        path={folder.path}
      />


      <header className="folder-header">

        <h1 className="folder-title">
          📁 {folder.name}
        </h1>

      </header>


      <section className="folder-section">

        <h2 className="folder-section-title">
          Ordner
        </h2>


        {folder.folders.length === 0 ? (

          <p className="folder-empty">
            Keine Unterordner.
          </p>

        ) : (

          <div className="folder-entry-list">

            {folder.folders.map(
              (entry) => (

                <button
                  key={entry.path}
                  type="button"
                  onClick={() =>
                    handleFolderClick(
                      entry.path
                    )
                  }
                  className="folder-entry"
                >

                  <span className="folder-entry-icon">
                    📁
                  </span>

                  <span>
                    {entry.name}
                  </span>

                </button>

              )
            )}

          </div>

        )}

      </section>


      <section className="folder-section">

        <h2 className="folder-section-title">
          Dateien
        </h2>


        {folder.files.length === 0 ? (

          <p className="folder-empty">
            Keine Dateien in diesem Ordner.
          </p>

        ) : (

          <div className="folder-entry-list">

            {folder.files.map(
              (entry) => (

                <button
                  key={entry.path}
                  type="button"
                  onClick={() =>
                    onFileClick(
                      entry.path
                    )
                  }
                  className="folder-entry"
                >

                  <span className="folder-entry-icon">
                    {entry.file_type === "markdown"
                      ? "📄"
                      : entry.file_type === "image"
                        ? "🖼️"
                        : entry.file_type === "pdf"
                          ? "📕"
                          : entry.file_type === "canvas"
                            ? "🗺️"
                            : entry.file_type === "csv"
                              ? "📊"
                              : entry.file_type === "docx"
                                ? "📝"
                                : "📄"}
                  </span>

                  <span>
                    {entry.file_type === "markdown"
                      ? getNoteName(entry.name)
                      : entry.name}
                  </span>

                </button>

              )
            )}

          </div>

        )}

      </section>

    </div>
  );
}