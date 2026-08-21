import {
  useState,
  type ReactNode,
} from "react";

import type {
  MarkdownSection as MarkdownSectionData,
} from "../../markdown/parseMarkdownSections";

import {
  stringifyMarkdown,
} from "../../markdown/parseMarkdownSections";

import "./MarkdownSection.css";


interface MarkdownSectionProps {
  section: MarkdownSectionData;

  renderContent: (
    content: string
  ) => ReactNode;

  renderChildren: (
    children: MarkdownSectionData[]
  ) => ReactNode;
}


export function MarkdownSection({
  section,
  renderContent,
  renderChildren,
}: MarkdownSectionProps) {

  const [collapsed, setCollapsed] =
    useState(false);


  function toggle() {

    setCollapsed(
      value => !value
    );

  }


  return (
    <section
      className={
        `markdown-section ${
          collapsed
            ? "markdown-section-collapsed"
            : ""
        }`
      }
    >

      <div
        className="markdown-section-heading"
        role="button"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(event) => {

          if (
            event.key === "Enter" ||
            event.key === " "
          ) {

            event.preventDefault();

            toggle();

          }

        }}
      >

        <span
          className="markdown-section-toggle"
          aria-hidden="true"
        >
          {collapsed
            ? "▶"
            : "▼"}
        </span>


        <span>
          {extractHeadingText(section)}
        </span>

      </div>


      {!collapsed && (

        <div className="markdown-section-content">

          {section.content.length > 0 && (
            renderContent(
              stringifyMarkdown(
                section.content
              )
            )
          )}


          {section.children.length > 0 && (
            renderChildren(
              section.children
            )
          )}

        </div>

      )}

    </section>
  );
}


function extractHeadingText(
  section: MarkdownSectionData,
): string {

  return section.heading.children
    .map(child => {

      if (
        child.type === "text"
      ) {
        return child.value;
      }

      if (
        child.type === "inlineCode"
      ) {
        return child.value;
      }

      return "";

    })
    .join("");
}