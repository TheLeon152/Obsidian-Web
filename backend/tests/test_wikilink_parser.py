from app.markdown.wikilink_parser import (
    WikiLinkParser,
)


def test_simple_wikilink():
    parser = WikiLinkParser()

    content = """
This links to [[Obsidian Web]].
"""

    links = parser.extract_links(
        content
    )

    assert links == {
        "Obsidian Web",
    }


def test_multiple_wikilinks():
    parser = WikiLinkParser()

    content = """
[[Obsidian Web]]
[[FastAPI]]
[[React]]
"""

    links = parser.extract_links(
        content
    )

    assert links == {
        "Obsidian Web",
        "FastAPI",
        "React",
    }


def test_wikilink_alias():
    parser = WikiLinkParser()

    content = """
See [[Obsidian Web|my project]].
"""

    links = parser.extract_links(
        content
    )

    assert links == {
        "Obsidian Web",
    }


def test_wikilink_heading():
    parser = WikiLinkParser()

    content = """
See [[Obsidian Web#Architecture]].
"""

    links = parser.extract_links(
        content
    )

    assert links == {
        "Obsidian Web",
    }


def test_code_block_is_ignored():
    parser = WikiLinkParser()

    content = """
[[Real Note]]

```text
[[Fake Note]]
```

[[Another Real Note]]
"""

    links = parser.extract_links(
        content
    )

    assert links == {
        "Real Note",
        "Another Real Note",
    }

def test_inline_code_is_ignored():
    parser = WikiLinkParser()
    content = """
[[Real Note]]

This is `[[Fake Note]]`.
"""
    links = parser.extract_links(
        content
    )

    assert links == {
        "Real Note",
    }

def test_duplicate_links():
    parser = WikiLinkParser()

    content = """
[[React]]
[[React]]
[[React]]
"""

    links = parser.extract_links(
        content
    )

    assert links == {
        "React",
    }