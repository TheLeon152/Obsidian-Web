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


  return (
    <nav
      aria-label="Breadcrumb"
    >

      <button
        type="button"
        onClick={() =>
          navigate("/folder/")
        }
      >
        Vault
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
            >

              <span>
                {" / "}
              </span>


              {isLast ? (

                <span>
                  {part}
                </span>

              ) : (

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/folder/${encodeURI(
                        currentPath
                      )}`
                    )
                  }
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

    async function loadFolder() {

      setLoading(true);
      setError(null);


      try {

        /*
         * Kein folderPath bedeutet:
         * Wir befinden uns am Root des Vaults.
         *
         * Beispiel:
         * /folder/
         *
         * ergibt:
         * ""
         */

        const decodedPath =
          folderPath
            ? decodeURIComponent(
                folderPath
              )
            : "";


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


  if (loading) {

    return (
      <div>
        Loading folder...
      </div>
    );

  }


  if (error) {

    return (
      <div>

        <button
          type="button"
          onClick={handleBack}
        >
          ← Back
        </button>

        <p>
          Error: {error}
        </p>

      </div>
    );

  }


  if (!folder) {

    return (
      <div>

        <button
          type="button"
          onClick={handleBack}
        >
          ← Back
        </button>

        <p>
          Folder not found.
        </p>

      </div>
    );

  }


  return (
    <div>

      <button
        type="button"
        onClick={handleBack}
      >
        ← Back
      </button>


      <FolderBreadcrumbs
        path={folder.path}
      />


      <h1>
        📁 {folder.name}
      </h1>


      <p>
        {folder.path}
      </p>


      <section>

        <h2>
          Folders
        </h2>


        {folder.folders.length === 0 ? (

          <p>
            No subfolders.
          </p>

        ) : (

          <ul>

            {folder.folders.map(
              (entry) => (

                <li
                  key={entry.path}
                >

                  <button
                    type="button"
                    onClick={() =>
                      handleFolderClick(
                        entry.path
                      )
                    }
                  >
                    📁 {entry.name}
                  </button>

                </li>

              )
            )}

          </ul>

        )}

      </section>


      <section>

        <h2>
          Notes
        </h2>


        {folder.notes.length === 0 ? (

          <p>
            No notes.
          </p>

        ) : (

          <ul>

            {folder.notes.map(
              (entry) => (

                <li
                  key={entry.path}
                >

                  <button
                    type="button"
                    onClick={() =>
                      onNoteClick(
                        entry.path
                      )
                    }
                  >
                    📄 {entry.name}
                  </button>

                </li>

              )
            )}

          </ul>

        )}

      </section>

    </div>
  );
}