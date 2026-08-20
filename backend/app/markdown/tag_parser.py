import re
from typing import Any

import yaml

from app.markdown.frontmatter_parser import (
    FrontmatterParser,
)


TAG_PATTERN = re.compile(
    r"(?<![\w#])#([A-Za-z0-9_/-]+)(?![\w/-])"
)


class TagParser:

    def __init__(self):
        self.frontmatter_parser = (
            FrontmatterParser()
        )

    def extract_tags(
        self,
        content: str,
    ) -> set[str]:

        tags: set[str] = set()

        frontmatter = (
            self.frontmatter_parser.parse(
                content
            )
        )

        tags.update(
            self._extract_frontmatter_tags(
                frontmatter
            )
        )

        body = self._remove_frontmatter(
            content
        )

        body_without_code = (
            self._remove_code_blocks(
                body
            )
        )

        body_without_inline_code = (
            self._remove_inline_code(
                body_without_code
            )
        )

        tags.update(
            self._extract_inline_tags(
                body_without_inline_code
            )
        )

        return tags


    def _remove_frontmatter(
        self,
        content: str,
    ) -> str:

        if not content.startswith("---"):
            return content

        lines = content.splitlines(
            keepends=True
        )

        for index in range(
            1,
            len(lines),
        ):
            if lines[index].strip() == "---":
                return "".join(
                    lines[index + 1:]
                )

        return content


    def _extract_frontmatter_tags(
        self,
        frontmatter: dict,
    ) -> set[str]:

        raw_tags = frontmatter.get("tags")

        if raw_tags is None:
            return set()

        if isinstance(raw_tags, str):
            raw_tags = [raw_tags]

        if not isinstance(raw_tags, list):
            return set()

        tags: set[str] = set()

        for tag in raw_tags:
            if not isinstance(tag, str):
                continue

            normalized = self._normalize_tag(
                tag
            )

            if normalized:
                tags.add(normalized)

        return tags


    def _remove_code_blocks(
        self,
        content: str,
    ) -> str:

        return re.sub(
            r"```[\s\S]*?```",
            "",
            content,
        )


    def _remove_inline_code(
        self,
        content: str,
    ) -> str:

        return re.sub(
            r"`[^`\n]+`",
            "",
            content,
        )


    def _extract_inline_tags(
        self,
        content: str,
    ) -> set[str]:

        tags: set[str] = set()

        for match in TAG_PATTERN.finditer(
            content
        ):
            tag = self._normalize_tag(
                match.group(1)
            )

            if tag:
                tags.add(tag)

        return tags


    def _normalize_tag(
        self,
        tag: str,
    ) -> str:

        return tag.lstrip("#").strip().lower()