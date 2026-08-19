from pathlib import Path

from app.models.vault import Note


class NoteService:

    def __init__(self, vault_path: Path):
        self.vault_path = vault_path

    def get_note(self, relative_path: str) -> Note:
        note_path = self._resolve_path(relative_path)

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

        return Note(
            name=note_path.name,
            path=relative_path,
            content=content,
        )

    def _resolve_path(self, relative_path: str) -> Path:
        note_path = (
            self.vault_path / relative_path
        ).resolve()

        vault_path = self.vault_path.resolve()

        if not note_path.is_relative_to(vault_path):
            raise ValueError(
                "Path is outside of the vault."
            )

        return note_path