"use client"
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import axios from 'axios';
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types';
import WorkspaceHeader from '@/components/custom/workspace/WorkspaceHeader'
import SmartDocx from '@/components/custom/workspace/SmartDocx';
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
  const { projectid } = useParams();

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

      // restore* fills missing fields and cleans elements from the DB
      const { restoreElements, restoreAppState, CaptureUpdateAction } = await import('@excalidraw/excalidraw');

      // collaborators is a Map, but JSON saves it as {}. restoreAppState keeps the {}
      // and Excalidraw crashes on .forEach, so drop it and let the default new Map() be used.
      const { collaborators, ...savedAppState } = appState ?? {};

      if (files && Object.keys(files).length > 0) {
        api.addFiles(Object.values(files));
      }
      api.updateScene({
        elements: restoreElements(elements, null),
        appState: restoreAppState(savedAppState, null),
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
    if (activeTab == 'WhiteBoard') excalidrawAPI?.refresh();
  }, [activeTab]);

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
        onExport={handleExportImage}
        canExport={activeTab == 'WhiteBoard' && !!excalidrawAPI}
        projectName={projectName}
      />

      {/* Hidden instead of unmounted, so unsaved changes and the API survive a tab switch */}
      <div className={activeTab == 'WhiteBoard' ? '' : 'hidden'}>
        <Whiteboard onApiReady={setExcalidrawAPI} isLoaded={isLoaded} />
      </div>
      {activeTab == 'Docs' && <SmartDocx />}
    </div>
  )
}

export default workspace
