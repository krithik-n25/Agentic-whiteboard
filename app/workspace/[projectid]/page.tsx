"use client"
import React, { useState } from 'react'
import dynamic from 'next/dynamic';
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
      />

      {activeTab == 'WhiteBoard'
        ? <Whiteboard onApiReady={setExcalidrawAPI} />
        : <SmartDocx />
      }
    </div>
  )
}

export default workspace
