"use client";

import React, { useEffect, useRef, useState } from "react";
import { Excalidraw, exportToBlob } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import "@excalidraw/excalidraw/index.css";
import axios from "axios";
import { useParams } from "next/navigation";

import {
  MousePointer2,
  Hand,
  Square,
  Diamond,
  Circle,
  ArrowRight,
  Minus,
  Pencil,
  Type,
  Image as ImageIcon,
  Eraser,
  Lock,
  Sparkles,
} from "lucide-react";

import "./whiteboard.css";
import AIFloatingSidebar, { AI_PLACEHOLDER_IDS } from "./AIFloatingSidebar";
import ExtrasPanel from "./ExtrasPanel";

const PLACEHOLDER_IDS = Object.values(AI_PLACEHOLDER_IDS);

type Props = {
  // Gives the Excalidraw API to the parent (used for Export). null on unmount.
  onApiReady?: (api: ExcalidrawImperativeAPI | null) => void;
  // false until saved data is loaded, so the empty canvas never overwrites the DB
  isLoaded?: boolean;
};

function Whiteboard({ onApiReady, isLoaded = true }: Props) {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [activeTool, setActiveTool] = useState("selection");
  const [showAISidebar, setShowAISidebar] = useState(false);

  const saveTimerRef = useRef<any>(null);
  const { projectid } = useParams();

  // Keep the latest callback in a ref so the unmount cleanup below runs only once
  const onApiReadyRef = useRef(onApiReady);
  onApiReadyRef.current = onApiReady;

  // Switching to the Docs tab unmounts the whiteboard, so the old API is no longer valid
  useEffect(() => {
    return () => onApiReadyRef.current?.(null);
  }, []);

  /**
   * Activate an Excalidraw tool
   */
  const selectTool = (tool: string) => {
    if (!excalidrawAPI) return;

    excalidrawAPI.setActiveTool({
      type: tool,
    });

    setActiveTool(tool);
  };

  /**
   * Save canvas
   */
  const HandleCanvas = (
    elements: readonly any[],
    appState: any,
    files: any
  ) => {
    if (!isLoaded) return;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    // Never save the temporary "Generating with AI..." placeholder
    const elementsToSave = elements.filter(
      (el) => !PLACEHOLDER_IDS.includes(el.id)
    );

    saveTimerRef.current = setTimeout(() => {
      SaveCanvasData(elementsToSave, appState, files);
    }, 10000);
  };

  /**
   * Small low quality JPEG of the canvas for the dashboard card.
   * Max 400px on the long side (the card crops it to 16:9), quality 50%.
   */
  const GeneratePreviewBase64 = async (
    elements: readonly any[],
    appState: any,
    files: any
  ): Promise<string | null> => {
    const visibleElements = elements.filter((el) => !el.isDeleted);
    if (visibleElements.length === 0) return null;

    const blob = await exportToBlob({
      elements: visibleElements,
      appState: { ...appState, exportBackground: true },
      files,
      maxWidthOrHeight: 400,
      mimeType: "image/jpeg", // PNG ignores quality
      quality: 0.5,
    });

    return BlobToBase64(blob);
  };

  const BlobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  const SaveCanvasData = async (
    elements: readonly any[],
    appState: any,
    files: any
  ) => {
    // A missing preview should never stop the canvas from saving
    let previewImage: string | null = null;
    try {
      previewImage = await GeneratePreviewBase64(elements, appState, files);
    } catch (error) {
      console.error("Failed to generate preview", error);
    }

    try {
      await axios.post("/api/whiteboard", {
        elements,
        appState,
        files,
        previewImage,
        projectId: projectid,
      });

      console.log("Canvas saved");
    } catch (error) {
      console.error("Failed to save canvas", error);
    }
  };

  /**
   * Keep our custom toolbar synchronized
   * with Excalidraw's current active tool.
   */
  useEffect(() => {
    if (!excalidrawAPI) return;

    const syncTool = () => {
      const state = excalidrawAPI.getAppState();

      if (state?.activeTool?.type) {
        setActiveTool(state.activeTool.type);
      }
    };

    syncTool();
  }, [excalidrawAPI]);

  const tools = [
    {
      id: "selection",
      label: "Select",
      icon: MousePointer2,
      shortcut: "V",
      color: "#6366f1",
    },
    {
      id: "hand",
      label: "Pan Canvas",
      icon: Hand,
      shortcut: "H",
      color: "#64748b",
    },

    {
      id: "rectangle",
      label: "Rectangle",
      icon: Square,
      shortcut: "R",
      color: "#3b82f6",
    },
    {
      id: "diamond",
      label: "Diamond",
      icon: Diamond,
      shortcut: "D",
      color: "#8b5cf6",
    },
    {
      id: "ellipse",
      label: "Ellipse",
      icon: Circle,
      shortcut: "O",
      color: "#ec4899",
    },

    {
      id: "arrow",
      label: "Arrow",
      icon: ArrowRight,
      shortcut: "A",
      color: "#f59e0b",
    },
    {
      id: "line",
      label: "Line",
      icon: Minus,
      shortcut: "L",
      color: "#14b8a6",
    },
    {
      id: "freedraw",
      label: "Draw",
      icon: Pencil,
      shortcut: "P",
      color: "#ef4444",
    },

    {
      id: "text",
      label: "Text",
      icon: Type,
      shortcut: "T",
      color: "#10b981",
    },
    {
      id: "image",
      label: "Image",
      icon: ImageIcon,
      color: "#06b6d4",
    },
    {
      id: "eraser",
      label: "Eraser",
      icon: Eraser,
      shortcut: "E",
      color: "#f97316",
    },
  ];

  return (
    <div className="whiteboard-container">

      {/* =========================
          CUSTOM LEFT TOOLBAR
      ========================== */}

      <div className="custom-toolbar">

        {/* Toolbar Header */}


        {/* <div className="toolbar-divider" /> */}

        {/* Selection */}
        <div className="toolbar-group">
          {tools.slice(0, 2).map((tool) => {
            const Icon = tool.icon;

            return (
              <button
                key={tool.id}
                className={`tool-button ${activeTool === tool.id ? "active" : ""
                  }`}
                style={
                  {
                    "--tool-color": tool.color,
                  } as React.CSSProperties
                }
                onClick={() => selectTool(tool.id)}
                title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ""
                  }`}
              >
                <Icon size={19} strokeWidth={1.8} />

                <span className="tool-tooltip">
                  {tool.label}

                  {tool.shortcut && (
                    <kbd>{tool.shortcut}</kbd>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="toolbar-divider" />

        {/* Shapes */}
        <div className="toolbar-group">
          {tools.slice(2, 5).map((tool) => {
            const Icon = tool.icon;

            return (
              <button
                key={tool.id}
                className={`tool-button ${activeTool === tool.id ? "active" : ""
                  }`}
                  style={
    {
      "--tool-color": tool.color,
    } as React.CSSProperties
  }
                onClick={() => selectTool(tool.id)}
                title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ""
                  }`}
              >
                <Icon size={19} strokeWidth={1.8} />

                <span className="tool-tooltip">
                  {tool.label}

                  {tool.shortcut && (
                    <kbd>{tool.shortcut}</kbd>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="toolbar-divider" />

        {/* Lines */}
        <div className="toolbar-group">
          {tools.slice(5, 8).map((tool) => {
            const Icon = tool.icon;

            return (
              <button
                key={tool.id}
                className={`tool-button ${activeTool === tool.id ? "active" : ""
                  }`}
                  style={
    {
      "--tool-color": tool.color,
    } as React.CSSProperties
  }
                onClick={() => selectTool(tool.id)}
                title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ""
                  }`}
              >
                <Icon size={19} strokeWidth={1.8} />

                <span className="tool-tooltip">
                  {tool.label}

                  {tool.shortcut && (
                    <kbd>{tool.shortcut}</kbd>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="toolbar-divider" />

        {/* Other tools */}
        <div className="toolbar-group">
          {tools.slice(8).map((tool) => {
            const Icon = tool.icon;

            return (
              <button
                key={tool.id}
                className={`tool-button ${activeTool === tool.id ? "active" : ""
                  }`}
                onClick={() => selectTool(tool.id)}
                title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ""
                  }`}
              >
                <Icon size={19} strokeWidth={1.8} />

                <span className="tool-tooltip">
                  {tool.label}

                  {tool.shortcut && (
                    <kbd>{tool.shortcut}</kbd>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="toolbar-divider" />

        {/* Extras: notes, emoji, icons */}
        <ExtrasPanel excalidrawAPI={excalidrawAPI} />

        <div className="toolbar-spacer" />

        {/* Bottom button */}
        <button
          className="toolbar-bottom-button"
          title="Lock toolbar"
        >
          <Lock size={17} />
        </button>
      </div>

      {/* =========================
          EXCALIDRAW
      ========================== */}

      <div className="excalidraw-wrapper">
        <Excalidraw
          // @ts-ignore
          excalidrawAPI={(api) => {
            setExcalidrawAPI(api);
            onApiReady?.(api);
          }}
          onChange={HandleCanvas}
        />
      </div>

      {/* =========================
          AI HELPER
      ========================== */}

      {showAISidebar && excalidrawAPI && (
        <AIFloatingSidebar
          excalidrawAPI={excalidrawAPI}
          onClose={() => setShowAISidebar(false)}
        />
      )}

      <button
        className={`ai-floating-button ${showAISidebar ? "active" : ""}`}
        onClick={() => setShowAISidebar(!showAISidebar)}
        title="AI Helper"
      >
        <Sparkles size={18} />
        AI
      </button>

    </div>
  );
}

export default Whiteboard;