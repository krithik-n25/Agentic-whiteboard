"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import {
  CaptureUpdateAction,
  FONT_FAMILY,
  newElementWith,
  restoreElements,
  ROUNDNESS,
} from "@excalidraw/excalidraw";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  BringToFront,
  Copy,
  Ellipsis,
  GripVertical,
  LockKeyhole,
  SendToBack,
  Trash2,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/toast";

// Where to draw the toolbar, in viewport (screen) pixels
export type FloatingAnchor = {
  centerX: number;
  top: number; // top edge of the selection
  bottom: number; // bottom edge of the selection
  canvasTop: number; // top edge of the canvas, the toolbar must stay below it
};

type Props = {
  excalidrawAPI: any;
  selectedElements: any[];
  anchor: FloatingAnchor;
};

type Kind = "shape" | "linear" | "freedraw" | "text" | "image" | "mixed";

const SHAPES = ["rectangle", "diamond", "ellipse"];
const LINEAR = ["line", "arrow"];

const kindOf = (type: string): Kind => {
  if (SHAPES.includes(type)) return "shape";
  if (LINEAR.includes(type)) return "linear";
  if (type === "freedraw") return "freedraw";
  if (type === "text") return "text";
  return "image"; // image, embeddable, frame...: only opacity
};

const STROKE_COLORS = ["#1e1e1e", "#e03131", "#2f9e44", "#1971c2", "#f08c00", "#9c36b5"];
const BACKGROUND_COLORS = ["transparent", "#ffc9c9", "#b2f2bb", "#a5d8ff", "#ffec99", "#eebefa"];

const STROKE_WIDTHS = [
  { label: "Thin", value: 1 },
  { label: "Bold", value: 2 },
  { label: "Extra", value: 4 },
];
const STROKE_STYLES = ["solid", "dashed", "dotted"];
const FILL_STYLES = [
  { label: "Hachure", value: "hachure" },
  { label: "Cross", value: "cross-hatch" },
  { label: "Solid", value: "solid" },
];
const SLOPPINESS = [
  { label: "Architect", value: 0 },
  { label: "Artist", value: 1 },
  { label: "Cartoonist", value: 2 },
];
const FONT_SIZES = [
  { label: "S", value: 16 },
  { label: "M", value: 20 },
  { label: "L", value: 28 },
  { label: "XL", value: 36 },
];
const FONTS = [
  { label: "Hand-drawn", value: FONT_FAMILY.Excalifont },
  { label: "Normal", value: FONT_FAMILY.Nunito },
  { label: "Code", value: FONT_FAMILY["Comic Shanns"] },
];
const ARROWHEADS = [
  { label: "None", value: null },
  { label: "Arrow", value: "arrow" },
  { label: "Triangle", value: "triangle" },
  { label: "Dot", value: "dot" },
];

// These change how big a text is, so its box has to be measured again
const TEXT_SIZE_PROPS = ["fontSize", "fontFamily", "textAlign"];
// A shape's label (bound text) follows these, like in Excalidraw itself
const LABEL_FOLLOWS = ["strokeColor", "opacity"];

const randomSeed = () => Math.floor(Math.random() * 2 ** 31);

function FloatingProperties({ excalidrawAPI, selectedElements, anchor }: Props) {
  const barRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // How far the user dragged the bar away from its automatic spot.
  // Whiteboard remounts this component for a new selection, so it starts at 0 again.
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragStartRef = useRef<{ pointerX: number; pointerY: number; x: number; y: number } | null>(null);

  const onDragStart = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Pointer capture: moves keep coming here even when the mouse leaves the handle
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = { pointerX: e.clientX, pointerY: e.clientY, ...dragOffset };
  };

  const onDragMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const start = dragStartRef.current;
    if (!start) return;
    setDragOffset({
      x: start.x + e.clientX - start.pointerX,
      y: start.y + e.clientY - start.pointerY,
    });
  };

  const onDragEnd = (e: React.PointerEvent<HTMLButtonElement>) => {
    dragStartRef.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Measure the bar so it can be centered and kept inside the screen
  useLayoutEffect(() => {
    if (!barRef.current) return;
    const { offsetWidth, offsetHeight } = barRef.current;
    if (offsetWidth !== size.width || offsetHeight !== size.height) {
      setSize({ width: offsetWidth, height: offsetHeight });
    }
  });

  const first = selectedElements[0];
  const kinds = new Set(selectedElements.map((el) => kindOf(el.type)));
  const kind: Kind = kinds.size === 1 ? [...kinds][0] : "mixed";

  /* ---------- helpers ---------- */

  const getScene = (): any[] => excalidrawAPI.getSceneElementsIncludingDeleted();
  const selectedIds = () => new Set(selectedElements.map((el) => el.id));

  // Selected elements + the text labels inside selected shapes
  const withBoundText = (scene: any[], ids: Set<string>) => {
    const all = new Set(ids);
    scene.forEach((el) => {
      if (el.containerId && ids.has(el.containerId)) all.add(el.id);
    });
    return all;
  };

  const commit = (elements: any[], appState?: any) => {
    excalidrawAPI.updateScene({
      elements,
      ...(appState ? { appState } : {}),
      captureUpdate: CaptureUpdateAction.IMMEDIATELY, // undo (Ctrl+Z) works
    });
  };

  /* ---------- property change ---------- */

  // updates can be one object for all, or a function to give each element its own value
  const changeProps = (updates: Record<string, any> | ((el: any) => Record<string, any>)) => {
    const scene = getScene();
    const ids = selectedIds();
    const updatesFor = (el: any) => (typeof updates === "function" ? updates(el) : updates);
    const keys = Object.keys(updatesFor(first));
    const followIds = keys.some((key) => LABEL_FOLLOWS.includes(key))
      ? withBoundText(scene, ids)
      : ids;

    let next = scene.map((el) => {
      if (ids.has(el.id)) return newElementWith(el, updatesFor(el) as any);
      if (followIds.has(el.id)) {
        // Label of a selected shape: only color / opacity
        const container = scene.find((c) => c.id === el.containerId);
        const labelUpdates = Object.fromEntries(
          Object.entries(updatesFor(container ?? el)).filter(([key]) => LABEL_FOLLOWS.includes(key))
        );
        return newElementWith(el, labelUpdates as any);
      }
      return el;
    });

    // Font / size / align: measure the text box again, or the text overflows it.
    // The whole scene goes to restoreElements so arrow bindings are not "repaired" away.
    if (keys.some((key) => TEXT_SIZE_PROPS.includes(key))) {
      const measured = new Map(
        restoreElements(next, null, { refreshDimensions: true }).map((el: any) => [el.id, el])
      );
      next = next.map((el) => {
        const fresh: any = measured.get(el.id);
        if (!ids.has(el.id) || el.type !== "text" || !fresh) return el;
        return newElementWith(el, {
          x: fresh.x,
          y: fresh.y,
          width: fresh.width,
          height: fresh.height,
        } as any);
      });
    }

    commit(next);
  };

  /* ---------- actions ---------- */

  const handleDelete = () => {
    const scene = getScene();
    const deleteIds = withBoundText(scene, selectedIds());

    const next = scene.map((el) => {
      if (deleteIds.has(el.id)) return newElementWith(el, { isDeleted: true });

      // Arrows connected to a deleted shape should not point at it anymore
      const updates: any = {};
      if (el.startBinding && deleteIds.has(el.startBinding.elementId)) updates.startBinding = null;
      if (el.endBinding && deleteIds.has(el.endBinding.elementId)) updates.endBinding = null;
      // Shapes should forget deleted arrows / labels
      if (el.boundElements?.some((b: any) => deleteIds.has(b.id))) {
        updates.boundElements = el.boundElements.filter((b: any) => !deleteIds.has(b.id));
      }
      return Object.keys(updates).length ? newElementWith(el, updates) : el;
    });

    commit(next, { selectedElementIds: {} });
  };

  const handleDuplicate = () => {
    const scene = getScene();
    const ids = withBoundText(scene, selectedIds());
    const originals = scene.filter((el) => ids.has(el.id) && !el.isDeleted);

    // New ids for every copy, and new group ids so the copy is its own group
    const idMap = new Map<string, string>();
    originals.forEach((el) => idMap.set(el.id, crypto.randomUUID()));
    const groupMap = new Map<string, string>();
    const newGroupId = (groupId: string) => {
      if (!groupMap.has(groupId)) groupMap.set(groupId, crypto.randomUUID());
      return groupMap.get(groupId)!;
    };
    // Only keep a connection if the other end was copied too
    const copyBinding = (binding: any) =>
      binding && idMap.has(binding.elementId)
        ? { ...binding, elementId: idMap.get(binding.elementId) }
        : null;

    const copies = originals.map((el) => ({
      ...el,
      id: idMap.get(el.id),
      x: el.x + 20,
      y: el.y + 20,
      seed: randomSeed(),
      versionNonce: randomSeed(),
      version: 1,
      updated: Date.now(),
      index: null, // Excalidraw gives it a fresh layer index
      locked: false,
      groupIds: (el.groupIds ?? []).map(newGroupId),
      containerId: el.containerId ? idMap.get(el.containerId) ?? null : null,
      boundElements: el.boundElements
        ? el.boundElements
            .filter((b: any) => idMap.has(b.id))
            .map((b: any) => ({ ...b, id: idMap.get(b.id) }))
        : null,
      ...(LINEAR.includes(el.type)
        ? { startBinding: copyBinding(el.startBinding), endBinding: copyBinding(el.endBinding) }
        : {}),
    }));

    // Select the copies (labels are selected through their shape)
    const selectedElementIds = Object.fromEntries(
      copies.filter((el) => !el.containerId).map((el) => [el.id, true])
    );

    commit([...scene, ...copies], { selectedElementIds });
  };

  // Last in the array = drawn on top. filter (not find) keeps every selected element.
  const handleOrder = (direction: "front" | "back") => {
    const scene = getScene();
    const ids = withBoundText(scene, selectedIds());
    const moving = scene.filter((el) => ids.has(el.id)).map((el) => newElementWith(el, {}, true)); // force: bump version so undo / save see it
    const rest = scene.filter((el) => !ids.has(el.id));

    commit(direction === "front" ? [...rest, ...moving] : [...moving, ...rest]);
  };

  const handleLock = () => {
    const scene = getScene();
    const ids = withBoundText(scene, selectedIds());
    const next = scene.map((el) => (ids.has(el.id) ? newElementWith(el, { locked: true }) : el));

    // A locked element cannot be selected, so the selection is cleared
    commit(next, { selectedElementIds: {} });
    toast.add({
      title: "Locked",
      description: "To unlock: right-click the canvas > Unlock all",
      type: "success",
    });
  };

  /* ---------- position ---------- */

  const GAP = 12;
  const fitsAbove = anchor.top - size.height - GAP > anchor.canvasTop + 8;
  const autoTop = fitsAbove ? anchor.top - size.height - GAP : anchor.bottom + GAP;
  const autoLeft = anchor.centerX - size.width / 2;
  // Automatic spot + drag, always kept inside the screen
  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));
  const left = clamp(autoLeft + dragOffset.x, 8, window.innerWidth - size.width - 8);
  const top = clamp(autoTop + dragOffset.y, 8, window.innerHeight - size.height - 8);

  /* ---------- UI ---------- */

  const isShape = kind === "shape";
  const isLinear = kind === "linear";
  const isText = kind === "text";
  const hasStroke = kind !== "image";
  const hasLineOptions = isShape || isLinear || kind === "freedraw";
  const hasMoreOptions = hasLineOptions || isText || kind === "image" || kind === "mixed";
  const isArrow = selectedElements.every((el) => el.type === "arrow");
  const canRound = selectedElements.every((el) => el.type === "rectangle" || el.type === "diamond");
  const fillVisible = isShape && first.backgroundColor !== "transparent";

  return (
    <div
      ref={barRef}
      className="floating-properties"
      // hidden for the first frame, until the bar is measured
      style={{ left, top, visibility: size.width ? "visible" : "hidden" }}
    >
      <button
        type="button"
        className="fp-grip"
        title="Drag to move"
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onPointerCancel={onDragEnd}
      >
        <GripVertical size={14} />
      </button>
      {hasStroke && (
        <ColorPicker
          title={isText ? "Text color" : "Stroke color"}
          colors={STROKE_COLORS}
          value={first.strokeColor}
          onChange={(color) => changeProps({ strokeColor: color })}
        />
      )}

      {isShape && (
        <ColorPicker
          title="Background"
          colors={BACKGROUND_COLORS}
          value={first.backgroundColor}
          onChange={(color) => changeProps({ backgroundColor: color })}
        />
      )}

      {hasMoreOptions && (
        <Popover>
          <PopoverTrigger className="fp-button" title="More options">
            <Ellipsis size={16} />
          </PopoverTrigger>
          <PopoverContent side="bottom" className="w-64 gap-3 p-3">
            {isText && (
              <>
                <OptionRow
                  label="Font"
                  options={FONTS}
                  value={first.fontFamily}
                  onChange={(value) => changeProps({ fontFamily: value })}
                />
                <OptionRow
                  label="Size"
                  options={FONT_SIZES}
                  value={first.fontSize}
                  onChange={(value) => changeProps({ fontSize: value })}
                />
                <div className="fp-row">
                  <span className="fp-label">Align</span>
                  <div className="fp-options">
                    {[
                      { value: "left", Icon: AlignLeft },
                      { value: "center", Icon: AlignCenter },
                      { value: "right", Icon: AlignRight },
                    ].map(({ value, Icon }) => (
                      <button
                        key={value}
                        type="button"
                        title={value}
                        className={`fp-option ${first.textAlign === value ? "active" : ""}`}
                        onClick={() => changeProps({ textAlign: value })}
                      >
                        <Icon size={14} />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {hasLineOptions && (
              <OptionRow
                label="Stroke width"
                options={STROKE_WIDTHS}
                value={first.strokeWidth}
                onChange={(value) => changeProps({ strokeWidth: value })}
              />
            )}

            {(isShape || isLinear) && (
              <>
                <OptionRow
                  label="Stroke style"
                  options={STROKE_STYLES.map((s) => ({ label: s, value: s }))}
                  value={first.strokeStyle}
                  onChange={(value) => changeProps({ strokeStyle: value })}
                />
                <OptionRow
                  label="Sloppiness"
                  options={SLOPPINESS}
                  value={first.roughness}
                  onChange={(value) => changeProps({ roughness: value })}
                />
              </>
            )}

            {fillVisible && (
              <OptionRow
                label="Fill"
                options={FILL_STYLES}
                value={first.fillStyle}
                onChange={(value) => changeProps({ fillStyle: value })}
              />
            )}

            {canRound && (
              <OptionRow
                label="Edges"
                options={[
                  { label: "Sharp", value: "sharp" },
                  { label: "Round", value: "round" },
                ]}
                value={first.roundness ? "round" : "sharp"}
                onChange={(value) =>
                  // Excalidraw rounds rectangles and diamonds in different ways
                  changeProps((el) => ({
                    roundness:
                      value === "round"
                        ? {
                            type:
                              el.type === "diamond"
                                ? ROUNDNESS.PROPORTIONAL_RADIUS
                                : ROUNDNESS.ADAPTIVE_RADIUS,
                          }
                        : null,
                  }))
                }
              />
            )}

            {isArrow && (
              <>
                <OptionRow
                  label="Start"
                  options={ARROWHEADS}
                  value={first.startArrowhead}
                  onChange={(value) => changeProps({ startArrowhead: value })}
                />
                <OptionRow
                  label="End"
                  options={ARROWHEADS}
                  value={first.endArrowhead}
                  onChange={(value) => changeProps({ endArrowhead: value })}
                />
              </>
            )}

            <div className="fp-row">
              <span className="fp-label">Opacity {first.opacity}%</span>
              <input
                type="range"
                min={10}
                max={100}
                step={10}
                value={first.opacity}
                onChange={(e) => changeProps({ opacity: Number(e.target.value) })}
                className="w-full accent-indigo-500"
              />
            </div>
          </PopoverContent>
        </Popover>
      )}

      <div className="fp-divider" />

      <button type="button" className="fp-button" title="Duplicate" onClick={handleDuplicate}>
        <Copy size={16} />
      </button>
      <button type="button" className="fp-button" title="Bring to front" onClick={() => handleOrder("front")}>
        <BringToFront size={16} />
      </button>
      <button type="button" className="fp-button" title="Send to back" onClick={() => handleOrder("back")}>
        <SendToBack size={16} />
      </button>
      <button
        type="button"
        className="fp-button"
        title="Lock (unlock: right-click the canvas > Unlock all)"
        onClick={handleLock}
      >
        <LockKeyhole size={16} />
      </button>
      <button type="button" className="fp-button fp-danger" title="Delete" onClick={handleDelete}>
        <Trash2 size={16} />
      </button>
    </div>
  );
}

/* ---------- small pieces ---------- */

function ColorPicker({
  title,
  colors,
  value,
  onChange,
}: {
  title: string;
  colors: string[];
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger className="fp-button" title={title}>
        <span className="fp-swatch" style={swatchStyle(value)} />
      </PopoverTrigger>
      <PopoverContent side="bottom" className="w-auto gap-2 p-3">
        <span className="fp-label">{title}</span>
        <div className="flex gap-1.5">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              title={color}
              className={`fp-swatch fp-swatch-button ${value === color ? "active" : ""}`}
              style={swatchStyle(color)}
              onClick={() => onChange(color)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Transparent shows as a checkerboard
const swatchStyle = (color: string): React.CSSProperties =>
  color === "transparent"
    ? {
        backgroundImage:
          "linear-gradient(45deg,#ddd 25%,transparent 25%,transparent 75%,#ddd 75%),linear-gradient(45deg,#ddd 25%,transparent 25%,transparent 75%,#ddd 75%)",
        backgroundSize: "8px 8px",
        backgroundPosition: "0 0,4px 4px",
        backgroundColor: "#fff",
      }
    : { backgroundColor: color };

function OptionRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: any }[];
  value: any;
  onChange: (value: any) => void;
}) {
  return (
    <div className="fp-row">
      <span className="fp-label">{label}</span>
      <div className="fp-options">
        {options.map((option) => (
          <button
            key={String(option.value)}
            type="button"
            className={`fp-option ${value === option.value ? "active" : ""}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FloatingProperties;
