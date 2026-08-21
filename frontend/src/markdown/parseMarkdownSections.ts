import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkStringify from "remark-stringify";

import type {
  Root,
  RootContent,
  Heading,
} from "mdast";

import { remarkObsidianCallouts } from "./remarkObsidianCallouts";


export interface MarkdownSection {
  depth: number;
  heading: Heading;
  content: RootContent[];
  children: MarkdownSection[];
}


export function parseMarkdownSections(
  content: string,
): MarkdownSection[] {

  const processor =
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkBreaks)
      .use(remarkObsidianCallouts);


  const tree =
    processor.parse(content) as Root;


  return buildSectionTree(tree);
}


function buildSectionTree(
  tree: Root,
): MarkdownSection[] {

  const sections: MarkdownSection[] = [];

  /*
   * Enthält den jeweils zuletzt geöffneten Abschnitt
   * auf jeder Heading-Ebene.
   *
   * Beispiel:
   *
   * depth 1 → # Heading
   * depth 2 → ## Subheading
   * depth 3 → ### Subheading
   */
  const stack: MarkdownSection[] = [];


  for (const node of tree.children) {

    if (node.type !== "heading") {

      /*
       * Inhalt vor der ersten Überschrift.
       *
       * Dieser Teil gehört keinem Section-Objekt.
       * Das behandeln wir später im MarkdownRenderer.
       */
      if (stack.length > 0) {

        stack[
          stack.length - 1
        ].content.push(node);

      }

      continue;
    }


    const section: MarkdownSection = {
      depth: node.depth,
      heading: node,
      content: [],
      children: [],
    };


    /*
     * Alle Sections auf derselben oder einer
     * tieferen Ebene werden geschlossen.
     */
    while (
      stack.length > 0 &&
      stack[stack.length - 1].depth >= node.depth
    ) {

      stack.pop();

    }


    if (stack.length === 0) {

      /*
       * Keine übergeordnete Section:
       * → Root-Level-Section
       */
      sections.push(section);

    } else {

      /*
       * Die zuletzt geöffnete Section ist
       * der direkte Parent.
       */
      stack[
        stack.length - 1
      ].children.push(section);

    }


    stack.push(section);
  }


  return sections;
}


export function stringifyMarkdown(
  nodes: RootContent[],
): string {

  const tree: Root = {
    type: "root",
    children: nodes,
  };

  const processor =
    unified()
      .use(remarkStringify);

  return String(
    processor.stringify(tree)
  );
}