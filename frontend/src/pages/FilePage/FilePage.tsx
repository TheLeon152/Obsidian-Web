import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import type { Note } from "../../types/note";
import type { FileMetadata } from "../../api/files";

import { getNote } from "../../api/notes";
import { getFileMetadata } from "../../api/files";

import { FileViewer } from "../../components/FileViewer/FileViewer";


interface FilePageProps {
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

  onFolderClick: (
    path: string
  ) => void;
}


export function FilePage({
  refreshKey,
  onWikiLinkClick,
  onTagClick,
  onNoteClick,
  onFolderClick,
}: FilePageProps) {

  const {
    "*": filePath
  } = useParams();


  const [metadata, setMetadata] =
    useState<FileMetadata | null>(null);

  const [note, setNote] =
    useState<Note | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  const loadFile =
    useCallback(
      async () => {

        if (!filePath) {
          return;
        }

        setLoading(true);
        setError(null);
        setMetadata(null);
        setNote(null);


        try {

          const decodedPath =
            decodeURIComponent(
              filePath
            );


          /*
           * Zuerst generische Datei-Metadaten laden.
           */

          const loadedMetadata =
            await getFileMetadata(
              decodedPath
            );

          setMetadata(
            loadedMetadata
          );


          /*
           * Markdown benötigt zusätzlich
           * die Note-spezifischen Daten.
           */

          if (
            loadedMetadata.file_type ===
            "markdown"
          ) {

            const loadedNote =
              await getNote(
                decodedPath
              );

            setNote(
              loadedNote
            );
          }

        } catch (error) {

          setError(
            error instanceof Error
              ? error.message
              : "Unknown error"
          );

        } finally {

          setLoading(false);

        }

      },
      [filePath]
    );


  useEffect(() => {

    loadFile();

  }, [
    loadFile,
    refreshKey,
  ]);


  /*
   * Kein Pfad vorhanden.
   */

  if (!filePath) {

    return (
      <div className="file-viewer-state">
        Select a file from the vault.
      </div>
    );

  }


  /*
   * Metadaten werden noch geladen.
   */

  if (
    loading &&
    !metadata
  ) {

    return (
      <div className="file-viewer-state">
        Loading file...
      </div>
    );

  }


  /*
   * Fehler beim Laden.
   */

  if (
    error &&
    !metadata
  ) {

    return (
      <div className="file-viewer-state file-viewer-state-error">
        Error: {error}
      </div>
    );

  }


  if (!metadata) {

    return (
      <div className="file-viewer-state">
        File could not be loaded.
      </div>
    );

  }


  return (
    <FileViewer
      fileType={
        metadata.file_type
      }

      path={
        metadata.path
      }

      name={
        metadata.name
      }

      note={
        note
      }

      loading={
        loading
      }

      error={
        error
      }

      onWikiLinkClick={
        onWikiLinkClick
      }

      onTagClick={
        onTagClick
      }

      onNoteClick={
        onNoteClick
      }

      onFolderClick={
        onFolderClick
      }

      onNoteUpdated={
        loadFile
      }
    />
  );
}