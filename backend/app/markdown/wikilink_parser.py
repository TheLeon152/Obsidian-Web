import re


WIKILINK_PATTERN = re.compile(
    r"\[\[([^\]]+)\]\]"
)


class WikiLinkParser:

    def extract_links(
        self,
        content: str,
    ) -> set[str]:

        body = self._remove_code_blocks(
            content
        )

        body = self._remove_inline_code(
            body
        )

        links: set[str] = set()

        for match in WIKILINK_PATTERN.finditer(
            body
        ):
            raw_target = match.group(1)

            target = self._normalize_target(
                raw_target
            )

            if target:
                links.add(target)

        return links


    def _remove_code_blocks(
        self,
        content: str,
    ) -> str:

        return re.sub(
            r"```[\s\S]*?```",
            "",
            content,
        )


    def _remove_inline_code(
        self,
        content: str,
    ) -> str:

        return re.sub(
            r"`[^`\n]+`",
            "",
            content,
        )


    def _normalize_target(
        self,
        target: str,
    ) -> str:

        target = target.strip()

        if "|" in target:
            target = target.split(
                "|",
                1
            )[0]

        if "#" in target:
            target = target.split(
                "#",
                1
            )[0]

        return target.strip()