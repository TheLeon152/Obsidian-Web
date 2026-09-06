from pydantic import BaseModel

from app.services.file_type_registry import FileType


class FileMetadata(BaseModel):
    name: str
    path: str
    file_type: FileType
    size: int