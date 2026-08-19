const OBSIDIAN_REGEX =
  /(!)?\[\[([^\]|]+)(?:\|([^\]]+))?\]\]|(^|[\s(])#([A-Za-z0-9_/-]+)/g;


export interface TextPart {
  type: "text";
  content: string;
}


export interface WikiLinkPart {
  type: "wikilink";
  target: string;
  displayText?: string;
}


export interface ImageEmbedPart {
  type: "image";
  path: string;
}


export interface TagPart {
  type: "tag";
  tag: string;
}


export type ObsidianPart =
  | TextPart
  | WikiLinkPart
  | ImageEmbedPart
  | TagPart;


export function parseObsidianInline(
  text: string
): ObsidianPart[] {
  const parts: ObsidianPart[] = [];

  let lastIndex = 0;

  for (const match of text.matchAll(
    OBSIDIAN_REGEX
  )) {
    const matchIndex = match.index;

    if (matchIndex === undefined) {
      continue;
    }

    const fullMatch = match[0];

    /*
     * Text before the match
     */
    if (matchIndex > lastIndex) {
      parts.push({
        type: "text",
        content: text.slice(
          lastIndex,
          matchIndex
        ),
      });
    }


    /*
     * Image / WikiLink
     */
    if (match[2]) {
      const isImage =
        match[1] === "!";

      const target =
        match[2].trim();

      const displayText =
        match[3]?.trim();

      if (isImage) {
        parts.push({
          type: "image",
          path: target,
        });
      } else {
        parts.push({
          type: "wikilink",
          target,
          displayText,
        });
      }

      lastIndex =
        matchIndex + fullMatch.length;

      continue;
    }


    /*
     * Tag
     */
    if (match[5]) {
      const tag = match[5];

      /*
       * The regex includes the preceding
       * whitespace / opening parenthesis.
       *
       * Keep it as normal text.
       */
      const prefixLength =
        fullMatch.length -
        (`#${tag}`).length;

      const prefix =
        fullMatch.slice(
          0,
          prefixLength
        );

      if (prefix) {
        parts.push({
          type: "text",
          content: prefix,
        });
      }

      parts.push({
        type: "tag",
        tag,
      });

      lastIndex =
        matchIndex + fullMatch.length;

      continue;
    }
  }


  /*
   * Remaining text
   */
  if (lastIndex < text.length) {
    parts.push({
      type: "text",
      content: text.slice(lastIndex),
    });
  }


  return parts;
}