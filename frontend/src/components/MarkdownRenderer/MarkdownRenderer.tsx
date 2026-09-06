import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import remarkBreaks from "remark-breaks";

import { WikiLink } from "../WikiLink/WikiLink";
import { Tag } from "../Tag/Tag";
import { VaultImage } from "../VaultImage/VaultImage";
import { TaskRow } from "../TaskRow/TaskRow";

import type { Task } from "../../types/task";
import { parseObsidianInline } from "../../utils/parseObsidianInline";

import "./MarkdownRenderer.css";
import { parseMarkdownSections, stringifyMarkdown, type MarkdownSection } from "../../markdown/parseMarkdownSections";
import { remarkObsidianCallouts } from "../../markdown/remarkObsidianCallouts";

interface MarkdownRendererProps {
  content: string;
  tasks?: Task[];
  onWikiLinkClick: (target: string) => void;
  onNoteClick: (path: string) => void;
  onTagClick?: (tag: string) => void;
  onNoteUpdated?: () => void;
}

interface MarkdownSectionRendererProps {
  section: MarkdownSection;
  tasks?: Task[];
  onWikiLinkClick: (target: string) => void;
  onTagClick?: (tag: string) => void;
  onNoteClick: (path: string) => void;
  onNoteUpdated?: () => void;

  /**
   * Hides the heading itself while still rendering
   * the section content and its children.
   *
   * Used for the first H1 because the note title
   * is already rendered by NoteViewer.
   */
  hideHeading?: boolean;
}

interface MarkdownContentProps {
  content: string;
  tasks?: Task[];
  onWikiLinkClick: (target: string) => void;
  onTagClick?: (tag: string) => void;
  onNoteClick: (path: string) => void;
  onNoteUpdated?: () => void;
}

export function MarkdownRenderer({
  content,
  tasks,
  onWikiLinkClick,
  onNoteClick,
  onTagClick,
  onNoteUpdated,
}: MarkdownRendererProps) {
  const sections = parseMarkdownSections(content);

  return (
    <div className="markdown-renderer">
      {sections.map((section, index) => (
        <MarkdownSectionRenderer
          key={index}
          section={section}
          tasks={tasks}
          onWikiLinkClick={onWikiLinkClick}
          onTagClick={onTagClick}
          onNoteClick={onNoteClick}
          onNoteUpdated={onNoteUpdated}
          /*
           * The note title is already rendered by NoteViewer.
           * Therefore only hide the first root-level H1.
           *
           * We deliberately do not hide every H1, because a
           * document could theoretically contain multiple H1s.
           */
          hideHeading={index === 0 && section.depth === 1}
        />
      ))}
    </div>
  );
}

function MarkdownSectionRenderer({
  section,
  tasks,
  onWikiLinkClick,
  onTagClick,
  onNoteClick,
  onNoteUpdated,
  hideHeading = false,
}: MarkdownSectionRendererProps) {
  const [collapsed, setCollapsed] = useState(false);

  /**
   * The hidden title must never collapse its content.
   * Otherwise hiding the heading would also hide the entire
   * first section.
   */
  const isCollapsed = hideHeading ? false : collapsed;

  function toggleCollapsed() {
    setCollapsed((value) => !value);
  }

  return (
    <section
      className={`markdown-section markdown-section-depth-${section.depth}`}
    >
      {!hideHeading && (
        <button
          type="button"
          className="markdown-section-heading"
          onClick={toggleCollapsed}
          aria-expanded={!isCollapsed}
        >
          <span
            className="markdown-section-toggle"
            aria-hidden="true"
          >
            {isCollapsed ? "▸" : "▾"}
          </span>

          <span className="markdown-section-heading-content">
            <ReactMarkdown
              remarkPlugins={[
                remarkGfm,
                remarkBreaks,
                remarkObsidianCallouts,
              ]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                p: ({ children }) => <>{children}</>,
              }}
            >
              {renderHeadingMarkdown(section.heading)}
            </ReactMarkdown>
          </span>
        </button>
      )}

      {!isCollapsed && (
        <>
          {section.content.length > 0 && (
            <MarkdownContent
              content={stringifyMarkdown(section.content)}
              tasks={tasks}
              onWikiLinkClick={onWikiLinkClick}
              onTagClick={onTagClick}
              onNoteClick={onNoteClick}
              onNoteUpdated={onNoteUpdated}
            />
          )}

          {section.children.length > 0 && (
            <div className="markdown-section-children">
              {section.children.map((child, index) => (
                <MarkdownSectionRenderer
                  key={index}
                  section={child}
                  tasks={tasks}
                  onWikiLinkClick={onWikiLinkClick}
                  onTagClick={onTagClick}
                  onNoteClick={onNoteClick}
                  onNoteUpdated={onNoteUpdated}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
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
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          remarkBreaks,
          remarkObsidianCallouts,
        ]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          p: ({ children }) => (
            <p>
              {renderChildren(
                children,
                onWikiLinkClick,
                onTagClick,
                onNoteClick
              )}
            </p>
          ),

          a: ({ href, children, ...props }) => {
            if (!href) {
              return <a {...props}>{children}</a>;
            }

            return (
              <a
                {...props}
                href={href}
                onClick={(event) => {
                  event.preventDefault();

                  if (href.startsWith("http://") || href.startsWith("https://")) {
                    window.open(href, "_blank", "noopener,noreferrer");
                    return;
                  }

                  onNoteClick(href);
                }}
              >
                {children}
              </a>
            );
          },

          li: ({ children, ...props }) => {
            const task = findTaskForListItem(children, tasks);

            if (task) {
              return (
                <li {...props}>
                  <TaskRow
                    task={task}
                    onUpdated={onNoteUpdated}
                  />
                </li>
              );
            }

            return (
              <li {...props}>
                {renderChildren(
                  children,
                  onWikiLinkClick,
                  onTagClick,
                  onNoteClick
                )}
              </li>
            );
          },

          input: ({ type, checked, ...props }) => {
            if (type !== "checkbox") {
              return <input type={type} {...props} />;
            }

            return (
              <input
                type="checkbox"
                checked={checked}
                readOnly
                {...props}
              />
            );
          },

          img: ({ src, alt }) => {
            if (!src) {
              return null;
            }

            return (
              <VaultImage
                path={src}
                alt={alt ?? ""}
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/**
 * Converts an mdast heading back into markdown so that
 * ReactMarkdown can render inline formatting, WikiLinks,
 * tags, etc.
 */
function renderHeadingMarkdown(heading: MarkdownSection["heading"]): string {
  return nodeToMarkdown(heading);
}

function nodeToMarkdown(node: any): string {
  if (!node) {
    return "";
  }

  switch (node.type) {
    case "heading":
      return `${"#".repeat(node.depth)} ${renderChildrenToMarkdown(
        node.children
      )}`;

    case "text":
      return node.value ?? "";

    case "strong":
      return `**${renderChildrenToMarkdown(node.children)}**`;

    case "emphasis":
      return `*${renderChildrenToMarkdown(node.children)}*`;

    case "delete":
      return `~~${renderChildrenToMarkdown(node.children)}~~`;

    case "inlineCode":
      return `\`${node.value ?? ""}\``;

    case "link":
      return `[${renderChildrenToMarkdown(node.children)}](${node.url})`;

    case "image":
      return `![${node.alt ?? ""}](${node.url})`;

    case "break":
      return "\n";

    case "html":
      return node.value ?? "";

    default:
      return renderChildrenToMarkdown(node.children ?? []);
  }
}

function renderChildrenToMarkdown(children: any[] = []): string {
  return children.map((child) => nodeToMarkdown(child)).join("");
}

/**
 * Handles Obsidian-specific inline syntax inside
 * ReactMarkdown-generated children.
 */
function renderChildren(
  children: React.ReactNode,
  onWikiLinkClick: (target: string) => void,
  onTagClick: ((tag: string) => void) | undefined,
  onNoteClick: (path: string) => void
): React.ReactNode {
  if (children === null || children === undefined) {
    return children;
  }

  if (typeof children === "string") {
    const parts = parseObsidianInline(children);

    return parts.map((part, index) => {
      switch (part.type) {
        case "text":
          return (
            <React.Fragment key={index}>
              {part.content}
            </React.Fragment>
          );

        case "wikilink":
          return (
            <WikiLink
              key={index}
              target={part.target}
              displayText={part.displayText}
              onClick={onWikiLinkClick}
            />
          );

        case "image":
          return (
            <VaultImage
              path={part.path}
              alt={part.path}
            />
          );

        case "tag":
          if (!onTagClick) {
            return (
              <React.Fragment key={index}>
                #{part.tag}
              </React.Fragment>
            );
          }

          return (
            <Tag
              key={index}
              tag={part.tag}
              onClick={onTagClick}
            />
          );

        default:
          return null;
      }
    });
  }

  if (Array.isArray(children)) {
    return children.map((child, index) => (
      <React.Fragment key={index}>
        {renderChildren(
          child,
          onWikiLinkClick,
          onTagClick,
          onNoteClick
        )}
      </React.Fragment>
    ));
  }

  /*
   * React elements are already rendered components.
   * Do not recursively inspect their props here.
   */
  if (React.isValidElement(children)) {
    return children;
  }

  return children;
}

/**
 * Finds the task belonging to a markdown list item.
 */
function findTaskForListItem(
  children: React.ReactNode,
  tasks: Task[] | undefined
): Task | undefined {
  if (!tasks || tasks.length === 0) {
    return undefined;
  }

  const text = extractText(children).trim();

  if (!text) {
    return undefined;
  }

  return tasks.find((task) => {
    const taskText = task.text?.trim();

    if (!taskText) {
      return false;
    }

    return (
      text === taskText ||
      text.includes(taskText) ||
      taskText.includes(text)
    );
  });
}

/**
 * Extracts plain text recursively from React children.
 */
function extractText(children: React.ReactNode): string {
  if (children === null || children === undefined) {
    return "";
  }

  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(extractText).join("");
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(children)) {
    return extractText(children.props.children);
  }

  return "";
}