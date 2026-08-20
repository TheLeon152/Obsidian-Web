import { useEffect, useState } from "react";

import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getVaultTree,
  refreshVault,
} from "./api/vault";

import { VaultLayout } from "./layouts/VaultLayout";

import type { VaultNode } from "./types/vault";
import { resolveNote } from "./api/notes";
import { NotePage } from "./pages/NotePage/NotePage";
import { TagPage } from "./pages/TagPage/TagPage";


function App() {
  const [vaultTree, setVaultTree] =
    useState<VaultNode | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [refreshing, setRefreshing] =
    useState(false);

  const [refreshKey, setRefreshKey] =
    useState(0);


  useEffect(() => {
    async function loadVault() {
      try {
        const tree =
          await getVaultTree();

        setVaultTree(tree);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unknown error"
        );
      } finally {
        setLoading(false);
      }
    }

    loadVault();
  }, []);


  async function handleRefresh() {
    setRefreshing(true);
        setRefreshKey(
      (current) => current + 1
    );

    try {
      await refreshVault();

      const tree =
        await getVaultTree();

      setVaultTree(tree);

      setError(null);
    } catch (error) {
      console.error(
        "Could not refresh vault:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Could not refresh vault."
      );
    } finally {
      setRefreshing(false);
    }
  }


  if (loading) {
    return <div>Loading vault...</div>;
  }


  if (error && !vaultTree) {
    return <div>Error: {error}</div>;
  }


  if (!vaultTree) {
    return (
      <div>
        Vault could not be loaded.
      </div>
    );
  }


  return (
    <AppRoutes
      vaultTree={vaultTree}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      refreshKey={refreshKey}
    />
  );
}


interface AppRoutesProps {
  vaultTree: VaultNode;
  onRefresh: () => void;
  refreshing: boolean;
  refreshKey: number;
}


function AppRoutes({
  vaultTree,
  onRefresh,
  refreshing,
  refreshKey,
}: AppRoutesProps) {
  const navigate = useNavigate();


  function handleTagClick(
    tag: string
  ) {
    navigate(
      `/tag/${tag}`
    );
  }


  function handleFileClick(
    path: string
  ) {
    navigate(
      `/note/${encodeURI(path)}`
    );
  }


  async function handleNoteClick(
    path: string
  ) {
    try {
      const normalizedPath =
        path
          .replace(/\\/g, "/")
          .trim();

      // Direkter Pfad mit Dateiendung
      if (
        normalizedPath.endsWith(".md")
      ) {
        navigate(
          `/note/${encodeURI(
            normalizedPath
          )}`
        );

        return;
      }

      // Pfad mit Slash:
      // Test1/React -> Test1/React.md
      if (
        normalizedPath.includes("/")
      ) {
        navigate(
          `/note/${encodeURI(
            normalizedPath + ".md"
          )}`
        );

        return;
      }

      // Einfacher Notizname:
      // React -> tatsächliche Datei auflösen
      const reference =
        await resolveNote(
          normalizedPath
        );

      navigate(
        `/note/${encodeURI(
          reference.path
        )}`
      );

    } catch (error) {
      console.error(
        `Could not open note: ${path}`,
        error
      );
    }
  }


  async function handleWikiLinkClick(
    target: string
  ) {
    try {
      const reference =
        await resolveNote(target);

      navigate(
        `/note/${encodeURI(
          reference.path
        )}`
      );

    } catch {
      alert(
        `Die Note "${target}" wurde nicht gefunden.`
      );
    }
  }


  return (
    <VaultLayout
      tree={vaultTree}
      onFileClick={handleFileClick}
      onRefresh={onRefresh}
      refreshing={refreshing}
      onSearchNoteClick={handleFileClick}
    >
      <Routes>

        <Route
          path="/"
          element={
            <div>
              <h1>Obsidian Web</h1>

              <p>
                Select a note from the vault.
              </p>
            </div>
          }
        />


        <Route
          path="/note/*"
          element={
            <NotePage
              refreshKey={refreshKey}
              onWikiLinkClick={
                handleWikiLinkClick
              }
              onTagClick={
                handleTagClick
              }
              onNoteClick={
                handleNoteClick
              }
            />
          }
        />


        <Route
          path="/tag/*"
          element={
            <TagRoute
              onOpenNote={
                handleFileClick
              }
            />
          }
        />


        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </VaultLayout>
  );
}


function TagRoute({
  onOpenNote,
}: {
  onOpenNote: (
    path: string
  ) => void;
}) {
  const { "*": tagPath } =
    useParams();

  if (!tagPath) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  const tag =
    decodeURIComponent(
      tagPath
    );

  return (
    <TagPage
      tag={tag}
      onOpenNote={onOpenNote}
    />
  );
}


export default App;