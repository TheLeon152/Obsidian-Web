from app.config import settings

from app.services.vault_indexer import VaultIndexer
from app.services.vault_service import VaultService


vault_indexer = VaultIndexer(
    settings.vault_path
)

vault_indexer.build()


def get_vault_service() -> VaultService:
    return VaultService(
        settings.vault_path,
        vault_indexer,
    )