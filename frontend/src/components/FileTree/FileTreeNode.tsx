import {
  useState,
  type MouseEvent,
} from "react";

import type { VaultNode } from "../../types/vault";

interface FileTreeNodeProps {
  node: VaultNode;
  level?: number;
  onFileClick?: (path: string) => void;
  onFolderClick?: (path: string) => void;
}

export function FileTreeNode({
  node,
  level = 0,
  onFileClick,
  onFolderClick,
}: FileTreeNodeProps) {
  const isFolder = node.type === "folder";

  const [isExpanded, setIsExpanded] =
    useState(false);

  function handleClick() {
    if (isFolder) {
      setIsExpanded(
        (current) => !current
      );

      return;
    }

    onFileClick?.(node.path);
  }

  function handleFolderOpen(
    event: MouseEvent
  ) {
    event.stopPropagation();

    if (isFolder) {
      onFolderClick?.(node.path);
    }
  }

  return (
    <div>
      <div
        onClick={handleClick}
        style={{
          paddingLeft: `${level * 16}px`,
          paddingTop: "4px",
          paddingBottom: "4px",
          cursor: isFolder
            ? "pointer"
            : "default",
          userSelect: "none",
        }}
      >
        {isFolder && (
          <span>
            {isExpanded ? "▼" : "▶"}
          </span>
        )}

        {!isFolder && (
          <span
            style={{
              marginLeft: "16px",
            }}
          >
            📄
          </span>
        )}

        <span
          style={{
            marginLeft: "6px",
          }}
        >
          {node.name}
        </span>

        {isFolder && (
          <button
            type="button"
            onClick={handleFolderOpen}
            style={{
              marginLeft: "8px",
            }}
          >
            Öffnen
          </button>
        )}
      </div>

      {isFolder &&
        isExpanded &&
        node.children && (
          <div>
            {node.children.map(
              (child) => (
                <FileTreeNode
                  key={child.path}
                  node={child}
                  level={level + 1}
                  onFileClick={
                    onFileClick
                  }
                  onFolderClick={
                    onFolderClick
                  }
                />
              )
            )}
          </div>
        )}
    </div>
  );
}