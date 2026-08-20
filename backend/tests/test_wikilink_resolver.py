from pathlib import Path

from app.markdown.wikilink_resolver import (
    WikiLinkResolver,
)


def create_note(
    vault: Path,
    path: str,
):
    note = vault / path

    note.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    note.write_text(
        "# Test",
        encoding="utf-8",
    )


def test_resolve_exact_path(
    tmp_path: Path,
):
    vault = tmp_path / "vault"

    create_note(
        vault,
        "Knowledge/React.md",
    )

    resolver = WikiLinkResolver(vault)

    resolver.build()

    assert resolver.resolve(
        "Knowledge/React"
    ) == "Knowledge/React.md"


def test_resolve_path_with_extension(
    tmp_path: Path,
):
    vault = tmp_path / "vault"

    create_note(
        vault,
        "Knowledge/React.md",
    )

    resolver = WikiLinkResolver(vault)

    resolver.build()

    assert resolver.resolve(
        "Knowledge/React.md"
    ) == "Knowledge/React.md"


def test_resolve_by_filename(
    tmp_path: Path,
):
    vault = tmp_path / "vault"

    create_note(
        vault,
        "Knowledge/React.md",
    )

    resolver = WikiLinkResolver(vault)

    resolver.build()

    assert resolver.resolve(
        "React"
    ) == "Knowledge/React.md"


def test_missing_note(
    tmp_path: Path,
):
    vault = tmp_path / "vault"

    vault.mkdir()

    resolver = WikiLinkResolver(vault)

    resolver.build()

    assert resolver.resolve(
        "Does Not Exist"
    ) is None


def test_ambiguous_filename(
    tmp_path: Path,
):
    vault = tmp_path / "vault"

    create_note(
        vault,
        "Knowledge/React.md",
    )

    create_note(
        vault,
        "Archive/React.md",
    )

    resolver = WikiLinkResolver(vault)

    resolver.build()

    assert resolver.resolve(
        "React"
    ) is None