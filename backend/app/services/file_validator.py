from pathlib import Path
import json
import zipfile

from app.services.file_type_registry import FileType, FileTypeRegistry


class FileValidator:

    MAX_FILE_SIZE = 25 * 1024 * 1024

    def validate_extension(
        self,
        filename: str,
    ) -> FileType:

        path = Path(filename)

        file_type = FileTypeRegistry.get_type(path)

        if file_type is None:
            raise ValueError(
                f"Unsupported file type: {path.suffix}"
            )

        return file_type

    def validate_size(
        self,
        size: int,
    ) -> None:

        if size <= 0:
            raise ValueError(
                "Uploaded file is empty."
            )

        if size > self.MAX_FILE_SIZE:
            raise ValueError(
                "Uploaded file is too large."
            )

    def validate_content(
        self,
        path: Path,
        file_type: FileType,
    ) -> None:

        if file_type == FileType.IMAGE:
            self._validate_image(path)

        elif file_type == FileType.PDF:
            self._validate_pdf(path)

        elif file_type == FileType.DOCX:
            self._validate_docx(path)

        elif file_type == FileType.CSV:
            self._validate_csv(path)

        elif file_type == FileType.CANVAS:
            self._validate_canvas(path)

        elif file_type == FileType.MARKDOWN:
            self._validate_markdown(path)

    def _validate_image(
        self,
        path: Path,
    ) -> None:

        with path.open("rb") as file:
            header = file.read(12)

        valid = (
            header.startswith(b"\x89PNG\r\n\x1a\n")
            or header.startswith(b"\xff\xd8\xff")
            or header.startswith(b"GIF87a")
            or header.startswith(b"GIF89a")
            or header.startswith(b"RIFF")
        )

        if not valid:
            raise ValueError(
                "File content does not match an image."
            )

    def _validate_pdf(
        self,
        path: Path,
    ) -> None:

        with path.open("rb") as file:
            header = file.read(5)

        if header != b"%PDF-":
            raise ValueError(
                "File content does not match a PDF."
            )

    def _validate_docx(
        self,
        path: Path,
    ) -> None:

        if not zipfile.is_zipfile(path):
            raise ValueError(
                "File is not a valid DOCX archive."
            )

        with zipfile.ZipFile(path) as archive:

            names = set(archive.namelist())

            if "[Content_Types].xml" not in names:
                raise ValueError(
                    "File is not a valid DOCX document."
                )

            if "word/document.xml" not in names:
                raise ValueError(
                    "File is not a valid DOCX document."
                )

    def _validate_csv(
        self,
        path: Path,
    ) -> None:

        try:
            with path.open(
                "r",
                encoding="utf-8-sig",
                newline="",
            ) as file:

                file.read(1024)

        except UnicodeDecodeError as error:
            raise ValueError(
                "CSV file is not valid UTF-8 text."
            ) from error

    def _validate_canvas(
        self,
        path: Path,
    ) -> None:

        try:
            with path.open(
                "r",
                encoding="utf-8",
            ) as file:

                data = json.load(file)

        except (UnicodeDecodeError, json.JSONDecodeError) as error:
            raise ValueError(
                "Canvas file is not valid JSON."
            ) from error

        if not isinstance(data, dict):
            raise ValueError(
                "Canvas root must be an object."
            )

        if not isinstance(
            data.get("nodes"),
            list,
        ):
            raise ValueError(
                "Canvas must contain a nodes array."
            )

        if not isinstance(
            data.get("edges"),
            list,
        ):
            raise ValueError(
                "Canvas must contain an edges array."
            )

    def _validate_markdown(
        self,
        path: Path,
    ) -> None:

        try:
            with path.open(
                "r",
                encoding="utf-8",
            ) as file:

                file.read(1024)

        except UnicodeDecodeError as error:
            raise ValueError(
                "Markdown file is not valid UTF-8."
            ) from error