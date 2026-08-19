from pathlib import Path


class AssetResolver:

    def __init__(self, vault_path: Path):
        self.vault_path = vault_path

    def resolve(self, asset_name: str) -> Path:
        normalized_name = asset_name.strip()

        if not normalized_name:
            raise ValueError(
                "Asset name cannot be empty."
            )

        matches = list(
            self.vault_path.rglob(
                normalized_name
            )
        )

        if not matches:
            raise FileNotFoundError(
                f"Asset not found: {normalized_name}"
            )

        files = [
            path
            for path in matches
            if path.is_file()
        ]

        if not files:
            raise FileNotFoundError(
                f"Asset not found: {normalized_name}"
            )

        if len(files) > 1:
            raise ValueError(
                f"Multiple assets found for: {normalized_name}"
            )

        return files[0]