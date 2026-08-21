import type {
  Root,
  RootContent,
  Heading,
} from "mdast";


export interface MarkdownSection {
  depth: number;
  heading: Heading;
  content: RootContent[];
  children: MarkdownSection[];
}


export function remarkSections() {

  return (tree: Root) => {

    const sections: MarkdownSection[] = [];

    let currentSection:
      MarkdownSection | null = null;


    for (const node of tree.children) {

      if (node.type === "heading") {

        const section: MarkdownSection = {
          depth: node.depth,
          heading: node,
          content: [],
          children: [],
        };


        /*
         * Suche den nächstgelegenen
         * übergeordneten Abschnitt.
         */
        let parent:
          MarkdownSection | null = null;


        for (
          let index = sections.length - 1;
          index >= 0;
          index--
        ) {

          const candidate =
            sections[index];


          if (
            candidate.depth <
            section.depth
          ) {

            parent = candidate;

            break;
          }

        }


        if (parent) {

          parent.children.push(
            section
          );

        } else {

          sections.push(
            section
          );

        }


        currentSection = section;

      } else if (currentSection) {

        currentSection.content.push(
          node
        );

      }

    }


    console.log(
      "MARKDOWN SECTION TREE:",
      sections,
    );

  };
}