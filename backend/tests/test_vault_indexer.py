from pathlib import Path

from app.services.vault_indexer import (
    VaultIndexer,
)


def test_vault_indexer_1(
    tmp_path: Path,
):
    vault = tmp_path / "vault"

    vault.mkdir()

    note = vault / "Test.md"

    note.write_text(
        """---
tags:
  - programming
  - project/test
---

# Test

This is #react.
""",
        encoding="utf-8",
    )

    indexer = VaultIndexer(vault)

    indexer.build()

    index = indexer.get_index()

    assert "Test.md" in index

    assert index["Test.md"]["tags"] == [
        "programming",
        "project/test",
        "react",
    ]

def test_vault_indexer_2(
    tmp_path: Path,
):
    vault = tmp_path / "vault"

    vault.mkdir()

    note = vault / "Test.md"

    note.write_text(
        """---
title: Test Note
type: knowledge
status: active
tags:
  - programming
  - project/test
---

# Test

This is #react.
See [[React]] and [[FastAPI|FastAPI Backend]].
""",
        encoding="utf-8",
    )

    indexer = VaultIndexer(vault)

    indexer.build()

    index = indexer.get_index()

    assert "Test.md" in index

    assert index["Test.md"]["tags"] == [
        "programming",
        "project/test",
        "react",
    ]

    assert index["Test.md"]["frontmatter"] == {
        "title": "Test Note",
        "type": "knowledge",
        "status": "active",
        "tags": [
            "programming",
            "project/test",
        ],
    }

    assert index["Test.md"]["links"] == [
        "FastAPI",
        "React",
    ]


def test_vault_indexer_backlinks(
    tmp_path: Path,
):
    vault = tmp_path / "vault"

    vault.mkdir()

    source = vault / "Source.md"

    source.write_text(
        """# Source

See [[Target]].
""",
        encoding="utf-8",
    )

    target = vault / "Target.md"

    target.write_text(
        """# Target
""",
        encoding="utf-8",
    )

    indexer = VaultIndexer(vault)

    indexer.build()

    index = indexer.get_index()

    assert index["Source.md"][
        "resolved_links"
    ] == [
        {
            "target": "Target",
            "path": "Target.md",
        }
    ]

    assert index["Target.md"][
        "backlinks"
    ] == [
        "Source.md"
    ]


def test_multiple_backlinks(
    tmp_path: Path,
):
    vault = tmp_path / "vault"

    vault.mkdir()

    target = vault / "Target.md"

    target.write_text(
        "# Target",
        encoding="utf-8",
    )

    first = vault / "First.md"

    first.write_text(
        "[[Target]]",
        encoding="utf-8",
    )

    second = vault / "Second.md"

    second.write_text(
        "[[Target]]",
        encoding="utf-8",
    )

    indexer = VaultIndexer(vault)

    indexer.build()

    index = indexer.get_index()

    assert index["Target.md"][
        "backlinks"
    ] == [
        "First.md",
        "Second.md",
    ]