import { visit } from "unist-util-visit";

export function remarkObsidianCallouts() {
  return (tree: any) => {
    visit(tree, "blockquote", (node: any) => {
      const firstParagraph = node.children?.[0];

      if (
        !firstParagraph ||
        firstParagraph.type !== "paragraph"
      ) {
        return;
      }

      const firstText = firstParagraph.children?.[0];

      if (
        !firstText ||
        firstText.type !== "text"
      ) {
        return;
      }

      const match = firstText.value.match(
        /^\[!(\w+)\](?:\s+(.+))?$/
      );

      if (!match) {
        return;
      }

      const type = match[1].toLowerCase();
      const title = match[2] ?? type;

      node.data = {
        hProperties: {
          className: [
            "obsidian-callout",
            `obsidian-callout-${type}`,
          ],
          "data-callout": type,
          "data-callout-title": title,
        },
      };

      // Nur den Callout-Marker entfernen.
      firstText.value = firstText.value.replace(
        /^\[!(\w+)\]\s*/,
        ""
      );
    });
  };
}