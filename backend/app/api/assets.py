from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.config import settings
from app.services.asset_service import AssetService


router = APIRouter(
    prefix="/api/v1/assets",
    tags=["assets"],
)

asset_service = AssetService(
    settings.vault_path
)


@router.get("/resolve/{asset_name:path}")
def resolve_asset(asset_name: str):
    try:
        path = asset_service.resolve_asset(
            asset_name
        )

        relative_path = path.relative_to(
            settings.vault_path
        )

        return {
            "name": path.name,
            "path": relative_path.as_posix(),
        }

    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="Asset not found",
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


@router.get("/{asset_path:path}")
def get_asset(asset_path: str):
    try:
        path = asset_service.get_asset(
            asset_path
        )

        return FileResponse(path)

    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="Asset not found",
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )