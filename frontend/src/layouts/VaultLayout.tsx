import type { ReactNode } from "react";

import { FileTree } from "../components/FileTree/FileTree";
import type { VaultNode } from "../types/vault";


interface VaultLayoutProps {
  tree: VaultNode;
  onFileClick: (path: string) => void;
  children: ReactNode;
}


export function VaultLayout({
  tree,
  onFileClick,
  children,
}: VaultLayoutProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        height: "100vh",
      }}
    >
      <aside
        style={{
          borderRight: "1px solid #ddd",
          padding: "16px",
          overflowY: "auto",
        }}
      >
        <h2>Vault</h2>

        <FileTree
          tree={tree}
          onFileClick={onFileClick}
        />
      </aside>

      <main
        style={{
          padding: "32px",
          overflowY: "auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}