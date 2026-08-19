from pathlib import Path

from app.services.asset_resolver import AssetResolver


class AssetService:

    def __init__(self, vault_path: Path):
        self.vault_path = vault_path
        self.resolver = AssetResolver(vault_path)

    def resolve_asset(
        self,
        asset_name: str
    ) -> Path:
        return self.resolver.resolve(
            asset_name
        )

    def get_asset(
        self,
        asset_path: str
    ) -> Path:
        requested_path = (
            self.vault_path / asset_path
        ).resolve()

        vault_root = (
            self.vault_path.resolve()
        )

        if not requested_path.is_relative_to(
            vault_root
        ):
            raise ValueError(
                "Asset path is outside the vault."
            )

        if not requested_path.exists():
            raise FileNotFoundError(
                f"Asset not found: {asset_path}"
            )

        if not requested_path.is_file():
            raise ValueError(
                "Requested asset is not a file."
            )

        return requested_path