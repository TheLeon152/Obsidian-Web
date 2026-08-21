from pathlib import Path


class InboxService:

    def __init__(
        self,
        vault_path: Path,
        inbox_folder: str = "Inbox",
    ):
        self.vault_path = (
            vault_path.resolve()
        )

        self.inbox_path = (
            self.vault_path
            / inbox_folder
        ).resolve()

        self.inbox_path.mkdir(
            parents=True,
            exist_ok=True,
        )


    def list_notes(self) -> list[str]:

        return sorted(
            path.name
            for path in self.inbox_path.glob(
                "*.md"
            )
            if path.is_file()
        )


    def _normalize_filename(
        self,
        filename: str,
    ) -> str:

        filename = filename.strip()

        if not filename:
            raise ValueError(
                "Filename must not be empty."
            )

        if not filename.lower().endswith(".md"):
            filename += ".md"

        return filename


    def read_note(
        self,
        filename: str,
    ) -> str:

        path = self._resolve_safe_path(
            filename
        )

        if not path.exists():
            raise FileNotFoundError(
                filename
            )

        if not path.is_file():
            raise FileNotFoundError(
                filename
            )

        return path.read_text(
            encoding="utf-8"
        )


    def create_note(
        self,
        filename: str,
        content: str,
    ) -> None:

        path = self._resolve_safe_path(
            filename
        )

        if path.exists():
            raise FileExistsError(
                filename
            )

        path.write_text(
            content,
            encoding="utf-8",
        )


    def update_note(
        self,
        filename: str,
        content: str,
    ) -> None:

        path = self._resolve_safe_path(
            filename
        )

        if not path.exists():
            raise FileNotFoundError(
                filename
            )

        if not path.is_file():
            raise FileNotFoundError(
                filename
            )

        path.write_text(
            content,
            encoding="utf-8",
        )


    def _resolve_safe_path(
        self,
        filename: str,
    ) -> Path:

        filename = self._normalize_filename(
            filename
        )

        if not filename:
            raise ValueError(
                "Filename must not be empty."
            )

        if not filename.lower().endswith(".md"):
            filename += ".md"

        requested_path = (
            self.inbox_path
            / filename
        ).resolve()

        if not requested_path.is_relative_to(
            self.inbox_path
        ):
            raise ValueError(
                "Access outside the Inbox is not allowed."
            )

        if requested_path.suffix.lower() != ".md":
            raise ValueError(
                "Only Markdown files are allowed."
            )

        return requested_path

    def delete_note(
        self,
        filename: str,
    ) -> None:

        path = self._resolve_safe_path(
            filename
        )

        if not path.exists():
            raise FileNotFoundError(
                filename
            )

        if not path.is_file():
            raise FileNotFoundError(
                filename
            )

        path.unlink()