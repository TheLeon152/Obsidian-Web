from pathlib import Path

from app.models.file import FileMetadata
from app.services.file_type_registry import FileTypeRegistry


class FileService:

    def __init__(self, vault_path: Path):
        self.vault_path = vault_path.resolve()

    def get_file(self, file_path: str) -> Path:
        requested_path = (
            self.vault_path / file_path
        ).resolve()

        if not requested_path.is_relative_to(
            self.vault_path
        ):
            raise ValueError(
                "File path is outside the vault."
            )

        if not requested_path.exists():
            raise FileNotFoundError(
                f"File not found: {file_path}"
            )

        if not requested_path.is_file():
            raise ValueError(
                "Requested path is not a file."
            )

        if not FileTypeRegistry.is_supported(
            requested_path
        ):
            raise ValueError(
                "Unsupported file type."
            )

        return requested_path

    def get_metadata(
        self,
        file_path: str,
    ) -> FileMetadata:

        path = self.get_file(file_path)

        file_type = FileTypeRegistry.get_type(path)

        if file_type is None:
            raise ValueError(
                "Unsupported file type."
            )

        relative_path = path.relative_to(
            self.vault_path
        ).as_posix()

        return FileMetadata(
            name=path.name,
            path=relative_path,
            file_type=file_type,
            size=path.stat().st_size,
        )