from pathlib import Path

from app.models.vault import Note
from app.services.vault_indexer import VaultIndexer


class NoteService:

    def __init__(
        self,
        vault_path: Path,
        vault_indexer: VaultIndexer,
    ):
        self.vault_path = vault_path
        self.vault_indexer = vault_indexer


    def get_note(
        self,
        relative_path: str,
    ) -> Note:

        relative_path = relative_path.replace(
            "\\",
            "/",
        )

        note_path = self._resolve_path(
            relative_path
        )

        if not note_path.exists():
            raise FileNotFoundError(
                f"Note not found: {relative_path}"
            )

        if not note_path.is_file():
            raise ValueError(
                f"Path is not a file: {relative_path}"
            )

        if note_path.suffix.lower() != ".md":
            raise ValueError(
                f"File is not a Markdown file: {relative_path}"
            )

        content = note_path.read_text(
            encoding="utf-8"
        )

        index = (
            self.vault_indexer.get_index()
        )

        metadata = index.get(
            relative_path
        )

        if metadata is None:
            raise FileNotFoundError(
                f"Note not found in index: {relative_path}"
            )

        content = self._remove_frontmatter(
            content
        )

        return Note(
            name=metadata.name,
            path=metadata.path,
            content=content,

            tags=metadata.tags,

            frontmatter=metadata.frontmatter,

            links=metadata.links,

            resolved_links=metadata.resolved_links,

            backlinks=metadata.backlinks,

            tasks=metadata.tasks,
        )


    def _resolve_path(
        self,
        relative_path: str,
    ) -> Path:

        note_path = (
            self.vault_path / relative_path
        ).resolve()

        vault_path = (
            self.vault_path.resolve()
        )

        if not note_path.is_relative_to(
            vault_path
        ):
            raise ValueError(
                "Path is outside of the vault."
            )

        return note_path


    def _remove_frontmatter(
        self,
        content: str,
    ) -> str:

        if not content.startswith("---"):
            return content

        lines = content.splitlines()

        if len(lines) < 2:
            return content

        if lines[0].strip() != "---":
            return content

        for index in range(1, len(lines)):

            if lines[index].strip() == "---":
                return "\n".join(
                    lines[index + 1:]
                ).lstrip()

        return content