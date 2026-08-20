import type { ReactNode } from "react";

import { FileTree } from "../components/FileTree/FileTree";
import type { VaultNode } from "../types/vault";

import { SearchBar } from "../components/SearchBar/SearchBar";


interface VaultLayoutProps {
  tree: VaultNode;
  onFileClick: (path: string) => void;
  onRefresh: () => void;
  refreshing: boolean;
  children: ReactNode;
  onSearchNoteClick: (path: string) => void;
}


export function VaultLayout({
  tree,
  onFileClick,
  onRefresh,
  refreshing,
  children,
  onSearchNoteClick,
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

        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
        >
          {refreshing
            ? "↻ Refreshing..."
            : "↻ Refresh"}
        </button>

        <SearchBar
          onNoteClick={onSearchNoteClick}
        />

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