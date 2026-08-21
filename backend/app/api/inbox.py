from datetime import datetime

from fastapi import APIRouter, HTTPException

from app.config import settings

from app.models.inbox import (
    CreateInboxNote,
    InboxNote,
    InboxNoteSummary,
    UpdateInboxNote,
)

from app.services.inbox import InboxService
from app.services.vault import vault_indexer


router = APIRouter(
    prefix="/api/v1/inbox",
    tags=["inbox"],
)


inbox_service = InboxService(
    vault_path=vault_indexer.vault_path,
    inbox_folder=settings.inbox_folder,
)


@router.get(
    "",
    response_model=list[InboxNoteSummary],
)
def get_inbox_notes() -> list[InboxNoteSummary]:

    notes = []

    for filename in (
        inbox_service.list_notes()
    ):

        path = (
            inbox_service.inbox_path
            / filename
        )

        try:
            modified_at = (
                path.stat().st_mtime
            )

        except OSError:
            modified_at = None

        notes.append(
            InboxNoteSummary(
                filename=filename,
                modified_at=(
                    datetime.fromtimestamp(
                        modified_at
                    )
                    if modified_at is not None
                    else None
                ),
            )
        )

    return notes


@router.get(
    "/{filename}",
    response_model=InboxNote,
)
def get_inbox_note(
    filename: str,
) -> InboxNote:

    try:

        content = (
            inbox_service.read_note(
                filename
            )
        )

    except FileNotFoundError:

        raise HTTPException(
            status_code=404,
            detail="Inbox note not found.",
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    return InboxNote(
        filename=filename,
        content=content,
    )


@router.post(
    "",
    response_model=InboxNote,
    status_code=201,
)
def create_inbox_note(
    note: CreateInboxNote,
) -> InboxNote:

    try:

        inbox_service.create_note(
            note.filename,
            note.content,
        )

    except FileExistsError:

        raise HTTPException(
            status_code=409,
            detail="Inbox note already exists.",
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    return InboxNote(
        filename=note.filename,
        content=note.content,
    )


@router.put(
    "/{filename}",
    response_model=InboxNote,
)
def update_inbox_note(
    filename: str,
    note: UpdateInboxNote,
) -> InboxNote:

    try:

        inbox_service.update_note(
            filename,
            note.content,
        )

    except FileNotFoundError:

        raise HTTPException(
            status_code=404,
            detail="Inbox note not found.",
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    return InboxNote(
        filename=filename,
        content=note.content,
    )

@router.delete(
    "/{filename}",
    status_code=204,
)
def delete_inbox_note(
    filename: str,
) -> None:

    try:

        inbox_service.delete_note(
            filename
        )

    except FileNotFoundError:

        raise HTTPException(
            status_code=404,
            detail="Inbox note not found.",
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )