from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, HTMLResponse

from app.auth.dependencies import get_current_user
from app.config import settings
from app.services.file_service import FileService
from app.services.docx_service import DocxService


router = APIRouter(
    prefix="/api/v1/files",
    tags=["files"],
    dependencies=[Depends(get_current_user)],
)


file_service = FileService(settings.vault_path)
docx_service = DocxService()


@router.get("/metadata/{file_path:path}")
def get_file_metadata(file_path: str):

    try:
        return file_service.get_metadata(file_path)

    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="File not found",
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


@router.get("/docx/{file_path:path}")
def get_docx_content(file_path: str):

    try:
        path = file_service.get_file(file_path)

        html = docx_service.render_html(path)

        return HTMLResponse(content=html)

    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="File not found",
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


@router.get("/{file_path:path}")
def get_file(file_path: str):

    try:
        path = file_service.get_file(file_path)

        return FileResponse(path)

    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="File not found",
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )