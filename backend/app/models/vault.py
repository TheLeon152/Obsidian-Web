from typing import Literal

from pydantic import BaseModel


class VaultNode(BaseModel):
    name: str
    type: Literal["file", "folder"]
    path: str
    children: list["VaultNode"] | None = None


class Note(BaseModel):
    name: str
    path: str
    content: str


class NoteReference(BaseModel):
    name: str
    path: str