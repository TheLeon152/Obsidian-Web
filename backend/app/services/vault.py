from app.config import settings
from app.services.vault_indexer import VaultIndexer


vault_indexer = VaultIndexer(
    settings.vault_path
)

vault_indexer.build()