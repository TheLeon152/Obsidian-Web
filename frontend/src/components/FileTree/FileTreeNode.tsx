import {
  useEffect,
  useState,
} from "react";

import type { VaultNode } from "../../types/vault";

import "./FileTree.css";


interface FileTreeNodeProps {
  node: VaultNode;

  level?: number;

  onFileClick?: (
    path: string
  ) => void;

  onFolderClick?: (
    path: string
  ) => void;

  activePath?: string;
}


export function FileTreeNode({
  node,
  level = 0,
  onFileClick,
  onFolderClick,
  activePath,
}: FileTreeNodeProps) {

  const isFolder =
    node.type === "folder";


  const isActive =
    isFolder &&
    activePath === node.path;


  const isParentOfActive =
    isFolder &&
    activePath !== undefined &&
    activePath.startsWith(
      `${node.path}/`
    );


  const [
    isExpanded,
    setIsExpanded,
  ] = useState(
    isParentOfActive
  );


  useEffect(() => {

    if (isParentOfActive) {

      setIsExpanded(true);

    }

  }, [isParentOfActive]);


  function handleClick() {

    if (isFolder) {

      setIsExpanded(
        (current) => !current
      );

      return;
    }


    onFileClick?.(
      node.path
    );
  }


  function handleFolderOpen(
    event: React.MouseEvent
  ) {

    event.stopPropagation();


    if (isFolder) {

      onFolderClick?.(
        node.path
      );

    }

  }


  return (
    <div className="file-tree-node">

      <div
        className={
          `file-tree-node-row${
            isActive
              ? " active"
              : ""
          }`
        }
        onClick={handleClick}
        style={{
          paddingLeft:
            `${level * 16}px`,
        }}
      >

        {isFolder && (
          <span className="file-tree-expand-icon">
            {isExpanded
              ? "▼"
              : "▶"}
          </span>
        )}


        {!isFolder && (
          <span className="file-tree-icon">
            📄
          </span>
        )}


        <span className="file-tree-name">
          {node.name}
        </span>


        {isFolder && (
          <button
            type="button"
            className="file-tree-open-button"
            onClick={handleFolderOpen}
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
                  level={
                    level + 1
                  }
                  onFileClick={
                    onFileClick
                  }
                  onFolderClick={
                    onFolderClick
                  }
                  activePath={
                    activePath
                  }
                />
              )
            )}

          </div>

        )}

    </div>
  );
}