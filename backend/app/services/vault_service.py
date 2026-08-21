from pathlib import Path

from app.models.vault import (
    FolderContent,
    FolderEntry,
    VaultNode,
)

from app.services.vault_indexer import VaultIndexer


class VaultService:

    def __init__(
        self,
        vault_path: Path,
        vault_indexer: VaultIndexer,
    ):
        self.vault_path = vault_path
        self.vault_indexer = vault_indexer


    def build_tree(self) -> VaultNode:
        return self._build_node(
            self.vault_path
        )


    def refresh(self) -> None:
        self.vault_indexer.build()


    def get_folder_content(
        self,
        relative_path: str,
    ) -> FolderContent:

        relative_path = relative_path.replace(
            "\\",
            "/",
        )

        folder_path = (
            self.vault_path / relative_path
        ).resolve()

        vault_path = (
            self.vault_path.resolve()
        )

        if not folder_path.is_relative_to(
            vault_path
        ):
            raise ValueError(
                "Path is outside of the vault."
            )

        if not folder_path.exists():
            raise FileNotFoundError(
                relative_path
            )

        if not folder_path.is_dir():
            raise ValueError(
                f"Path is not a folder: {relative_path}"
            )

        folders: list[FolderEntry] = []
        notes: list[FolderEntry] = []

        for child in sorted(
            folder_path.iterdir(),
            key=lambda p: (
                not p.is_dir(),
                p.name.lower(),
            ),
        ):

            if not self._should_include(child):
                continue

            child_relative_path = (
                child.relative_to(
                    self.vault_path
                ).as_posix()
            )

            entry = FolderEntry(
                name=child.name,
                path=child_relative_path,
            )

            if child.is_dir():
                folders.append(entry)

            elif (
                child.is_file()
                and child.suffix.lower() == ".md"
            ):
                notes.append(entry)

        return FolderContent(
            name=folder_path.name,
            path=folder_path.relative_to(
                self.vault_path
            ).as_posix(),
            folders=folders,
            notes=notes,
        )


    def _build_node(
        self,
        path: Path,
    ) -> VaultNode:

        relative_path = path.relative_to(
            self.vault_path
        )

        if path.is_dir():

            children = [
                self._build_node(child)
                for child in sorted(
                    path.iterdir(),
                    key=lambda p: (
                        not p.is_dir(),
                        p.name.lower(),
                    ),
                )
                if self._should_include(child)
            ]

            return VaultNode(
                name=path.name,
                type="folder",
                path=relative_path.as_posix(),
                children=children,
            )

        return VaultNode(
            name=path.name,
            type="file",
            path=relative_path.as_posix(),
        )


    def _should_include(
        self,
        path: Path,
    ) -> bool:

        if path.name == ".obsidian":
            return False

        if path.name.startswith("."):
            return False

        return True