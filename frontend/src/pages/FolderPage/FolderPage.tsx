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
      aria-label="Breadcrumb"
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "4px",
        marginBottom: "24px",
        fontSize: "14px",
      }}
    >

      <button
        type="button"
        onClick={handleRootClick}
        style={{
          border: "none",
          background: "none",
          padding: "4px 6px",
          cursor: "pointer",
          fontWeight: 500,
        }}
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
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >

              <span
                style={{
                  opacity: 0.5,
                }}
              >
                /
              </span>


              {isLast ? (

                <span
                  style={{
                    padding: "4px 6px",
                    fontWeight: 600,
                  }}
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
                  style={{
                    border: "none",
                    background: "none",
                    padding: "4px 6px",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
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
  onNoteClick: (
    path: string
  ) => void;
}


export function FolderPage({
  onNoteClick,
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
      <div
        style={{
          padding: "16px",
          opacity: 0.7,
        }}
      >
        Ordner wird geladen...
      </div>
    );

  }


  if (error) {

    return (
      <div
        style={{
          padding: "16px",
        }}
      >

        <button
          type="button"
          onClick={handleBack}
          style={{
            marginBottom: "16px",
          }}
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
      <div
        style={{
          padding: "16px",
        }}
      >

        <button
          type="button"
          onClick={handleBack}
          style={{
            marginBottom: "16px",
          }}
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
    <div
      style={{
        maxWidth: "1000px",
      }}
    >

      <button
        type="button"
        onClick={handleBack}
        style={{
          marginBottom: "16px",
          border: "none",
          background: "none",
          padding: "4px 0",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        ← Zurück
      </button>


      <FolderBreadcrumbs
        path={folder.path}
      />


      <header
        style={{
          marginBottom: "32px",
        }}
      >

        <h1
          style={{
            margin: 0,
            marginBottom: "8px",
          }}
        >
          📁 {folder.name}
        </h1>

      </header>


      <section
        style={{
          marginBottom: "32px",
        }}
      >

        <h2
          style={{
            fontSize: "18px",
            marginBottom: "12px",
          }}
        >
          Ordner
        </h2>


        {folder.folders.length === 0 ? (

          <p
            style={{
              opacity: 0.6,
              fontSize: "14px",
            }}
          >
            Keine Unterordner.
          </p>

        ) : (

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >

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
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    background: "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "15px",
                  }}
                >

                  <span
                    style={{
                      marginRight: "10px",
                      fontSize: "18px",
                    }}
                  >
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


      <section>

        <h2
          style={{
            fontSize: "18px",
            marginBottom: "12px",
          }}
        >
          Notizen
        </h2>


        {folder.notes.length === 0 ? (

          <p
            style={{
              opacity: 0.6,
              fontSize: "14px",
            }}
          >
            Keine Notizen in diesem Ordner.
          </p>

        ) : (

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >

            {folder.notes.map(
              (entry) => (

                <button
                  key={entry.path}
                  type="button"
                  onClick={() =>
                    onNoteClick(
                      entry.path
                    )
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    background: "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "15px",
                  }}
                >

                  <span
                    style={{
                      marginRight: "10px",
                      fontSize: "18px",
                    }}
                  >
                    📄
                  </span>

                  <span>
                    {getNoteName(
                      entry.name
                    )}
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