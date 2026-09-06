from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.config import settings

from app.models.inbox import (
    CreateInboxNote,
    InboxNote,
    InboxNoteSummary,
    UpdateInboxNote,
)

from app.services.inbox import InboxService
from app.services.vault import vault_indexer
from app.auth.dependencies import get_current_user
from app.services.upload_service import UploadService
from app.services.vault_service import VaultService


router = APIRouter(
    prefix="/api/v1/inbox",
    tags=["inbox"],
    dependencies=[
        Depends(get_current_user)
    ],
)


inbox_service = InboxService(
    vault_path=vault_indexer.vault_path,
    inbox_folder=settings.inbox_folder,
)

def get_upload_service() -> UploadService:
    return UploadService(
        settings.vault_path,
        settings.inbox_folder,
    )

vault_service = VaultService(
    settings.vault_path,
    vault_indexer,
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


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    upload_service: UploadService = Depends(get_upload_service),
):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Filename is required.",
        )

    try:
        file_type = upload_service.validate_filename(file.filename)
        destination = upload_service.get_destination(file.filename)
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    upload_service.inbox_path.mkdir(
        parents=True,
        exist_ok=True,
    )

    temp_file = upload_service.create_temp_file()
    temp_path = Path(temp_file.name)

    size = 0

    try:
        with temp_file:
            while True:
                chunk = await file.read(1024 * 1024)

                if not chunk:
                    break

                size += len(chunk)

                if size > upload_service.validator.MAX_FILE_SIZE:
                    raise ValueError("Uploaded file is too large.")

                temp_file.write(chunk)

        upload_service.validator.validate_size(size)
        upload_service.validator.validate_content(
            temp_path,
            file_type,
        )

        destination.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        temp_path.replace(destination)

        vault_service.refresh()

        return {
            "name": destination.name,
            "path": destination.relative_to(
                settings.vault_path
            ).as_posix(),
            "file_type": file_type,
            "size": size,
        }

    except ValueError as error:
        if temp_path.exists():
            temp_path.unlink()

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    except Exception:
        if temp_path.exists():
            temp_path.unlink()

        raise