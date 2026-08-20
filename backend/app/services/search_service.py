from app.services.vault_indexer import VaultIndexer


class SearchService:

    def __init__(
        self,
        vault_indexer: VaultIndexer,
    ):
        self.vault_indexer = vault_indexer


    def search(
        self,
        query: str,
    ) -> list[dict]:

        query = query.strip().lower()

        if not query:
            return []

        index = (
            self.vault_indexer.get_index()
        )

        results: list[dict] = []

        for path, note in index.items():

            name = path.rsplit(
                "/",
                1,
            )[-1]

            name_without_extension = (
                name[:-3]
                if name.lower().endswith(".md")
                else name
            )

            searchable_name = (
                name_without_extension.lower()
            )

            searchable_path = (
                path.lower()
            )

            searchable_tags = [
                tag.lower()
                for tag in note.tags
            ]

            if (
                query in searchable_name
                or query in searchable_path
                or any(
                    query in tag
                    for tag in searchable_tags
                )
            ):
                results.append(
                    {
                        "name": (
                            name_without_extension
                        ),
                        "path": path,
                        "tags": note.tags,
                    }
                )

        results.sort(
            key=lambda result: (
                result["name"].lower(),
                result["path"].lower(),
            )
        )

        return results
