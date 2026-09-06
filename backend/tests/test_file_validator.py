from pathlib import Path

import json

import pytest

from app.services.file_type_registry import FileType
from app.services.file_validator import FileValidator


def test_valid_extension():

    validator = FileValidator()

    assert (
        validator.validate_extension("image.png")
        == FileType.IMAGE
    )


def test_unsupported_extension():

    validator = FileValidator()

    with pytest.raises(ValueError):
        validator.validate_extension(
            "malware.exe"
        )


def test_empty_file():

    validator = FileValidator()

    with pytest.raises(ValueError):
        validator.validate_size(0)


def test_file_too_large():

    validator = FileValidator()

    with pytest.raises(ValueError):
        validator.validate_size(
            validator.MAX_FILE_SIZE + 1
        )


def test_valid_size():

    validator = FileValidator()

    validator.validate_size(1024)


def test_valid_png(tmp_path):

    path = tmp_path / "image.png"

    path.write_bytes(
        b"\x89PNG\r\n\x1a\n"
        + b"fake image data"
    )

    validator = FileValidator()

    validator.validate_content(
        path,
        FileType.IMAGE,
    )

def test_fake_png_rejected(tmp_path):

    path = tmp_path / "image.png"

    path.write_bytes(
        b"This is actually not a PNG."
    )

    validator = FileValidator()

    with pytest.raises(ValueError):
        validator.validate_content(
            path,
            FileType.IMAGE,
        )


def test_valid_pdf(tmp_path):

    path = tmp_path / "document.pdf"

    path.write_bytes(
        b"%PDF-1.7\n"
    )

    validator = FileValidator()

    validator.validate_content(
        path,
        FileType.PDF,
    )


def test_fake_pdf_rejected(tmp_path):

    path = tmp_path / "document.pdf"

    path.write_bytes(
        b"This is not a PDF."
    )

    validator = FileValidator()

    with pytest.raises(ValueError):
        validator.validate_content(
            path,
            FileType.PDF,
        )


def test_valid_canvas(tmp_path):

    path = tmp_path / "test.canvas"

    path.write_text(
        json.dumps({
            "nodes": [],
            "edges": [],
        }),
        encoding="utf-8",
    )

    validator = FileValidator()

    validator.validate_content(
        path,
        FileType.CANVAS,
    )


def test_invalid_canvas(tmp_path):

    path = tmp_path / "test.canvas"

    path.write_text(
        '{"hello": "world"}',
        encoding="utf-8",
    )

    validator = FileValidator()

    with pytest.raises(ValueError):
        validator.validate_content(
            path,
            FileType.CANVAS,
        )