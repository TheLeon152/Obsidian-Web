from fastapi import APIRouter, HTTPException

from app.config import settings
from app.models.vault import Note, NoteReference
from app.services.note_resolver import NoteResolver
from app.services.note_service import NoteService


router = APIRouter(
    prefix="/api/v1/notes",
    tags=["notes"],
)


note_service = NoteService(settings.vault_path)
note_resolver = NoteResolver(settings.vault_path)


@router.get(
    "/resolve/{note_name}",
    response_model=NoteReference,
)
def resolve_note(note_name: str) -> NoteReference:
    try:
        return note_resolver.resolve(note_name)

    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="Note not found",
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


@router.get(
    "/{note_path:path}",
    response_model=Note,
)
def get_note(note_path: str) -> Note:
    try:
        return note_service.get_note(note_path)

    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="Note not found",
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )