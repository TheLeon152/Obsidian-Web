import { useEffect, useState } from "react";

import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
  useLocation,
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

import { TodayTasksPage } from "./pages/TaskPage/TodayTasksPage";
import { UpcomingTasksPage } from "./pages/TaskPage/UpcomingTasksPage";
import { NextTasksPage } from "./pages/TaskPage/NextTasksPage";
import { WaitingTasksPage } from "./pages/TaskPage/WaitingTasksPage";
import { BlockedTasksPage } from "./pages/TaskPage/BlockedTasksPage";
import { TaskDashboardPage } from "./pages/TaskPage/TaskDashboardPage";

import { DailyPage } from "./pages/DailyPage/DailyPage";
import { InboxPage } from "./pages/InboxPage/InboxPage";
import { FolderPage } from "./pages/FolderPage/FolderPage";


export function AuthenticatedApp() {

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


  /*
   * ============================================================
   * Vault laden
   * ============================================================
   */

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


  /*
   * ============================================================
   * Vault aktualisieren
   * ============================================================
   */

  async function handleRefresh() {

    setRefreshing(true);

    setRefreshKey(
      current => current + 1
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


  /*
   * ============================================================
   * Ladezustand
   * ============================================================
   */

  if (loading) {

    return (
      <div>
        Loading vault...
      </div>
    );

  }


  /*
   * ============================================================
   * Fehler
   * ============================================================
   */

  if (error && !vaultTree) {

    return (
      <div>
        Error: {error}
      </div>
    );

  }


  if (!vaultTree) {

    return (
      <div>
        Vault could not be loaded.
      </div>
    );

  }


  /*
   * ============================================================
   * Anwendung
   * ============================================================
   */

  return (
    <AppRoutes
      vaultTree={vaultTree}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      refreshKey={refreshKey}
    />
  );
}


/*
 * ==============================================================
 * App Routes
 * ==============================================================
 */

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

  const navigate =
    useNavigate();

  const location =
    useLocation();


  /*
   * ============================================================
   * Tag öffnen
   * ============================================================
   */

  function handleTagClick(
    tag: string
  ) {

    navigate(
      `/tag/${tag}`
    );

  }


  /*
   * ============================================================
   * Datei öffnen
   * ============================================================
   */

  function handleFileClick(
    path: string
  ) {

    navigate(
      `/note/${encodeURI(path)}`
    );

  }


  /*
   * ============================================================
   * Ordner öffnen
   * ============================================================
   */

  function handleFolderClick(
    path: string
  ) {

    navigate(
      `/folder/${encodeURI(path)}`
    );

  }


  /*
   * ============================================================
   * Note öffnen
   * ============================================================
   */

  async function handleNoteClick(
    path: string
  ) {

    try {

      const normalizedPath =
        path
          .replace(/\\/g, "/")
          .trim();


      /*
       * Direkter Pfad mit Dateiendung
       */

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


      /*
       * Pfad mit Slash
       *
       * Beispiel:
       *
       * Test1/React
       *
       * →
       *
       * Test1/React.md
       */

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


      /*
       * Einfacher Notizname
       *
       * Beispiel:
       *
       * React
       *
       * → Backend resolveNote()
       */

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


  /*
   * ============================================================
   * WikiLink öffnen
   * ============================================================
   */

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


  /*
   * ============================================================
   * Render
   * ============================================================
   */

  return (
    <VaultLayout

      tree={vaultTree}

      onFileClick={
        handleFileClick
      }

      onRefresh={
        onRefresh
      }

      refreshing={
        refreshing
      }

      onSearchNoteClick={
        handleFileClick
      }

      onFolderClick={
        handleFolderClick
      }

      activePath={

        location.pathname.startsWith(
          "/folder/"
        )

          ? decodeURIComponent(
              location.pathname.replace(
                "/folder/",
                ""
              )
            )

          : undefined

      }

    >

      <Routes>

        {/* ==================================================
            Notes
            ================================================== */}

        <Route
          path="/note/*"
          element={
            <NotePage
              refreshKey={refreshKey}
              onWikiLinkClick={handleWikiLinkClick}
              onTagClick={handleTagClick}
              onNoteClick={handleNoteClick}
              onFolderClick={handleFolderClick}
            />
          }
        />


        {/* ==================================================
            Tasks
            ================================================== */}

        <Route
          path="/tasks/today"
          element={
            <TodayTasksPage />
          }
        />

        <Route
          path="/tasks/upcoming"
          element={
            <UpcomingTasksPage />
          }
        />

        <Route
          path="/tasks/next"
          element={
            <NextTasksPage />
          }
        />

        <Route
          path="/tasks/waiting"
          element={
            <WaitingTasksPage />
          }
        />

        <Route
          path="/tasks/blocked"
          element={
            <BlockedTasksPage />
          }
        />

        <Route
          path="/tasks"
          element={
            <TaskDashboardPage />
          }
        />


        {/* ==================================================
            Daily
            ================================================== */}

        <Route
          path="/"
          element={
            <DailyPage />
          }
        />


        {/* ==================================================
            Tags
            ================================================== */}

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


        {/* ==================================================
            Inbox
            ================================================== */}

        <Route
          path="/inbox"
          element={
            <InboxPage />
          }
        />


        {/* ==================================================
            Folders
            ================================================== */}

        <Route
          path="/folder/*"
          element={
            <FolderPage
              onNoteClick={
                handleNoteClick
              }
            />
          }
        />


        {/* ==================================================
            Fallback
            ================================================== */}

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


/*
 * ==============================================================
 * Tag Route
 * ==============================================================
 */

function TagRoute({
  onOpenNote,
}: {
  onOpenNote: (
    path: string
  ) => void;
}) {

  const {
    "*": tagPath
  } = useParams();


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