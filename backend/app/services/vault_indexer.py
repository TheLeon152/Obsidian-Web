from pathlib import Path

from app.markdown.frontmatter_parser import (
    FrontmatterParser,
)
from app.markdown.tag_parser import TagParser
from app.markdown.wikilink_parser import (
    WikiLinkParser,
)
from app.markdown.wikilink_resolver import (
    WikiLinkResolver,
)
from app.models.vault import (
    IndexedNote,
    NoteReference,
    ResolvedLink,
)


class VaultIndexer:

    def __init__(
        self,
        vault_path: Path,
    ):
        self.vault_path = vault_path

        self.tag_parser = TagParser()

        self.frontmatter_parser = (
            FrontmatterParser()
        )

        self.wikilink_parser = (
            WikiLinkParser()
        )

        self.wikilink_resolver = (
            WikiLinkResolver(
                vault_path
            )
        )

        self._index: dict[
            str,
            IndexedNote,
        ] = {}


    def build(self) -> None:

        self.wikilink_resolver.build()

        index: dict[
            str,
            IndexedNote,
        ] = {}

        for path in self.vault_path.rglob(
            "*.md"
        ):
            try:
                content = path.read_text(
                    encoding="utf-8"
                )

            except UnicodeDecodeError:
                continue

            relative_path = (
                path.relative_to(
                    self.vault_path
                ).as_posix()
            )

            tags = (
                self.tag_parser.extract_tags(
                    content
                )
            )

            frontmatter = (
                self.frontmatter_parser.parse(
                    content
                )
            )

            links = (
                self.wikilink_parser.extract_links(
                    content
                )
            )

            resolved_links: list[
                ResolvedLink
            ] = []

            for link in links:

                target_path = (
                    self.wikilink_resolver.resolve(
                        link
                    )
                )

                if target_path is None:
                    continue

                resolved_links.append(
                    ResolvedLink(
                        target=link,
                        path=target_path,
                        name=Path(
                            target_path
                        ).stem,
                    )
                )

            index[relative_path] = (
                IndexedNote(
                    name=path.stem,
                    path=relative_path,

                    tags=sorted(tags),

                    frontmatter=frontmatter,

                    links=sorted(links),

                    resolved_links=sorted(
                        resolved_links,
                        key=lambda item:
                            item.path.lower(),
                    ),

                    backlinks=[],
                )
            )

        self._build_backlinks(
            index
        )

        self._index = index


    def _build_backlinks(
        self,
        index: dict[
            str,
            IndexedNote,
        ],
    ) -> None:

        for source_path, note in (
            index.items()
        ):

            for link in (
                note.resolved_links
            ):

                target_path = link.path

                if target_path not in index:
                    continue

                source_note = (
                    index[source_path]
                )

                index[
                    target_path
                ].backlinks.append(
                    NoteReference(
                        name=source_note.name,
                        path=source_path,
                    )
                )

        for note in index.values():
            note.backlinks.sort(
                key=lambda item:
                    item.path.lower()
            )


    def get_index(
        self,
    ) -> dict[
        str,
        IndexedNote,
    ]:
        return self._index