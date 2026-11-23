"use client"
import React, { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import axios from 'axios';
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types';
import WorkspaceHeader from '@/components/custom/workspace/WorkspaceHeader'
import CodeFlow from '@/components/custom/workspace/CodeFlow';
import type { SaveStatus } from '@/components/custom/workspace/Whiteboard';
import { getSettings } from '@/lib/settings';
import { toast } from '@/components/ui/toast';

// Excalidraw uses `window` on import, so render the whiteboard only in the browser
const Whiteboard = dynamic(
  () => import('@/components/custom/workspace/Whiteboard'),
  { ssr: false }
);

function workspace() {
  const [activeTab, setActiveTab] = useState("WhiteBoard");
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const [projectName, setProjectName] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  // View-only link on / off (header Share button)
  const [isPublic, setIsPublic] = useState(false);
  const { projectid } = useParams();
  // Flowchart from the Code tab to zoom to once the whiteboard is visible again
  const pendingFocusRef = useRef<any[] | null>(null);

  // Save button / Ctrl+S: the Whiteboard hands us its "save now" function
  const saveNowRef = useRef<(() => Promise<boolean>) | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");

  const handleSave = async () => {
    if (!saveNowRef.current || !isLoaded || saveStatus === "saving") return;
    const ok = await saveNowRef.current();
    toast.add(ok
      ? { title: "Saved", type: "success" }
      : { title: "Save failed", description: "Check your internet and try again.", type: "error" });
  };

  // Ctrl+S / Cmd+S saves the board. Capture phase on window, so it runs before
  // Excalidraw (which would otherwise try to download a .excalidraw file).
  const handleSaveRef = useRef(handleSave);
  handleSaveRef.current = handleSave;
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        e.stopPropagation();
        handleSaveRef.current();
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, []);

  // Closing the tab with unsaved changes: let the browser ask first
  useEffect(() => {
    if (saveStatus !== 'unsaved' && saveStatus !== 'saving' && saveStatus !== 'error') return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [saveStatus]);

  // Load the saved whiteboard once Excalidraw is ready
  useEffect(() => {
    if (!excalidrawAPI || !projectid) return;
    GetWhiteboardData(excalidrawAPI);
  }, [excalidrawAPI, projectid]);

  const GetWhiteboardData = async (api: ExcalidrawImperativeAPI) => {
    try {
      const result = await axios.get('/api/projects', { params: { projectId: projectid } });
      const { projectName, elements, appState, files } = result.data;
      setProjectName(projectName);
      setIsPublic(!!result.data.isPublic);

      // restore* fills missing fields and cleans elements from the DB
      const { restoreElements, restoreAppState, CaptureUpdateAction, FONT_FAMILY } = await import('@excalidraw/excalidraw');

      const settings = getSettings();

      // collaborators is a Map, but JSON saves it as {}. restoreAppState keeps the {}
      // and Excalidraw crashes on .forEach, so drop it and let the default new Map() be used.
      const { collaborators, ...savedAppState } = appState ?? {};

      if (files && Object.keys(files).length > 0) {
        api.addFiles(Object.values(files));
      }
      api.updateScene({
        elements: restoreElements(elements, null),
        appState: {
          ...restoreAppState(savedAppState, null),
          // Settings > Whiteboard: grid and the font for new text, on every board
          gridModeEnabled: settings.grid,
          currentItemFontFamily: {
            hand: FONT_FAMILY.Excalifont,
            normal: FONT_FAMILY.Nunito,
            code: FONT_FAMILY['Comic Shanns'],
          }[settings.canvasFont],
        },
        captureUpdate: CaptureUpdateAction.NEVER, // loading should not be undoable
      });

      setIsLoaded(true);
    } catch (error) {
      console.error("Failed to load whiteboard", error);
      toast.add({ title: "Could not load whiteboard", type: "error" });
    }
  };

  // Whiteboard stays mounted while hidden; recalculate its size when shown again
  useEffect(() => {
    if (activeTab != 'WhiteBoard' || !excalidrawAPI) return;
    excalidrawAPI.refresh();

    // Coming from the Code tab: zoom to the new flowchart (after the canvas has its size)
    const elements = pendingFocusRef.current;
    if (elements) {
      pendingFocusRef.current = null;
      requestAnimationFrame(() =>
        excalidrawAPI.scrollToContent(elements, { fitToContent: true, animate: true })
      );
    }
  }, [activeTab]);

  const handleFlowchartReady = (elements: any[]) => {
    pendingFocusRef.current = elements;
    setActiveTab('WhiteBoard');
  };

  const handleExportImage = async () => {
    if (!excalidrawAPI) return;

    try {
      // Imported here (not at the top) because Excalidraw needs `window`
      const { exportToBlob } = await import('@excalidraw/excalidraw');
      const { AI_PLACEHOLDER_IDS } = await import('@/components/custom/workspace/AIFloatingSidebar');
      const placeholderIds: string[] = Object.values(AI_PLACEHOLDER_IDS);

      // Skip the temporary "Generating with AI..." placeholder
      const elements = excalidrawAPI
        .getSceneElements()
        .filter((el) => !placeholderIds.includes(el.id));

      if (elements.length === 0) {
        toast.add({ title: "Nothing to export", type: "error" });
        return;
      }

      const blob = await exportToBlob({
        elements,
        appState: {
          ...excalidrawAPI.getAppState(),
          exportBackground: true,
        },
        files: excalidrawAPI.getFiles(),
        mimeType: "image/png",
        quality: 1,
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "whiteboard.png";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed", error);
      toast.add({ title: "Export failed", type: "error" });
    }
  };

  return (
    <div className=" h-screen">
      <WorkspaceHeader
        selectedTab={(value: string) => setActiveTab(value)}
        activeTab={activeTab}
        onSave={handleSave}
        saveStatus={saveStatus}
        canSave={isLoaded}
        projectId={String(projectid)}
        isPublic={isPublic}
        onShareChange={setIsPublic}
        onExport={handleExportImage}
        canExport={activeTab == 'WhiteBoard' && !!excalidrawAPI}
        projectName={projectName}
      />

      {/* Hidden instead of unmounted, so unsaved changes and the API survive a tab switch */}
      <div className={activeTab == 'WhiteBoard' ? '' : 'hidden'}>
        <Whiteboard
          onApiReady={setExcalidrawAPI}
          isLoaded={isLoaded}
          onSaveReady={(fn) => { saveNowRef.current = fn; }}
          onSaveStatus={setSaveStatus}
        />
      </div>
      {/* Kept mounted (only hidden) so the pasted code and steps stay when switching tabs */}
      <div className={activeTab == 'Code' ? '' : 'hidden'}>
        <CodeFlow excalidrawAPI={excalidrawAPI} onFlowchartReady={handleFlowchartReady} />
      </div>
    </div>
  )
}

export default workspace
