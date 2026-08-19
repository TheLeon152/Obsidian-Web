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

interface MarkdownRendererProps {
  content: string;

  onWikiLinkClick: (
    target: string
  ) => void;

  onTagClick?: (
    tag: string
  ) => void;
}


export function MarkdownRenderer({
  content,
  onWikiLinkClick,
  onTagClick,
}: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[
        remarkGfm,
        remarkObsidianCallouts
      ]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        p: ({ children }) => (
          <p>
            {renderChildren(
              children,
              onWikiLinkClick,
              onTagClick
            )}
          </p>
        ),

        li: ({ children }) => (
          <li>
            {renderChildren(
              children,
              onWikiLinkClick,
              onTagClick
            )}
          </li>
        ),

        a: ({ href, children, ...props }) => {
          const isExternal =
            href?.startsWith("http://") ||
            href?.startsWith("https://");

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
              {...props}
            >
              {children}
            </a>
          );
        },
        blockquote: ({ children, node }) => {
          const properties =
            (node as any)?.properties;

          const calloutType =
            properties?.["data-callout"];

          const calloutTitle =
            properties?.["data-callout-title"];

          if (calloutType) {
            return (
              <aside
                className={`obsidian-callout obsidian-callout-${calloutType}`}
              >
                <div className="obsidian-callout-title">
                  <span className="obsidian-callout-icon">
                    {getCalloutIcon(calloutType)}
                  </span>

                  <span>
                    {calloutTitle}
                  </span>
                </div>

                <div className="obsidian-callout-content">
                  {children}
                </div>
              </aside>
            );
          }

          return (
            <blockquote>
              {children}
            </blockquote>
          );
        },
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
  onTagClick?: (
    tag: string
  ) => void
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