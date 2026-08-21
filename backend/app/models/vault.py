from typing import Any, Literal

from pydantic import BaseModel, Field

from app.models.task import Task


class VaultNode(BaseModel):
    name: str
    type: Literal["file", "folder"]
    path: str
    children: list["VaultNode"] | None = None


class NoteReference(BaseModel):
    name: str
    path: str


class ResolvedLink(BaseModel):
    target: str
    path: str
    name: str


class Note(BaseModel):
    name: str
    path: str
    content: str

    tags: list[str] = Field(
        default_factory=list
    )

    frontmatter: dict[str, Any] = Field(
        default_factory=dict
    )

    links: list[str] = Field(
        default_factory=list
    )

    resolved_links: list[ResolvedLink] = Field(
        default_factory=list
    )

    backlinks: list[NoteReference] = Field(
        default_factory=list
    )

    tasks: list[Task] = Field(
        default_factory=list
    )


class IndexedNote(BaseModel):
    name: str
    path: str

    content: str = ""

    tags: list[str] = Field(
        default_factory=list
    )

    frontmatter: dict[str, Any] = Field(
        default_factory=dict
    )

    links: list[str] = Field(
        default_factory=list
    )

    resolved_links: list[ResolvedLink] = Field(
        default_factory=list
    )

    backlinks: list[NoteReference] = Field(
        default_factory=list
    )

    tasks: list[Task] = Field(
        default_factory=list
    )