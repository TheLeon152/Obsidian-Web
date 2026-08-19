const TAG_REGEX =
  /(^|[\s(])#([A-Za-z0-9_/-]+)/g;


export interface TagMatch {
  tag: string;
  start: number;
  end: number;
}


export function findObsidianTags(
  text: string
): TagMatch[] {
  const matches: TagMatch[] = [];

  for (const match of text.matchAll(TAG_REGEX)) {
    if (match.index === undefined) {
      continue;
    }

    const fullMatch = match[0];

    const tagStart =
      match.index + fullMatch.indexOf("#");

    matches.push({
      tag: match[2],
      start: tagStart,
      end: tagStart + match[2].length + 1,
    });
  }

  return matches;
}