"use client";

import React, { useContext, useState } from "react";
import axios from "axios";
import {
  convertToExcalidrawElements,
  CaptureUpdateAction,
} from "@excalidraw/excalidraw";
import { Sparkles, X, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { AI_TOOLS } from "@/lib/aiTools";
import { UserDetailContext } from "@/context/UserDetailContext";
import { FREE_AI_CREDITS, getNextCreditReset } from "@/lib/plans";
import { format } from "date-fns";

type Props = {
  excalidrawAPI: any;
  onClose: () => void;
};

type AIElement = {
  id: string;
  type: "rectangle" | "ellipse" | "diamond" | "text";
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  backgroundColor?: string;
  strokeColor?: string;
};

type AIConnection = { from: string; to: string; label?: string };

type DiagramResult = {
  title?: string;
  elements?: AIElement[];
  connections?: AIConnection[];
};

/**
 * Fixed ids for the loading placeholder, so we can remove it later.
 * Exported so autosave can skip them.
 */
export const AI_PLACEHOLDER_IDS = {
  container: "ai-placeholder-container",
  title: "ai-placeholder-title",
  subtitle: "ai-placeholder-subtitle",
  skeleton1: "ai-placeholder-skeleton-1",
  skeleton2: "ai-placeholder-skeleton-2",
  skeleton3: "ai-placeholder-skeleton-3",
};

const PLACEHOLDER_ID_LIST = Object.values(AI_PLACEHOLDER_IDS);

function AIFloatingSidebar({ excalidrawAPI, onClose }: Props) {
  const [selectedTool, setSelectedTool] = useState(AI_TOOLS[0].name);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  // While user details load, do not block (the server checks credits anyway)
  const aiCredits = Number(userDetails?.credits ?? 0);
  const noCredits = !!userDetails && aiCredits <= 0;
  const resetDate = format(getNextCreditReset(), "d MMM");

  /**
   * Find an empty spot on the right of existing elements.
   * If the canvas is empty, use the middle of the current viewport.
   */
  const getEmptyCanvasPosition = () => {
    const elements = excalidrawAPI
      .getSceneElements()
      .filter(
        (el: any) => !el.isDeleted && !PLACEHOLDER_ID_LIST.includes(el.id)
      );

    if (elements.length === 0) {
      const { scrollX, scrollY, zoom, width, height } =
        excalidrawAPI.getAppState();
      return {
        x: -scrollX + width / 2 / zoom.value - 210,
        y: -scrollY + height / 2 / zoom.value - 125,
      };
    }

    const maxRight = Math.max(...elements.map((el: any) => el.x + el.width));
    const minTop = Math.min(...elements.map((el: any) => el.y));

    return { x: maxRight + 150, y: minTop };
  };

  const addAIPlaceholder = (position: { x: number; y: number }) => {
    const { x, y } = position;

    const skeletonBar = (id: string, offsetY: number, width: number) => ({
      type: "rectangle" as const,
      id,
      x: x + 30,
      y: y + offsetY,
      width,
      height: 18,
      backgroundColor: "#e9ecef",
      strokeColor: "#e9ecef",
      fillStyle: "solid" as const,
      roundness: { type: 3 },
    });

    const placeholder = convertToExcalidrawElements(
      [
        {
          type: "rectangle",
          id: AI_PLACEHOLDER_IDS.container,
          x,
          y,
          width: 420,
          height: 250,
          strokeColor: "#6366f1",
          backgroundColor: "#eef2ff",
          fillStyle: "solid",
          strokeStyle: "dashed",
          roundness: { type: 3 },
        },
        {
          type: "text",
          id: AI_PLACEHOLDER_IDS.title,
          x: x + 30,
          y: y + 30,
          text: "✨ Generating with AI...",
          fontSize: 24,
          strokeColor: "#4338ca",
        },
        {
          type: "text",
          id: AI_PLACEHOLDER_IDS.subtitle,
          x: x + 30,
          y: y + 70,
          text: "Preparing your diagram",
          fontSize: 16,
          strokeColor: "#64748b",
        },
        skeletonBar(AI_PLACEHOLDER_IDS.skeleton1, 120, 360),
        skeletonBar(AI_PLACEHOLDER_IDS.skeleton2, 155, 280),
        skeletonBar(AI_PLACEHOLDER_IDS.skeleton3, 190, 200),
      ] as any,
      { regenerateIds: false }
    );

    excalidrawAPI.updateScene({
      elements: [...excalidrawAPI.getSceneElements(), ...placeholder],
      captureUpdate: CaptureUpdateAction.NEVER,
    });
  };

  const removeAIPlaceholder = () => {
    if (!excalidrawAPI) return;

    const updatedElements = excalidrawAPI
      .getSceneElements()
      .filter((el: any) => !PLACEHOLDER_ID_LIST.includes(el.id));

    excalidrawAPI.updateScene({
      elements: updatedElements,
      captureUpdate: CaptureUpdateAction.NEVER,
    });
  };

  /**
   * Route an arrow between two shapes using only horizontal/vertical
   * segments, so it bends around other shapes instead of cutting through.
   * Shapes are never moved, only the arrow path is computed.
   *
   * Tries, in order: straight line (when aligned) -> L shape (vertical
   * first) -> L shape (horizontal first) -> detour through a free lane on
   * the right. The first path that does not cross another shape wins.
   * All points end on edge midpoints, which lie on the outline of
   * rectangles, diamonds and ellipses.
   */
  const routeArrow = (from: AIElement, to: AIElement, all: AIElement[]) => {
    type Pt = { x: number; y: number };
    const GAP = 6; // space so the arrowhead does not sit on the stroke
    const MARGIN = 12; // clearance around other shapes
    const LANE = 50; // distance of the detour lane from the shapes

    const box = (el: AIElement) => ({
      left: el.x,
      right: el.x + el.width,
      top: el.y,
      bottom: el.y + el.height,
      cx: el.x + el.width / 2,
      cy: el.y + el.height / 2,
    });
    const a = box(from);
    const b = box(to);

    const top = (s: typeof a): Pt => ({ x: s.cx, y: s.top - GAP });
    const bottom = (s: typeof a): Pt => ({ x: s.cx, y: s.bottom + GAP });
    const left = (s: typeof a): Pt => ({ x: s.left - GAP, y: s.cy });
    const right = (s: typeof a): Pt => ({ x: s.right + GAP, y: s.cy });

    const obstacles = all
      .filter((el) => el.id !== from.id && el.id !== to.id)
      .map(box);

    // Does an axis aligned segment pass through any other shape?
    const segmentHits = (p: Pt, q: Pt) =>
      obstacles.some((o) => {
        const minX = Math.min(p.x, q.x);
        const maxX = Math.max(p.x, q.x);
        const minY = Math.min(p.y, q.y);
        const maxY = Math.max(p.y, q.y);
        return (
          maxX > o.left - MARGIN &&
          minX < o.right + MARGIN &&
          maxY > o.top - MARGIN &&
          minY < o.bottom + MARGIN
        );
      });

    const isClear = (path: Pt[]) =>
      path.every((p, i) => i === 0 || !segmentHits(path[i - 1], p));

    const candidates: Pt[][] = [];
    const below = b.cy > a.cy;
    const toRight = b.cx > a.cx;

    // 1. Straight line when the shapes overlap on an axis
    const overlapX = a.left < b.right && b.left < a.right;
    const overlapY = a.top < b.bottom && b.top < a.bottom;
    if (overlapX && !overlapY) {
      const x = (Math.max(a.left, b.left) + Math.min(a.right, b.right)) / 2;
      candidates.push(
        below
          ? [{ x, y: a.bottom + GAP }, { x, y: b.top - GAP }]
          : [{ x, y: a.top - GAP }, { x, y: b.bottom + GAP }]
      );
    } else if (overlapY && !overlapX) {
      const y = (Math.max(a.top, b.top) + Math.min(a.bottom, b.bottom)) / 2;
      candidates.push(
        toRight
          ? [{ x: a.right + GAP, y }, { x: b.left - GAP, y }]
          : [{ x: a.left - GAP, y }, { x: b.right + GAP, y }]
      );
    }

    if (!overlapX && !overlapY) {
      // 2. Vertical first: leave from top/bottom, enter from the side
      candidates.push([
        below ? bottom(a) : top(a),
        { x: a.cx, y: b.cy },
        toRight ? left(b) : right(b),
      ]);
      // 3. Horizontal first: leave from the side, enter from top/bottom
      candidates.push([
        toRight ? right(a) : left(a),
        { x: b.cx, y: a.cy },
        below ? top(b) : bottom(b),
      ]);
    }

    // 4. Detour: go out to a free vertical lane on the right of everything
    // between the two shapes, then come back in
    const spanTop = Math.min(a.top, b.top);
    const spanBottom = Math.max(a.bottom, b.bottom);
    const laneX =
      Math.max(
        a.right,
        b.right,
        ...obstacles
          .filter((o) => o.bottom > spanTop && o.top < spanBottom)
          .map((o) => o.right)
      ) + LANE;
    candidates.push([
      right(a),
      { x: laneX, y: a.cy },
      { x: laneX, y: b.cy },
      right(b),
    ]);

    return candidates.find(isClear) ?? candidates[0];
  };

  /**
   * Convert AI JSON into Excalidraw elements.
   * Arrows are bound to shapes by id so they follow the shapes when moved.
   */
  const renderAIDiagram = (
    result: DiagramResult,
    origin: { x: number; y: number }
  ) => {
    const prefix = `ai-${Date.now()}-`;
    const aiElements = result.elements ?? [];
    const ids = new Set(aiElements.map((el) => el.id));

    const shapes = aiElements
      .filter((el) => el.type !== "text" || el.text)
      .map((el) => {
        const base = {
          id: prefix + el.id,
          x: origin.x + el.x,
          y: origin.y + el.y,
          strokeColor: el.strokeColor || "#1e1e1e",
        };

        if (el.type === "text") {
          return { ...base, type: "text", text: el.text, fontSize: 20 };
        }

        return {
          ...base,
          type: el.type,
          width: el.width,
          height: el.height,
          backgroundColor: el.backgroundColor || "transparent",
          fillStyle: "solid",
          roundness: el.type === "rectangle" ? { type: 3 } : null,
          ...(el.text ? { label: { text: el.text, fontSize: 18 } } : {}),
        };
      });

    const arrows = (result.connections ?? [])
      .filter((c) => c.from !== c.to && ids.has(c.from) && ids.has(c.to))
      .map((c) => {
        const from = aiElements.find((el) => el.id === c.from)!;
        const to = aiElements.find((el) => el.id === c.to)!;
        const path = routeArrow(from, to, aiElements);
        const start = path[0];

        return {
          type: "arrow",
          x: origin.x + start.x,
          y: origin.y + start.y,
          // Excalidraw only records the binding, it does not route the
          // arrow for us, so we give the full path (relative to start).
          points: path.map((p) => [p.x - start.x, p.y - start.y]),
          roundness: null, // sharp corners at the bends
          strokeColor: "#1e1e1e",
          start: { id: prefix + c.from },
          end: { id: prefix + c.to },
          ...(c.label ? { label: { text: c.label, fontSize: 16 } } : {}),
        };
      });

    const newElements = convertToExcalidrawElements(
      [...shapes, ...arrows] as any,
      { regenerateIds: false }
    );

    excalidrawAPI.updateScene({
      elements: [...excalidrawAPI.getSceneElements(), ...newElements],
      captureUpdate: CaptureUpdateAction.IMMEDIATELY,
    });

    excalidrawAPI.scrollToContent(newElements, { fitToContent: true });
  };

  // Keep the sidebar counter in sync with what the server says
  const updateCredits = (credits: unknown) => {
    if (typeof credits !== "number") return;
    setUserDetails((prev: any) => (prev ? { ...prev, credits } : prev));
  };

  const onClickGenerate = async () => {
    if (!excalidrawAPI || !userInput.trim() || loading || noCredits) return;

    setLoading(true);
    const position = getEmptyCanvasPosition();
    addAIPlaceholder(position);

    try {
      const result = await axios.post("/api/ai", {
        userInput,
        toolName: selectedTool,
      });

      removeAIPlaceholder();
      renderAIDiagram(result.data.diagramResult, position);
      updateCredits(result.data.credits);

      toast.add({ title: "Diagram generated", type: "success" });
      setUserInput("");
    } catch (error: any) {
      console.error("AI generation failed", error);
      removeAIPlaceholder();

      const status = error?.response?.status;
      updateCredits(error?.response?.data?.credits);
      toast.add({
        title:
          status === 403
            ? "AI credits finished"
            : status === 429
            ? "AI limit reached"
            : status === 503
              ? "AI busy"
              : "Error",
        description:
          error?.response?.data?.message ??
          "Diagram generate nahi ho paya. Dobara try karo.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute right-4 bottom-32 z-50 w-[380px] max-h-[620px] overflow-y-auto rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-medium">
          <Sparkles className="h-5 w-5 text-indigo-500" />
          AI Helper
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose} title="Close">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">Turn ideas into visuals in seconds</p>

      {/* Tools */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {AI_TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isSelected = selectedTool === tool.name;

          return (
            <button
              key={tool.name}
              type="button"
              onClick={() => setSelectedTool(tool.name)}
              disabled={loading}
              className={`flex items-center gap-2 rounded-md border p-2 text-left transition ${
                isSelected
                  ? "border-indigo-500 ring-1 ring-indigo-500"
                  : "hover:bg-accent"
              }`}
            >
              <div className={`rounded-sm p-2 ${tool.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h3 className="line-clamp-1 text-sm font-medium">
                  {tool.name}
                </h3>
                <p className="line-clamp-1 text-xs text-muted-foreground">
                  {tool.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Prompt */}
      <div className="mt-4 flex flex-col gap-2">
        <label className="text-sm font-medium">
          Describe what you want to create
        </label>
        <Textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="e.g. Customer onboarding flow with decision points"
          className="min-h-24"
          disabled={loading}
        />
        <Button
          onClick={onClickGenerate}
          disabled={loading || !userInput.trim() || noCredits}
          className="flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {loading ? "Generating..." : "Generate"}
        </Button>
        {noCredits ? (
          <p className="text-xs text-red-500">
            AI credits finished for this month. They reset on {resetDate}.
          </p>
        ) : userDetails ? (
          <p className="text-xs text-muted-foreground">
            {aiCredits} / {FREE_AI_CREDITS} AI credits left · 1 credit per generation
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default AIFloatingSidebar;
