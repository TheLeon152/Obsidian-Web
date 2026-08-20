import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import { remarkObsidianCallouts } from "../../markdown/remarkObsidianCallouts";

import { WikiLink } from "../WikiLink/WikiLink";
import { Tag } from "../Tag/Tag";

import "highlight.js/styles/github-dark.css";
import React, { type ReactNode } from "react";
import { parseObsidianInline } from "../../utils/parseObsidianInline";
import { VaultImage } from "../VaultImage/VaultImage";
import remarkBreaks from "remark-breaks";

interface MarkdownRendererProps {
  content: string;

  onWikiLinkClick: (
    target: string
  ) => void;

  onNoteClick: (
    path: string
  ) => void;

  onTagClick?: (
    tag: string
  ) => void;
}


export function MarkdownRenderer({
  content,
  onWikiLinkClick,
  onTagClick,
  onNoteClick,
}: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[
        remarkGfm,
        remarkBreaks,
        remarkObsidianCallouts
      ]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        p: ({ children }) => {
          console.log(
            "P CHILDREN:",
            children
          );

          return (
            <p>
              {renderChildren(
                children,
                onWikiLinkClick,
                onTagClick!,
              )}
            </p>
          );
        },

        a: ({ href, children }) => {
          const isExternal =
            href?.startsWith("http://") ||
            href?.startsWith("https://");

          function handleClick(
            event: React.MouseEvent<HTMLAnchorElement>
          ) {
            console.log(
              "MARKDOWN LINK CLICK:",
              href
            );

            if (!href || isExternal) {
              return;
            }

            event.preventDefault();

            onWikiLinkClick(href);
          }

          return (
            <a
              href={href}
              target={
                isExternal ? "_blank" : undefined
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

        // Rest unverändert
      }}
    >
      {content}
    </ReactMarkdown>
  );
}


function getCalloutIcon(type: string): string {
  const icons: Record<string, string> = {
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

  return icons[type] ?? "ℹ";
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
    (child) => {
      if (typeof child !== "string") {
        return child;
      }

      const parts =
        parseObsidianInline(child);

      return parts.map(
        (part, index) => {
          if (part.type === "text") {
            return (
              <span key={index}>
                {part.content}
              </span>
            );
          }

          if (part.type === "image") {
            return (
              <VaultImage
                key={index}
                path={part.path}
              />
            );
          }

          if (part.type === "tag") {
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
              displayText={part.displayText}
              onClick={onWikiLinkClick}
            />
          );
        }
      );
    }
  );
}