from app.services.vault_indexer import (
    VaultIndexer,
)


class TagService:

    def __init__(
        self,
        vault_indexer: VaultIndexer,
    ):
        self.vault_indexer = (
            vault_indexer
        )


    def get_tags(
        self,
    ) -> list[str]:

        index = (
            self.vault_indexer.get_index()
        )

        tags: set[str] = set()

        for note in index.values():
            tags.update(
                note.tags
            )

        return sorted(tags)


    def get_notes_for_tag(
        self,
        tag: str,
    ) -> list[str]:

        normalized_tag = (
            tag
            .lstrip("#")
            .lower()
        )

        index = (
            self.vault_indexer.get_index()
        )

        notes: list[str] = []

        for path, note in index.items():

            note_tags = {
                current_tag.lower()
                for current_tag in note.tags
            }

            if normalized_tag in note_tags:
                notes.append(path)

        return sorted(notes)