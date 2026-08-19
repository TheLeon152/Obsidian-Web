import type { VaultNode } from "../../types/vault";
import { FileTreeNode } from "./FileTreeNode";

interface FileTreeProps {
  tree: VaultNode;
  onFileClick: (path: string) => void;
}

export function FileTree({
  tree,
  onFileClick,
}: FileTreeProps) {
  return (
    <div>
      {tree.children?.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          onFileClick={onFileClick}
        />
      ))}
    </div>
  );
}