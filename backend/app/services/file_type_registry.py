from enum import Enum
from pathlib import Path


class FileType(str, Enum):

    MARKDOWN = "markdown"
    CANVAS = "canvas"

    IMAGE = "image"
    PDF = "pdf"
    CSV = "csv"
    DOCX = "docx"


class FileTypeRegistry:

    _EXTENSIONS: dict[str, FileType] = {

        ".md": FileType.MARKDOWN,

        ".canvas": FileType.CANVAS,

        ".png": FileType.IMAGE,
        ".jpg": FileType.IMAGE,
        ".jpeg": FileType.IMAGE,
        ".gif": FileType.IMAGE,
        ".webp": FileType.IMAGE,
        #".svg": FileType.IMAGE,

        ".pdf": FileType.PDF,

        ".csv": FileType.CSV,

        ".docx": FileType.DOCX,
    }


    @classmethod
    def get_type(
        cls,
        path: Path,
    ) -> FileType | None:

        return cls._EXTENSIONS.get(
            path.suffix.lower()
        )


    @classmethod
    def is_supported(
        cls,
        path: Path,
    ) -> bool:

        return cls.get_type(path) is not None