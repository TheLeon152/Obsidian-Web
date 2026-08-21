import type { VaultNode } from "../../types/vault";
import { FileTreeNode } from "./FileTreeNode";

interface FileTreeProps {
  tree: VaultNode;
  onFileClick: (path: string) => void;
  onFolderClick: (path: string) => void;
}

export function FileTree({
  tree,
  onFileClick,
  onFolderClick,
}: FileTreeProps) {
  return (
    <div>
      {tree.children?.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          onFileClick={onFileClick}
          onFolderClick={onFolderClick}
        />
      ))}
    </div>
  );
}