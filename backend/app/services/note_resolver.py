from pathlib import Path

from app.models.vault import NoteReference


class NoteResolver:

    def __init__(self, vault_path: Path):
        self.vault_path = vault_path

    def resolve(self, note_name: str) -> NoteReference:
        normalized_name = note_name.strip()

        if not normalized_name:
            raise ValueError("Note name cannot be empty.")

        matches = list(
            self.vault_path.rglob(
                f"{normalized_name}.md"
            )
        )

        if not matches:
            raise FileNotFoundError(
                f"Note not found: {normalized_name}"
            )

        if len(matches) > 1:
            raise ValueError(
                f"Multiple notes found for: {normalized_name}"
            )

        note_path = matches[0]

        relative_path = note_path.relative_to(
            self.vault_path
        )

        return NoteReference(
            name=note_path.stem,
            path=relative_path.as_posix(),
        )