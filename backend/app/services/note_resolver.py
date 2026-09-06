from app.models.vault import NoteReference
from app.services.vault_indexer import VaultIndexer


class NoteResolver:

    def __init__(
        self,
        vault_indexer: VaultIndexer,
    ):
        self.vault_indexer = vault_indexer

    def resolve(
        self,
        target: str,
    ) -> NoteReference:

        # --------------------------------------------------
        # WikiLink über den bereits aufgebauten
        # In-Memory-Index auflösen.
        #
        # Dadurch wird beim Klick NICHT mehr der
        # komplette Vault mit rglob() durchsucht.
        # --------------------------------------------------

        target_path = (
            self.vault_indexer.resolve_wikilink(
                target
            )
        )

        if target_path is None:
            raise FileNotFoundError(
                f"Note not found: {target}"
            )

        # --------------------------------------------------
        # Indexierte Note holen
        # --------------------------------------------------

        note = (
            self.vault_indexer
            .get_index()
            .get(target_path)
        )

        if note is None:
            raise FileNotFoundError(
                f"Note not found: {target}"
            )

        # --------------------------------------------------
        # Referenz zurückgeben
        # --------------------------------------------------

        return NoteReference(
            name=note.name,
            path=note.path,
        )