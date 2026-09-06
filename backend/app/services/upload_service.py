from pathlib import Path
from tempfile import NamedTemporaryFile

from app.services.file_type_registry import FileType
from app.services.file_validator import FileValidator


class UploadService:

    def __init__(
        self,
        vault_path: Path,
        inbox_folder: str,
    ):
        self.vault_path = vault_path.resolve()
        self.inbox_folder = inbox_folder
        self.validator = FileValidator()

    @property
    def inbox_path(self) -> Path:
        return (
            self.vault_path / self.inbox_folder
        ).resolve()

    def validate_filename(
        self,
        filename: str,
    ) -> FileType:

        if not filename:
            raise ValueError(
                "Filename is required."
            )

        path = Path(filename)

        if path.name != filename:
            raise ValueError(
                "Directories are not allowed in filenames."
            )

        return self.validator.validate_extension(
            filename
        )

    def get_destination(
        self,
        filename: str,
    ) -> Path:

        self.validate_filename(filename)

        destination = (
            self.inbox_path / filename
        ).resolve()

        if not destination.is_relative_to(
            self.inbox_path
        ):
            raise ValueError(
                "Upload path is outside the inbox."
            )

        return destination

    def create_temp_file(self) -> NamedTemporaryFile:
        return NamedTemporaryFile(
            dir=self.inbox_path,
            prefix=".upload-",
            suffix=".tmp",
            delete=False,
        )