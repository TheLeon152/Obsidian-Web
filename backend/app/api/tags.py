from fastapi import APIRouter, Depends

from app.services.tag_service import TagService
from app.services import vault_indexer
from app.auth.dependencies import get_current_user


router = APIRouter(
    prefix="/api/v1/tags",
    tags=["tags"],
    dependencies=[
        Depends(get_current_user)
    ],
)


tag_service = TagService(
    vault_indexer
)


@router.get("")
def get_tags():
    return {
        "tags": tag_service.get_tags()
    }


@router.get("/{tag:path}")
def get_notes_for_tag(
    tag: str,
):
    return {
        "tag": tag.lstrip("#"),
        "notes": tag_service.get_notes_for_tag(
            tag
        ),
    }