from fastapi import APIRouter, HTTPException, Depends

from app.config import settings
from app.services.vault_service import VaultService
from app.services.vault import vault_indexer

from app.models.vault import (
    FolderContent,
    VaultNode,
)
from app.auth.dependencies import get_current_user


router = APIRouter(
    prefix="/api/v1/vault",
    tags=["vault"],
    dependencies=[
        Depends(get_current_user)
    ],
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


@router.get(
    "/folder/{folder_path:path}",
    response_model=FolderContent,
)
def get_folder_content(
    folder_path: str,
) -> FolderContent:

    try:
        return vault_service.get_folder_content(
            folder_path
        )

    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="Folder not found",
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


@router.post("/refresh")
def refresh_vault():

    vault_service.refresh()

    return {
        "message": "Vault index refreshed successfully."
    }