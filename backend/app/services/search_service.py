from app.services.vault_indexer import VaultIndexer


class SearchService:

    CONTEXT_LENGTH = 160


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

            searchable_content = (
                note.content.lower()
            )


            score = 0


            # ----------------------------------------
            # Name
            # ----------------------------------------

            if query in searchable_name:

                if searchable_name == query:
                    score += 100
                else:
                    score += 75


            # ----------------------------------------
            # Tags
            # ----------------------------------------

            for tag in searchable_tags:

                if query in tag:
                    score += 50


            # ----------------------------------------
            # Pfad
            # ----------------------------------------

            if query in searchable_path:
                score += 25


            # ----------------------------------------
            # Inhalt
            # ----------------------------------------

            context = None

            content_index = (
                searchable_content.find(query)
            )

            if content_index != -1:

                score += 10

                context = self._create_context(
                    note.content,
                    content_index,
                )


            if score == 0:
                continue


            results.append(
                {
                    "name": (
                        name_without_extension
                    ),
                    "path": path,
                    "tags": note.tags,
                    "context": context,
                    "_score": score,
                }
            )


        # ----------------------------------------
        # Sortierung
        # ----------------------------------------

        results.sort(
            key=lambda result: (
                -result["_score"],
                result["name"].lower(),
                result["path"].lower(),
            )
        )


        # ----------------------------------------
        # Internes Scoring entfernen
        # ----------------------------------------

        for result in results:

            result.pop(
                "_score",
                None,
            )


        return results


    def _create_context(
        self,
        content: str,
        match_index: int,
    ) -> str:

        half_length = (
            self.CONTEXT_LENGTH // 2
        )

        start = max(
            0,
            match_index - half_length,
        )

        end = min(
            len(content),
            match_index + half_length,
        )

        context = (
            content[start:end]
            .replace("\n", " ")
            .strip()
        )


        if start > 0:
            context = "..." + context


        if end < len(content):
            context = context + "..."


        return context