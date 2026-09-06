from pathlib import Path

import pytest

from app.services.file_type_registry import FileType
from app.services.upload_service import UploadService


def test_get_destination(tmp_path: Path):

    inbox = tmp_path / "00_Inbox"
    inbox.mkdir()

    service = UploadService(
        tmp_path,
        "00_Inbox",
    )

    destination = service.get_destination(
        "image.png"
    )

    assert destination == (
        inbox / "image.png"
    ).resolve()


def test_reject_unsupported_file(
    tmp_path: Path,
):

    service = UploadService(
        tmp_path,
        "00_Inbox",
    )

    with pytest.raises(ValueError):
        service.get_destination(
            "malware.exe"
        )


def test_reject_directory_in_filename(
    tmp_path: Path,
):

    service = UploadService(
        tmp_path,
        "00_Inbox",
    )

    with pytest.raises(ValueError):
        service.get_destination(
            "../image.png"
        )


def test_reject_nested_path(
    tmp_path: Path,
):

    service = UploadService(
        tmp_path,
        "00_Inbox",
    )

    with pytest.raises(ValueError):
        service.get_destination(
            "subfolder/image.png"
        )