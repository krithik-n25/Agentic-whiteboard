"use client";

import React, { useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  convertToExcalidrawElements,
  CaptureUpdateAction,
} from "@excalidraw/excalidraw";
import {
  StickyNote,
  Smile,
  Shapes,
  LucideIcon,
  User,
  Users,
  Smartphone,
  Laptop,
  Server,
  Database,
  Cloud,
  Globe,
  Lock,
  Key,
  Mail,
  MessageSquare,
  Bell,
  Settings,
  Search,
  ShoppingCart,
  CreditCard,
  FileText,
  Folder,
  Image as ImageIcon,
  Calendar,
  Clock,
  Star,
  Heart,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  excalidrawAPI: any;
};

const EMOJIS = [
  "😀", "😂", "😍", "🤔", "😎", "😢", "😡", "🥳",
  "👍", "👎", "👏", "🙌", "🙏", "💪", "👀", "🤝",
  "❤️", "🔥", "⭐", "✨", "🎉", "💡", "✅", "❌",
  "⚠️", "❓", "📌", "📎", "📝", "📅", "⏰", "🚀",
  "🎯", "🏆", "💰", "📈", "📉", "🔒", "🔑", "💬",
];

const ICONS: { name: string; icon: LucideIcon }[] = [
  { name: "user", icon: User },
  { name: "users", icon: Users },
  { name: "smartphone", icon: Smartphone },
  { name: "laptop", icon: Laptop },
  { name: "server", icon: Server },
  { name: "database", icon: Database },
  { name: "cloud", icon: Cloud },
  { name: "globe", icon: Globe },
  { name: "lock", icon: Lock },
  { name: "key", icon: Key },
  { name: "mail", icon: Mail },
  { name: "message", icon: MessageSquare },
  { name: "bell", icon: Bell },
  { name: "settings", icon: Settings },
  { name: "search", icon: Search },
  { name: "cart", icon: ShoppingCart },
  { name: "card", icon: CreditCard },
  { name: "file", icon: FileText },
  { name: "folder", icon: Folder },
  { name: "image", icon: ImageIcon },
  { name: "calendar", icon: Calendar },
  { name: "clock", icon: Clock },
  { name: "star", icon: Star },
  { name: "heart", icon: Heart },
  { name: "check", icon: CheckCircle },
  { name: "x", icon: XCircle },
  { name: "alert", icon: AlertTriangle },
  { name: "idea", icon: Lightbulb },
];

const ICON_SIZE = 96;

function ExtrasPanel({ excalidrawAPI }: Props) {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [iconOpen, setIconOpen] = useState(false);

  /**
   * Scene coordinates of the middle of the visible canvas.
   */
  const getViewportCenter = () => {
    const { scrollX, scrollY, zoom, width, height } =
      excalidrawAPI.getAppState();
    return {
      x: -scrollX + width / 2 / zoom.value,
      y: -scrollY + height / 2 / zoom.value,
    };
  };

  /**
   * Add elements to the scene and select the first one.
   */
  const addToCanvas = (skeleton: any[]) => {
    const newElements = convertToExcalidrawElements(skeleton, {
      regenerateIds: false,
    });

    excalidrawAPI.updateScene({
      elements: [...excalidrawAPI.getSceneElements(), ...newElements],
      appState: { selectedElementIds: { [newElements[0].id]: true } },
      captureUpdate: CaptureUpdateAction.IMMEDIATELY,
    });

    excalidrawAPI.setActiveTool({ type: "selection" });
  };

  const addNote = () => {
    if (!excalidrawAPI) return;
    const center = getViewportCenter();

    addToCanvas([
      {
        type: "rectangle",
        id: `note-${Date.now()}`,
        x: center.x - 100,
        y: center.y - 100,
        width: 200,
        height: 200,
        backgroundColor: "#fff3bf",
        strokeColor: "#f59f00",
        fillStyle: "solid",
        roundness: { type: 3 },
        label: { text: "New note", fontSize: 20 },
      },
    ]);
  };

  const addEmoji = (emoji: string) => {
    if (!excalidrawAPI) return;
    const center = getViewportCenter();

    addToCanvas([
      {
        type: "text",
        id: `emoji-${Date.now()}`,
        x: center.x - 32,
        y: center.y - 40,
        text: emoji,
        fontSize: 64,
      },
    ]);
    setEmojiOpen(false);
  };

  /**
   * Render the lucide icon to SVG, register it as an Excalidraw file
   * and add an image element pointing to it.
   */
  const addIcon = (name: string, Icon: LucideIcon) => {
    if (!excalidrawAPI) return;
    const center = getViewportCenter();

    const svg = renderToStaticMarkup(
      <Icon size={ICON_SIZE} color="#1e1e1e" strokeWidth={1.5} />
    );
    const fileId = `lucide-icon-${name}`;

    excalidrawAPI.addFiles([
      {
        id: fileId,
        dataURL: `data:image/svg+xml;base64,${btoa(svg)}`,
        mimeType: "image/svg+xml",
        created: Date.now(),
      },
    ]);

    addToCanvas([
      {
        type: "image",
        id: `icon-${Date.now()}`,
        fileId,
        x: center.x - ICON_SIZE / 2,
        y: center.y - ICON_SIZE / 2,
        width: ICON_SIZE,
        height: ICON_SIZE,
      },
    ]);
    setIconOpen(false);
  };

  return (
    // Dock at the bottom center of the canvas (no longer in the left toolbar)
    <div className="extras-dock">
      {/* Note */}
      <button
        className="tool-button"
        style={{ "--tool-color": "#f59f00" } as React.CSSProperties}
        onClick={addNote}
        title="Sticky note"
      >
        <StickyNote size={19} strokeWidth={1.8} />
        <span className="tool-tooltip">Note</span>
      </button>

      {/* Emoji */}
      <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
        <PopoverTrigger
          className="tool-button"
          style={{ "--tool-color": "#eab308" } as React.CSSProperties}
          title="Emoji"
        >
          <Smile size={19} strokeWidth={1.8} />
          <span className="tool-tooltip">Emoji</span>
        </PopoverTrigger>
        <PopoverContent side="top" sideOffset={12} className="w-80 gap-2">
          <h3 className="text-sm font-medium">Add emoji</h3>
          <div className="grid grid-cols-8 gap-1">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => addEmoji(emoji)}
                className="rounded-md p-1 text-2xl transition hover:bg-gray-100"
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Icons */}
      <Popover open={iconOpen} onOpenChange={setIconOpen}>
        <PopoverTrigger
          className="tool-button"
          style={{ "--tool-color": "#0ea5e9" } as React.CSSProperties}
          title="Icons"
        >
          <Shapes size={19} strokeWidth={1.8} />
          <span className="tool-tooltip">Icons</span>
        </PopoverTrigger>
        <PopoverContent side="top" sideOffset={12} className="w-80 gap-2">
          <h3 className="text-sm font-medium">Add icon</h3>
          <div className="grid grid-cols-7 gap-1">
            {ICONS.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => addIcon(name, Icon)}
                title={name}
                className="flex items-center justify-center rounded-md p-2 transition hover:bg-gray-100"
              >
                <Icon size={20} strokeWidth={1.6} />
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ExtrasPanel;
