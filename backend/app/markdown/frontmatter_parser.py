from typing import Any

import yaml


class FrontmatterParser:

    def parse(
        self,
        content: str,
    ) -> dict[str, Any]:

        frontmatter = self._extract_frontmatter(
            content
        )

        if frontmatter is None:
            return {}

        try:
            data = yaml.safe_load(
                frontmatter
            )
        except yaml.YAMLError:
            return {}

        if not isinstance(data, dict):
            return {}

        return data


    def _extract_frontmatter(
        self,
        content: str,
    ) -> str | None:

        if not content.startswith("---"):
            return None

        lines = content.splitlines(
            keepends=True
        )

        if not lines:
            return None

        if lines[0].strip() != "---":
            return None

        for index in range(
            1,
            len(lines),
        ):
            if lines[index].strip() == "---":
                return "".join(
                    lines[1:index]
                )

        return None