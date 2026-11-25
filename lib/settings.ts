// User settings, saved in this browser (localStorage). Theme itself is kept by next-themes.
import { useSyncExternalStore } from "react";
import { SETTINGS_STORAGE_KEY, TEXT_SIZE_PX, type TextSize } from "./settingsBoot";

export { TEXT_SIZE_PX };
export type { TextSize };

export type AppFont = "inter" | "poppins" | "nunito" | "system";
export type CanvasFont = "hand" | "normal" | "code";

export type Settings = {
  textSize: TextSize;
  font: AppFont;
  grid: boolean;
  canvasFont: CanvasFont; // default font for new text on the board
  autosaveSeconds: number;
};

export const DEFAULT_SETTINGS: Settings = {
  textSize: "md",
  font: "inter",
  grid: false,
  canvasFont: "hand",
  autosaveSeconds: 10,
};

export const AUTOSAVE_OPTIONS = [5, 10, 30];

const STORAGE_KEY = SETTINGS_STORAGE_KEY;
const CHANGE_EVENT = "app-settings-change";

// Storage can be blocked (private mode, disabled site data), so every access is guarded
export const getSettings = (): Settings => {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const updateSettings = (changes: Partial<Settings>) => {
  const next = { ...getSettings(), ...changes };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Not saved, but still applied for this visit
  }
  cachedRaw = null;
  cached = next;
  applyAppearance(next);
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

// Text size and font live on <html>, so the whole app (Tailwind rem sizes) follows
export const applyAppearance = (settings: Settings) => {
  const root = document.documentElement;
  root.style.fontSize = `${TEXT_SIZE_PX[settings.textSize] ?? 16}px`;
  root.dataset.font = settings.font;
};

/* ---------- React hook ---------- */

// useSyncExternalStore needs the same object back while nothing changed
let cached: Settings = DEFAULT_SETTINGS;
let cachedRaw: string | null = null;

const readSnapshot = () => {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return cached;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cached = getSettings();
  }
  return cached;
};

const subscribe = (onChange: () => void) => {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange); // changed in another tab
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};

export const useSettings = () =>
  useSyncExternalStore(subscribe, readSnapshot, () => DEFAULT_SETTINGS);
