from fastapi import APIRouter

from app.config import settings
from app.services.tag_service import TagService


router = APIRouter(
    prefix="/api/v1/tags",
    tags=["tags"],
)


tag_service = TagService(
    settings.vault_path
)


@router.get("")
def get_tags():
    return {
        "tags": tag_service.get_tags()
    }


@router.get("/{tag:path}")
def get_notes_for_tag(
    tag: str
):
    return {
        "tag": tag.lstrip("#"),
        "notes": tag_service.get_notes_for_tag(
            tag
        ),
    }