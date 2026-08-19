from fastapi import APIRouter

from app.config import settings
from app.services.vault_service import VaultService
from app.models.vault import VaultNode


router = APIRouter(
    prefix="/api/v1/vault",
    tags=["vault"],
)


vault_service = VaultService(settings.vault_path)


@router.get("/tree", response_model=VaultNode)
def get_vault_tree() -> VaultNode:
    return vault_service.build_tree()