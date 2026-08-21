from pathlib import Path

from app.models.task_update import TaskUpdate


class TaskWriteService:

    def __init__(
        self,
        vault_path: Path,
    ):
        self.vault_path = (
            vault_path.resolve()
        )


    def update_task(
        self,
        update: TaskUpdate,
    ) -> None:

        file_path = self._resolve_safe_path(
            update.path
        )

        lines = file_path.read_text(
            encoding="utf-8"
        ).splitlines(
            keepends=True
        )


        index = update.line - 1


        if index < 0 or index >= len(lines):

            raise ValueError(
                f"Line {update.line} "
                f"is outside the file."
            )


        line = lines[index]


        if not self._is_task_line(line):

            raise ValueError(
                f"Line {update.line} "
                f"is not a Markdown task."
            )


        lines[index] = (
            self._set_completed(
                line,
                update.completed,
            )
        )


        file_path.write_text(
            "".join(lines),
            encoding="utf-8",
        )


    def _resolve_safe_path(
        self,
        relative_path: str,
    ) -> Path:

        candidate = (
            self.vault_path
            / relative_path
        ).resolve()


        try:

            candidate.relative_to(
                self.vault_path
            )

        except ValueError:

            raise ValueError(
                "Path is outside the vault."
            )


        if candidate.suffix.lower() != ".md":

            raise ValueError(
                "Only markdown files "
                "can be modified."
            )


        if not candidate.exists():

            raise ValueError(
                "Markdown file does not exist."
            )


        if not candidate.is_file():

            raise ValueError(
                "Path is not a file."
            )


        return candidate


    def _is_task_line(
        self,
        line: str,
    ) -> bool:

        stripped = line.lstrip()

        return (
            stripped.startswith("- [ ] ")
            or stripped.startswith("- [x] ")
            or stripped.startswith("- [X] ")
            or stripped.startswith("* [ ] ")
            or stripped.startswith("* [x] ")
            or stripped.startswith("* [X] ")
        )


    def _set_completed(
        self,
        line: str,
        completed: bool,
    ) -> str:

        marker = "[x]" if completed else "[ ]"

        stripped = line.lstrip()

        indentation = (
            line[:len(line) - len(stripped)]
        )

        if stripped.startswith("- ["):
            return (
                indentation
                + "- "
                + marker
                + stripped[5:]
            )

        if stripped.startswith("* ["):
            return (
                indentation
                + "* "
                + marker
                + stripped[5:]
            )

        raise ValueError(
            "Invalid task format."
        )