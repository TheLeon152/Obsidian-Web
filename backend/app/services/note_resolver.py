from pathlib import Path

from app.models.vault import NoteReference


class NoteResolver:

    def __init__(
        self,
        vault_path: Path,
    ):
        self.vault_path = (
            vault_path.resolve()
        )

    def resolve(
        self,
        target: str,
    ) -> NoteReference:

        normalized_target = (
            target
            .strip()
            .replace("\\", "/")
        )

        if not normalized_target:
            raise ValueError(
                "Note target cannot be empty."
            )

        # Obsidian erlaubt Links ohne .md
        if not normalized_target.lower().endswith(
            ".md"
        ):
            normalized_target += ".md"

        # --------------------------------------------------
        # 1. Exakter relativer Pfad
        # --------------------------------------------------

        exact_path = (
            self.vault_path
            / normalized_target
        ).resolve()

        if (
            exact_path.is_relative_to(
                self.vault_path
            )
            and exact_path.is_file()
            and exact_path.suffix.lower() == ".md"
        ):
            return self._to_reference(
                exact_path
            )

        # --------------------------------------------------
        # 2. Nur Dateiname → im gesamten Vault suchen
        # --------------------------------------------------

        filename = Path(
            normalized_target
        ).name

        matches = list(
            self.vault_path.rglob(
                filename
            )
        )

        if not matches:
            raise FileNotFoundError(
                f"Note not found: {target}"
            )

        if len(matches) > 1:
            raise ValueError(
                f"Multiple notes found for: {target}"
            )

        return self._to_reference(
            matches[0]
        )

    def _to_reference(
        self,
        note_path: Path,
    ) -> NoteReference:

        relative_path = (
            note_path.relative_to(
                self.vault_path
            )
        )

        return NoteReference(
            name=note_path.stem,
            path=relative_path.as_posix(),
        )