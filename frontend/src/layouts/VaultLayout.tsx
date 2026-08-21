import logo from "../assets/branding/obsidian-web-logo.png";

import type {
  ReactNode,
} from "react";

import {
  FileTree,
} from "../components/FileTree/FileTree";

import type {
  VaultNode,
} from "../types/vault";

import {
  SearchBar,
} from "../components/SearchBar/SearchBar";

import {
  Navigation,
} from "../components/Navigation/Navigation";

import "./VaultLayout.css";


interface VaultLayoutProps {
  tree: VaultNode;

  onFileClick: (
    path: string
  ) => void;

  onRefresh: () => void;

  refreshing: boolean;

  children: ReactNode;

  onSearchNoteClick: (
    path: string
  ) => void;

  onFolderClick: (
    path: string
  ) => void;
}


export function VaultLayout({
  tree,
  onFileClick,
  onRefresh,
  refreshing,
  children,
  onSearchNoteClick,
  onFolderClick,
}: VaultLayoutProps) {

  return (
    <div className="vault-layout">

      {/* =====================================================
          Sidebar
          ===================================================== */}

      <aside className="vault-sidebar">

        {/* ===================================================
            Logo / Header
            =================================================== */}

        <div className="vault-sidebar-header">

          <div className="vault-brand">

            <img
              src={logo}
              alt="Obsidian Web"
              className="vault-brand-logo"
            />

            <span className="vault-brand-title">
              Obsidian Web
            </span>

          </div>

        </div>


        {/* ===================================================
            Suche
            =================================================== */}

        <SearchBar
          onNoteClick={
            onSearchNoteClick
          }
        />


        {/* ===================================================
            Hauptnavigation
            =================================================== */}

        <Navigation />


        {/* ===================================================
            Vault
            =================================================== */}

        <div className="vault-section">

          <div className="vault-section-header">

            <span>
              Vault
            </span>

          </div>


          <div className="vault-tree">

            <FileTree
              tree={tree}
              onFileClick={
                onFileClick
              }
              onFolderClick={
                onFolderClick
              }
            />

          </div>

        </div>


        {/* ===================================================
            Sidebar Footer
            =================================================== */}

        <div className="vault-sidebar-footer">

          <button
            type="button"
            className="vault-refresh-button"
            onClick={onRefresh}
            disabled={refreshing}
          >

            <span className="vault-refresh-icon">
              {refreshing
                ? "⟳"
                : "↻"}
            </span>

            <span>
              {refreshing
                ? "Vault wird aktualisiert..."
                : "Vault aktualisieren"}
            </span>

          </button>

        </div>

      </aside>


      {/* =====================================================
          Main
          ===================================================== */}

      <main className="vault-main">

        {children}

      </main>

    </div>
  );
}