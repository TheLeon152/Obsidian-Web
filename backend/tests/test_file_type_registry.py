from pathlib import Path

from app.services.file_type_registry import (
    FileType,
    FileTypeRegistry,
)


def test_markdown_is_supported():

    path = Path("test.md")

    assert (
        FileTypeRegistry.get_type(path)
        == FileType.MARKDOWN
    )


def test_canvas_is_supported():

    path = Path("test.canvas")

    assert (
        FileTypeRegistry.get_type(path)
        == FileType.CANVAS
    )


def test_image_is_supported():

    path = Path("image.png")

    assert (
        FileTypeRegistry.get_type(path)
        == FileType.IMAGE
    )


def test_pdf_is_supported():

    path = Path("document.pdf")

    assert (
        FileTypeRegistry.get_type(path)
        == FileType.PDF
    )


def test_csv_is_supported():

    path = Path("data.csv")

    assert (
        FileTypeRegistry.get_type(path)
        == FileType.CSV
    )


def test_docx_is_supported():

    path = Path("document.docx")

    assert (
        FileTypeRegistry.get_type(path)
        == FileType.DOCX
    )


def test_unsupported_file_returns_none():

    path = Path("malicious.exe")

    assert (
        FileTypeRegistry.get_type(path)
        is None
    )


def test_extension_is_case_insensitive():

    assert (
        FileTypeRegistry.get_type(
            Path("IMAGE.PNG")
        )
        == FileType.IMAGE
    )