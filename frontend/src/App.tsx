import { useEffect, useState } from "react";

import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";

import { getVaultTree } from "./api/vault";

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


  if (loading) {
    return <div>Loading vault...</div>;
  }


  if (error) {
    return <div>Error: {error}</div>;
  }


  if (!vaultTree) {
    return <div>Vault could not be loaded.</div>;
  }


  return (
    <AppRoutes
      vaultTree={vaultTree}
    />
  );
}


interface AppRoutesProps {
  vaultTree: VaultNode;
}


function AppRoutes({
  vaultTree,
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


  /* async function handleNoteClick(
    target: string
  ) {
    try {
      const normalizedTarget =
        target
          .replace(/\\/g, "/")
          .trim();

      // Links mit einem Pfad werden direkt
      // als Vault-Pfad behandelt.
      if (
        normalizedTarget.includes("/")
      ) {
        const path =
          normalizedTarget.endsWith(".md")
            ? normalizedTarget
            : `${normalizedTarget}.md`;

        navigate(
          `/note/${encodeURI(path)}`
        );

        return;
      }

      // Ein einfacher Name wird über den
      // NoteResolver aufgelöst.
      const reference =
        await resolveNote(
          normalizedTarget
        );

      navigate(
        `/note/${encodeURI(reference.path)}`
      );
    } catch (error) {
      console.error(
        `Could not resolve note link: ${target}`,
        error
      );
    }
  } */

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
          `/note/${encodeURI(normalizedPath)}`
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
        `/note/${encodeURI(reference.path)}`
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
        `/note/${encodeURI(reference.path)}`
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
              onOpenNote={handleFileClick}
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
  const { "*": tagPath } = useParams();

  if (!tagPath) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  const tag =
    decodeURIComponent(tagPath);

  return (
    <TagPage
      tag={tag}
      onOpenNote={onOpenNote}
    />
  );
}


export default App;