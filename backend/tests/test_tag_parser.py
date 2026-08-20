from app.markdown.tag_parser import TagParser


def test_inline_tags():
    parser = TagParser()

    content = """
# Test

This contains #programming
and #project/obsidian.
"""

    tags = parser.extract_tags(content)

    assert tags == {
        "programming",
        "project/obsidian",
    }


def test_frontmatter_list():
    parser = TagParser()

    content = """---
tags:
  - programming
  - project/obsidian
---

# Test
"""

    tags = parser.extract_tags(content)

    assert tags == {
        "programming",
        "project/obsidian",
    }


def test_frontmatter_inline_list():
    parser = TagParser()

    content = """---
tags: [programming, react, project/obsidian]
---

# Test
"""

    tags = parser.extract_tags(content)

    assert tags == {
        "programming",
        "react",
        "project/obsidian",
    }


def test_frontmatter_single_tag():
    parser = TagParser()

    content = """---
tags: programming
---

# Test
"""

    tags = parser.extract_tags(content)

    assert tags == {
        "programming",
    }


def test_code_block_is_ignored():
    parser = TagParser()

    content = """
# Real tag #programming

```python
#fake-tag
#another-fake-tag
```
"""
    tags = parser.extract_tags(content)

    assert tags == {
        "programming",
    }

def test_inline_code_is_ignored():
    parser = TagParser()
    content = """
This is a real #programming tag.

This is `#fake-tag`.
"""
    tags = parser.extract_tags(content)

    assert tags == {
        "programming",
    }

def test_duplicate_tags():
    parser = TagParser()
    content = """
#programming
#programming
#Programming
"""
    tags = parser.extract_tags(content)

    assert tags == {
        "programming",
    }

def test_nested_tags():
    parser = TagParser()
    content = """
#project
#project/frontend
#project/frontend/react
"""
    tags = parser.extract_tags(content)

    assert tags == {
        "project",
        "project/frontend",
        "project/frontend/react",
    }