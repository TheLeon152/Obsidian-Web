import type { FileType } from "../../types/vault";
import type { Note } from "../../types/note";

import { NoteViewer } from "../NoteViewer/NoteViewer";
import { ImageViewer } from "../ImageViewer/ImageViewer";
import { PdfViewer } from "../PdfViewer/PdfViewer";
import { CsvViewer } from "../CsvViewer/CsvViewer";
import { DocxViewer } from "../DocxViewer/DocxViewer";


interface FileViewerProps {
  fileType: FileType;

  path: string;
  name: string;

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

  onFolderClick: (
    path: string
  ) => void;

  onNoteUpdated?: () => void;
}


export function FileViewer({
  fileType,
  path,
  name,
  note,
  loading,
  error,
  onWikiLinkClick,
  onTagClick,
  onNoteClick,
  onFolderClick,
  onNoteUpdated,
}: FileViewerProps) {

  switch (fileType) {

    case "markdown":

      return (
        <NoteViewer
          note={note}
          loading={loading}
          error={error}
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
            onNoteUpdated
          }
        />
      );


    case "image":

      return (
        <ImageViewer
          path={path}
          name={name}
        />
      );

    case "pdf":
      return <PdfViewer path={path} name={name} />;

    case "csv":
      return <CsvViewer path={path} name={name} />;

    case "docx":
      return <DocxViewer path={path} name={name} />;


    default:

      return (
        <div className="file-viewer-state">

          Unsupported file type:
          {" "}
          {fileType}

        </div>
      );
  }
}