from pathlib import Path

from app.config import settings

from app.markdown.frontmatter_parser import (
    FrontmatterParser,
)
from app.markdown.tag_parser import TagParser
from app.markdown.wikilink_parser import (
    WikiLinkParser,
)
from app.markdown.task_parser import TaskParser
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

        self.tasks_folder = (
            settings.tasks_folder
            .replace("\\", "/")
            .strip("/")
        )

        self.tag_parser = TagParser()

        self.frontmatter_parser = (
            FrontmatterParser()
        )

        self.wikilink_parser = (
            WikiLinkParser()
        )

        self.task_parser = TaskParser()

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


            # --------------------------------------------------
            # Tasks
            # --------------------------------------------------
            #
            # Tasks werden ausschließlich aus dem konfigurierten
            # Task-Ordner und dessen Unterordnern gelesen.
            #
            # Beispiel:
            #
            # TASKS_FOLDER=Work/08 Tasks
            #
            # Erlaubt:
            #
            # Work/08 Tasks/Test.md
            # Work/08 Tasks/Projekte/DPP.md
            #
            # Nicht erlaubt:
            #
            # Work/01 Daily/2026-08-21.md
            # 00_Inbox/Test.md
            # Projects/Test.md
            # --------------------------------------------------

            tasks = []

            normalized_path = (
                relative_path
                .replace("\\", "/")
                .strip("/")
            )

            if (
                normalized_path.startswith(
                    self.tasks_folder + "/"
                )
            ):
                tasks = (
                    self.task_parser.extract_tasks(
                        content,
                        relative_path,
                    )
                )


            # --------------------------------------------------
            # WikiLinks auflösen
            # --------------------------------------------------

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

                    content=content,

                    tags=sorted(tags),

                    frontmatter=frontmatter,

                    links=sorted(links),

                    resolved_links=sorted(
                        resolved_links,
                        key=lambda item:
                            item.path.lower(),
                    ),

                    backlinks=[],

                    tasks=tasks,
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