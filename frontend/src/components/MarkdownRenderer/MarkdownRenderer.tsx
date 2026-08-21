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

import "highlight.js/styles/github-dark.css";

import { parseObsidianInline } from "../../utils/parseObsidianInline";


/* interface MarkdownRendererProps {
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
} */

  interface MarkdownRendererProps {
  content: string;

  notePath: string;

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
  notePath,
  tasks,
  onWikiLinkClick,
  onTagClick,
  onNoteClick,
  onNoteUpdated,
}: MarkdownRendererProps) {

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

        p: ({ children }) => {

          return (
            <p>
              {renderChildren(
                children,
                onWikiLinkClick,
                onTagClick ?? (() => {}),
              )}
            </p>
          );
        },


        a: ({
          href,
          children,
        }) => {

          const isExternal =
            href?.startsWith("http://") ||
            href?.startsWith("https://");


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

            onWikiLinkClick(href);
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
              onClick={handleClick}
            >
              {children}
            </a>
          );
        },


        /* li: ({
          children,
        }) => {

          const task =
            findTaskForListItem(
              children,
              tasks,
            );

          console.log(
            "MARKDOWN LI:",
            children,
            "TASK:",
            task,
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
        }, */

        li: ({
          children,
          node,
        }) => {

          const line =
            node!.position?.start.line;


          const task =
            line !== undefined
              ? tasks.find(
                  task =>
                    task.path === notePath &&
                    task.line === line
                )
              : undefined;


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
      {content}
    </ReactMarkdown>
  );
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
    (child) => {

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


function getCalloutIcon(
  type: string,
): string {

  const icons: Record<
    string,
    string
  > = {
    note: "ℹ",
    info: "ℹ",
    tip: "💡",
    success: "✓",
    warning: "⚠",
    danger: "⚠",
    error: "✕",
    question: "?",
    example: "▣",
  };


  return (
    icons[type] ?? "ℹ"
  );
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
                onClick={onTagClick}
              />
            );
          }


          return (
            <WikiLink
              key={index}
              target={part.target}
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