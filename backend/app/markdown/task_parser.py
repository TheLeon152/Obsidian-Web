import re
from datetime import date

from app.models.task import Task


class TaskParser:

    TASK_PATTERN = re.compile(
        r"^(\s*)[-*]\s+\[([ xX])\]\s+(.*)$"
    )

    PROPERTY_PATTERN = re.compile(
        r"\[([^\]:]+)::\s*([^\]]*)\]"
    )

    def extract_tasks(
        self,
        content: str,
        relative_path: str,
    ) -> list[Task]:

        tasks: list[Task] = []

        for line_number, line in enumerate(
            content.splitlines(),
            start=1,
        ):

            match = self.TASK_PATTERN.match(
                line
            )

            if not match:
                continue

            completed_marker = match.group(2)
            task_content = match.group(3)

            completed = (
                completed_marker.lower()
                == "x"
            )

            properties = (
                self._extract_properties(
                    task_content
                )
            )

            text = self._clean_task_text(
                task_content
            )

            task = Task(
                text=text,
                path=relative_path,
                line=line_number,
                completed=completed,

                priority=self._parse_priority(
                    properties.get("priority")
                ),

                deadline=self._parse_date(
                    properties.get("deadline")
                ),

                task_state=(
                    properties.get("task-state")
                    if properties.get("task-state")
                    in {"▶️", "⏳", "🚧"}
                    else None
                ),

                waiting_for=properties.get(
                    "waiting-for"
                ),

                waiting_since=self._parse_date(
                    properties.get(
                        "waiting-since"
                    )
                ),

                follow_up=self._parse_date(
                    properties.get(
                        "follow-up"
                    )
                ),

                blocked_by=properties.get(
                    "blocked-by"
                ),
            )

            tasks.append(task)

        return tasks


    def _extract_properties(
        self,
        text: str,
    ) -> dict[str, str]:

        matches = self.PROPERTY_PATTERN.findall(
            text
        )

        return {
            key.strip(): value.strip()
            for key, value in matches
        }


    def _clean_task_text(
        self,
        text: str,
    ) -> str:

        return self.PROPERTY_PATTERN.sub(
            "",
            text,
        ).strip()


    def _parse_priority(
        self,
        value: str | None,
    ) -> str | None:

        if value not in {
            "high",
            "medium",
            "low",
        }:
            return None

        return value


    def _parse_date(
        self,
        value: str | None,
    ) -> date | None:

        if not value:
            return None

        try:
            return date.fromisoformat(
                value
            )
        except ValueError:
            return None