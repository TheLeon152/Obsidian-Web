import type { VaultNode } from "../../types/vault";
import { FileTreeNode } from "./FileTreeNode";

import "./FileTree.css";


interface FileTreeProps {
  tree: VaultNode;

  onFileClick: (
    path: string
  ) => void;

  onFolderClick: (
    path: string
  ) => void;

  activePath?: string;
}


export function FileTree({
  tree,
  onFileClick,
  onFolderClick,
  activePath,
}: FileTreeProps) {

  return (
    <div className="file-tree">

      {tree.children?.map(
        (node) => (

          <FileTreeNode
            key={node.path}
            node={node}
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
  );
}