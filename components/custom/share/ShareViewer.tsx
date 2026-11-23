"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Excalidraw, restoreAppState, restoreElements } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { Eye, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { projectId: string };

type Scene = {
  projectName: string;
  initialData: any;
};

// Read-only view of a shared board. No login needed.
function ShareViewer({ projectId }: Props) {
  const [scene, setScene] = useState<Scene | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // Changing it remounts Excalidraw with the fresh data (Refresh button)
  const [version, setVersion] = useState(0);

  const loadBoard = async () => {
    setLoading(true);
    try {
      const result = await axios.get("/api/share", { params: { projectId } });
      const { projectName, elements, appState, files } = result.data;

      // Same clean-up as the workspace: collaborators is saved as {} and crashes Excalidraw
      const { collaborators, ...savedAppState } = appState ?? {};

      setScene({
        projectName,
        initialData: {
          elements: restoreElements(elements, null),
          appState: { ...restoreAppState(savedAppState, null), viewModeEnabled: true },
          files: files ?? {},
          scrollToContent: true,
        },
      });
      setError(null);
      setVersion((v) => v + 1);
    } catch (err: any) {
      setError(
        err?.response?.status === 404
          ? "This board is not shared, or the link is wrong."
          : "Could not load the board. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoard();
  }, [projectId]);

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex min-w-0 items-center gap-2">
          <Image src="/logo.svg" alt="logo" width={40} height={40} />
          <h2 className="truncate text-lg font-semibold">{scene?.projectName ?? "Shared board"}</h2>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            <Eye className="h-3.5 w-3.5" /> View only
          </span>
        </div>
        <div className="flex items-center gap-2">
          {scene && (
            <Button variant="outline" size="sm" onClick={loadBoard} disabled={loading} title="Load the latest saved version">
              <RefreshCw className={loading ? "animate-spin" : ""} /> Refresh
            </Button>
          )}
          <Button size="sm" nativeButton={false} render={<Link href="/dashboard" />}>
            Make your own board
          </Button>
        </div>
      </div>

      <div className="relative flex-1">
        {loading && !scene && (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading board...
          </div>
        )}
        {error && !scene && (
          <div className="flex h-full items-center justify-center p-6 text-center text-muted-foreground">
            {error}
          </div>
        )}
        {scene && (
          <div className="absolute inset-0">
            <Excalidraw
              key={version}
              initialData={scene.initialData}
              viewModeEnabled // read only: no drawing, no editing
              UIOptions={{
                canvasActions: {
                  changeViewBackgroundColor: false,
                  clearCanvas: false,
                  export: false,
                  loadScene: false,
                  saveToActiveFile: false,
                  saveAsImage: false,
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ShareViewer;
