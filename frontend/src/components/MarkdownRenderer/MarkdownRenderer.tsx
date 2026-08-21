import React, {
  type ReactNode,
} from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import remarkBreaks from "remark-breaks";

import { remarkObsidianCallouts } from "../../markdown/remarkObsidianCallouts";

import { WikiLink } from "../WikiLink/WikiLink";
import { Tag } from "../Tag/Tag";
import { VaultImage } from "../VaultImage/VaultImage";
import { TaskRow } from "../TaskRow/TaskRow";

import type { Task } from "../../types/task";

import {
  parseMarkdownSections,
  type MarkdownSection,
} from "../../markdown/parseMarkdownSections";

import "highlight.js/styles/github-dark.css";

import { parseObsidianInline } from "../../utils/parseObsidianInline";

import "./MarkdownRenderer.css";


interface MarkdownRendererProps {
  content: string;

  tasks: Task[];

  onWikiLinkClick: (
    target: string
  ) => void;

  onNoteClick: (
    path: string
  ) => void;

  onTagClick?: (
    tag: string
  ) => void;

  onNoteUpdated?: () => void;
}


export function MarkdownRenderer({
  content,
  tasks,
  onWikiLinkClick,
  onTagClick,
  onNoteClick,
  onNoteUpdated,
}: MarkdownRendererProps) {

  const sections =
    parseMarkdownSections(
      content
    );


  return (
    <div className="markdown-renderer">

      {sections.map(
        (section, index) => (
          <MarkdownSectionRenderer
            key={index}
            section={section}
            tasks={tasks}
            onWikiLinkClick={
              onWikiLinkClick
            }
            onTagClick={
              onTagClick
            }
            onNoteClick={
              onNoteClick
            }
            onNoteUpdated={
              onNoteUpdated
            }
          />
        )
      )}

    </div>
  );
}


interface MarkdownSectionRendererProps {
  section: MarkdownSection;

  tasks: Task[];

  onWikiLinkClick: (
    target: string
  ) => void;

  onNoteClick: (
    path: string
  ) => void;

  onTagClick?: (
    tag: string
  ) => void;

  onNoteUpdated?: () => void;
}


function MarkdownSectionRenderer({
  section,
  tasks,
  onWikiLinkClick,
  onTagClick,
  onNoteClick,
  onNoteUpdated,
}: MarkdownSectionRendererProps) {

  const [collapsed, setCollapsed] =
    React.useState(false);


  function toggleCollapsed() {
    setCollapsed(
      value => !value
    );
  }


  return (
    <section
      className={
        `markdown-section markdown-section-depth-${section.depth}` +
        (collapsed
          ? " markdown-section-collapsed"
          : "")
      }
    >

      <button
        type="button"
        className="markdown-section-heading"
        onClick={toggleCollapsed}
        aria-expanded={!collapsed}
      >

        <span
          className="markdown-section-toggle"
          aria-hidden="true"
        >
          {collapsed ? "▸" : "▾"}
        </span>

        <span className="markdown-section-heading-content">

          <ReactMarkdown
            remarkPlugins={[
              remarkGfm,
              remarkBreaks,
              remarkObsidianCallouts,
            ]}
            rehypePlugins={[
              rehypeHighlight,
            ]}
            components={{
              h1: ({ children }) => (
                <h1>
                  {renderChildren(
                    children,
                    onWikiLinkClick,
                    onTagClick ?? (() => {}),
                  )}
                </h1>
              ),

              h2: ({ children }) => (
                <h2>
                  {renderChildren(
                    children,
                    onWikiLinkClick,
                    onTagClick ?? (() => {}),
                  )}
                </h2>
              ),

              h3: ({ children }) => (
                <h3>
                  {renderChildren(
                    children,
                    onWikiLinkClick,
                    onTagClick ?? (() => {}),
                  )}
                </h3>
              ),

              h4: ({ children }) => (
                <h4>
                  {renderChildren(
                    children,
                    onWikiLinkClick,
                    onTagClick ?? (() => {}),
                  )}
                </h4>
              ),

              h5: ({ children }) => (
                <h5>
                  {renderChildren(
                    children,
                    onWikiLinkClick,
                    onTagClick ?? (() => {}),
                  )}
                </h5>
              ),

              h6: ({ children }) => (
                <h6>
                  {renderChildren(
                    children,
                    onWikiLinkClick,
                    onTagClick ?? (() => {}),
                  )}
                </h6>
              ),
            }}
          >
            {renderHeadingMarkdown(
              section.heading
            )}
          </ReactMarkdown>

        </span>

      </button>


      {!collapsed && (
        <>

          {section.content.length > 0 && (
            <MarkdownContent
              content={section.content}
              tasks={tasks}
              onWikiLinkClick={
                onWikiLinkClick
              }
              onTagClick={
                onTagClick
              }
              onNoteClick={
                onNoteClick
              }
              onNoteUpdated={
                onNoteUpdated
              }
            />
          )}


          {section.children.length > 0 && (
            <div className="markdown-section-children">

              {section.children.map(
                (child, index) => (
                  <MarkdownSectionRenderer
                    key={index}
                    section={child}
                    tasks={tasks}
                    onWikiLinkClick={
                      onWikiLinkClick
                    }
                    onTagClick={
                      onTagClick
                    }
                    onNoteClick={
                      onNoteClick
                    }
                    onNoteUpdated={
                      onNoteUpdated
                    }
                  />
                )
              )}

            </div>
          )}

        </>
      )}

    </section>
  );
}


interface MarkdownContentProps {
  content: MarkdownSection["content"];

  tasks: Task[];

  onWikiLinkClick: (
    target: string
  ) => void;

  onNoteClick: (
    path: string
  ) => void;

  onTagClick?: (
    tag: string
  ) => void;

  onNoteUpdated?: () => void;
}


function MarkdownContent({
  content,
  tasks,
  onWikiLinkClick,
  onTagClick,
  onNoteClick,
  onNoteUpdated,
}: MarkdownContentProps) {

  return (
    <ReactMarkdown
      remarkPlugins={[
        remarkGfm,
        remarkBreaks,
        remarkObsidianCallouts,
      ]}
      rehypePlugins={[
        rehypeHighlight,
      ]}
      components={{

        p: ({ children }) => (
          <p>
            {renderChildren(
              children,
              onWikiLinkClick,
              onTagClick ?? (() => {}),
            )}
          </p>
        ),


        a: ({
          href,
          children,
        }) => {

          const isExternal =
            href?.startsWith(
              "http://"
            ) ||
            href?.startsWith(
              "https://"
            );


          function handleClick(
            event: React.MouseEvent<HTMLAnchorElement>
          ) {

            if (
              !href ||
              isExternal
            ) {
              return;
            }

            event.preventDefault();

            onWikiLinkClick(
              href
            );
          }


          return (
            <a
              href={href}
              target={
                isExternal
                  ? "_blank"
                  : undefined
              }
              rel={
                isExternal
                  ? "noopener noreferrer"
                  : undefined
              }
              onClick={
                handleClick
              }
            >
              {children}
            </a>
          );
        },


        li: ({
          children,
        }) => {

          const task =
            findTaskForListItem(
              children,
              tasks,
            );


          if (task) {

            return (
              <li className="markdown-task-item">

                <TaskRow
                  task={task}
                  onUpdated={() => {
                    onNoteUpdated?.();
                  }}
                />

              </li>
            );
          }


          return (
            <li>
              {renderChildren(
                children,
                onWikiLinkClick,
                onTagClick ?? (() => {}),
              )}
            </li>
          );
        },


        input: ({
          type,
          checked,
          ...props
        }) => {

          if (
            type === "checkbox"
          ) {

            return (
              <input
                {...props}
                type="checkbox"
                checked={checked}
                readOnly
              />
            );
          }


          return (
            <input
              {...props}
              type={type}
            />
          );
        },

      }}
    >
      {contentToMarkdown(
        content
      )}
    </ReactMarkdown>
  );
}


function renderHeadingMarkdown(
  heading: MarkdownSection["heading"],
): string {

  const prefix =
    "#".repeat(
      heading.depth
    );

  const text =
    heading.children
      .map(
        child =>
          mdastInlineNodeToMarkdown(
            child
          )
      )
      .join("");

  return `${prefix} ${text}`;
}


function mdastInlineNodeToMarkdown(
  node: MarkdownSection["heading"]["children"][number],
): string {

  switch (node.type) {

    case "text":
      return node.value;


    case "inlineCode":
      return `\`${node.value}\``;


    case "strong":
      return `**${
        node.children
          .map(
            mdastInlineNodeToMarkdown
          )
          .join("")
      }**`;


    case "emphasis":
      return `*${
        node.children
          .map(
            mdastInlineNodeToMarkdown
          )
          .join("")
      }*`;


    case "delete":
      return `~~${
        node.children
          .map(
            mdastInlineNodeToMarkdown
          )
          .join("")
      }~~`;


    case "link":
      return `[${node.children
        .map(
          mdastInlineNodeToMarkdown
        )
        .join("")}](${node.url})`;


    case "image":
      return `![${node.alt ?? ""}](${node.url})`;


    case "break":
      return "\\\n";


    case "html":
      return node.value;


    default:
      return "";
  }
}


function contentToMarkdown(
  content: MarkdownSection["content"],
): string {

  return content
    .map(
      node =>
        nodeToMarkdown(
          node
        )
    )
    .join("\n\n");
}


function nodeToMarkdown(
  node: MarkdownSection["content"][number],
): string {

  switch (node.type) {

    case "paragraph":
      return node.children
        .map(
          mdastInlineNodeToMarkdown
        )
        .join("");


    case "heading":
      return renderHeadingMarkdown(
        node
      );


    case "code": {
      const language =
        node.lang ?? "";

      return [
        `\`\`\`${language}`,
        node.value,
        "```",
      ].join("\n");
    }


    case "thematicBreak":
      return "---";


    case "blockquote":
      return node.children
        .map(
          child =>
            nodeToMarkdown(child)
        )
        .map(
          line =>
            line
              .split("\n")
              .map(
                value =>
                  `> ${value}`
              )
              .join("\n")
        )
        .join("\n");


    case "list": {

      return node.children
        .map(
          (item, index) => {

            const prefix =
              node.ordered
                ? `${(node.start ?? 1) + index}. `
                : "- ";

            const content =
              item.children
                .map(
                  child =>
                    nodeToMarkdown(child)
                )
                .join("\n");

            const lines =
              content.split("\n");

            return [
              prefix + lines[0],
              ...lines
                .slice(1)
                .map(
                  line =>
                    `  ${line}`
                ),
            ].join("\n");
          }
        )
        .join("\n");
    }


    case "html":
      return node.value;


    default:
      return "";
  }
}


function findTaskForListItem(
  children: ReactNode,
  tasks: Task[],
): Task | null {

  const text =
    extractText(children)
      .replace(
        /^\s*/,
        "",
      )
      .trim();


  if (!text) {
    return null;
  }


  return (
    tasks.find(
      task =>
        task.text.trim() === text
    ) ?? null
  );
}


function extractText(
  children: ReactNode,
): string {

  let result = "";


  React.Children.forEach(
    children,
    child => {

      if (
        typeof child === "string" ||
        typeof child === "number"
      ) {

        result += String(child);

        return;
      }


      if (
        React.isValidElement<{
          children?: ReactNode;
        }>(child)
      ) {

        result += extractText(
          child.props.children
        );
      }

    }
  );


  return result;
}


function renderChildren(
  children: ReactNode,
  onWikiLinkClick: (
    target: string
  ) => void,
  onTagClick: (
    tag: string
  ) => void,
) {

  return React.Children.map(
    children,
    child => {

      if (
        typeof child !== "string"
      ) {
        return child;
      }


      const parts =
        parseObsidianInline(
          child
        );


      return parts.map(
        (
          part,
          index,
        ) => {

          if (
            part.type === "text"
          ) {

            return (
              <span
                key={index}
              >
                {part.content}
              </span>
            );
          }


          if (
            part.type === "image"
          ) {

            return (
              <VaultImage
                key={index}
                path={part.path}
              />
            );
          }


          if (
            part.type === "tag"
          ) {

            return (
              <Tag
                key={index}
                tag={part.tag}
                onClick={
                  onTagClick
                }
              />
            );
          }


          return (
            <WikiLink
              key={index}
              target={
                part.target
              }
              displayText={
                part.displayText
              }
              onClick={
                onWikiLinkClick
              }
            />
          );
        }
      );
    }
  );
}