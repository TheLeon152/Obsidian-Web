from pathlib import Path

from app.models.vault import VaultNode
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