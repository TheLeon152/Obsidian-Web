from pathlib import Path


class WikiLinkResolver:

    def __init__(
        self,
        vault_path: Path,
    ):
        self.vault_path = vault_path

        self._exact_paths: dict[
            str,
            str,
        ] = {}

        self._file_names: dict[
            str,
            list[str],
        ] = {}


    def build(self) -> None:

        self._exact_paths.clear()
        self._file_names.clear()

        for path in self.vault_path.rglob(
            "*.md"
        ):

            relative_path = (
                path.relative_to(
                    self.vault_path
                ).as_posix()
            )

            normalized_path = (
                self._normalize(
                    relative_path
                )
            )

            self._exact_paths[
                normalized_path
            ] = relative_path

            file_name = path.stem.lower()

            self._file_names.setdefault(
                file_name,
                [],
            ).append(
                relative_path
            )


    def resolve(
        self,
        target: str,
    ) -> str | None:

        normalized_target = (
            self._normalize(
                target
            )
        )

        # ------------------------------------------------
        # 1. Exakter Pfad
        # ------------------------------------------------

        exact = self._exact_paths.get(
            normalized_target
        )

        if exact:
            return exact


        # ------------------------------------------------
        # 2. Dateiname
        # ------------------------------------------------

        file_name = Path(
            normalized_target
        ).name

        matches = self._file_names.get(
            file_name,
            [],
        )

        if len(matches) == 1:
            return matches[0]


        # ------------------------------------------------
        # 3. Nicht vorhanden / mehrdeutig
        # ------------------------------------------------

        return None


    def _normalize(
        self,
        value: str,
    ) -> str:

        value = value.strip()

        value = value.replace(
            "\\",
            "/",
        )

        if value.lower().endswith(
            ".md"
        ):
            value = value[:-3]

        return value.lower()