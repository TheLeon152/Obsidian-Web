import {
  useEffect,
  useState,
} from "react";

import type { VaultNode } from "../../types/vault";


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
    <div>

      <div
        onClick={
          handleClick
        }
        style={{
          display: "flex",
          alignItems: "center",

          paddingLeft:
            `${level * 16}px`,

          paddingTop:
            "5px",

          paddingBottom:
            "5px",

          paddingRight:
            "4px",

          cursor:
            isFolder
              ? "pointer"
              : "default",

          userSelect:
            "none",

          borderRadius:
            "5px",

          background:
            isActive
              ? "#e8e8e8"
              : "transparent",

          fontWeight:
            isActive
              ? 600
              : 400,
        }}
      >

        {isFolder && (

          <span
            style={{
              width: "18px",
              display: "inline-block",
            }}
          >
            {isExpanded
              ? "▼"
              : "▶"}
          </span>

        )}


        {!isFolder && (

          <span
            style={{
              width: "18px",
              marginLeft: "0",
            }}
          >
            📄
          </span>

        )}


        <span
          style={{
            marginLeft: "6px",
            overflow: "hidden",
            textOverflow:
              "ellipsis",
            whiteSpace:
              "nowrap",
          }}
        >
          {node.name}
        </span>


        {isFolder && (

          <button
            type="button"
            onClick={
              handleFolderOpen
            }
            style={{
              marginLeft:
                "auto",

              border:
                "none",

              background:
                "transparent",

              cursor:
                "pointer",

              fontSize:
                "12px",

              opacity:
                isActive
                  ? 1
                  : 0.6,
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
                  key={
                    child.path
                  }

                  node={
                    child
                  }

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