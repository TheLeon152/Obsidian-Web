from fastapi import APIRouter

from app.config import settings
from app.models.vault import VaultNode
from app.services.vault_service import VaultService
from app.services.vault import vault_indexer


router = APIRouter(
    prefix="/api/v1/vault",
    tags=["vault"],
)


vault_service = VaultService(
    settings.vault_path,
    vault_indexer,
)


@router.get(
    "/tree",
    response_model=VaultNode,
)
def get_vault_tree() -> VaultNode:

    return vault_service.build_tree()


@router.post("/refresh")
def refresh_vault():

    vault_service.refresh()

    return {
        "message": "Vault index refreshed successfully."
    }