"use client";

import React, { useEffect, useRef, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
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

function Whiteboard() {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [activeTool, setActiveTool] = useState("selection");

  const saveTimerRef = useRef<any>();
  const { projectid } = useParams();

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
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      SaveCanvasData(elements, appState, files);
    }, 10000);
  };

  const SaveCanvasData = async (
    elements: readonly any[],
    appState: any,
    files: any
  ) => {
    try {
      await axios.post("/api/whiteboard", {
        elements,
        appState,
        files,
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
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          onChange={HandleCanvas}
        />
      </div>

    </div>
  );
}

export default Whiteboard;