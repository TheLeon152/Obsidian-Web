import re
from pathlib import Path


TAG_PATTERN = re.compile(
    r"(?<![\w#])#([A-Za-z0-9_/-]+)"
)


class TagService:

    def __init__(self, vault_path: Path):
        self.vault_path = vault_path

    def build_index(self) -> dict[str, list[str]]:
        index: dict[str, list[str]] = {}

        for path in self.vault_path.rglob("*.md"):
            try:
                content = path.read_text(
                    encoding="utf-8"
                )
            except UnicodeDecodeError:
                continue

            tags = self.extract_tags(content)

            relative_path = path.relative_to(
                self.vault_path
            ).as_posix()

            for tag in tags:
                index.setdefault(
                    tag,
                    []
                ).append(relative_path)

        return index

    def extract_tags(
        self,
        content: str
    ) -> set[str]:

        tags = set()

        for match in TAG_PATTERN.finditer(
            content
        ):
            tags.add(
                match.group(1)
            )

        return tags

    def get_tags(self) -> list[str]:
        index = self.build_index()

        return sorted(
            index.keys()
        )

    def get_notes_for_tag(
        self,
        tag: str
    ) -> list[str]:

        normalized_tag = (
            tag.lstrip("#").lower()
        )

        index = self.build_index()

        return sorted(
            index.get(
                normalized_tag,
                []
            )
        )