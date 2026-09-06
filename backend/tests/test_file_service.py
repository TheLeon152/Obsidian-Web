from pathlib import Path

import pytest

from app.services.file_service import FileService
from app.services.file_type_registry import FileType


def test_get_supported_file(tmp_path: Path):

    image = tmp_path / "image.png"
    image.write_bytes(b"fake image")

    service = FileService(tmp_path)

    result = service.get_file("image.png")

    assert result == image


def test_reject_unsupported_file(tmp_path: Path):

    executable = tmp_path / "malware.exe"
    executable.write_bytes(b"fake executable")

    service = FileService(tmp_path)

    with pytest.raises(ValueError):
        service.get_file("malware.exe")


def test_reject_path_traversal(tmp_path: Path):

    service = FileService(tmp_path)

    with pytest.raises(ValueError):
        service.get_file("../secret.txt")


def test_get_metadata(tmp_path: Path):

    image = tmp_path / "image.png"
    content = b"fake image"
    image.write_bytes(content)

    service = FileService(tmp_path)

    metadata = service.get_metadata("image.png")

    assert metadata.name == "image.png"
    assert metadata.path == "image.png"
    assert metadata.file_type == FileType.IMAGE
    assert metadata.size == len(content)