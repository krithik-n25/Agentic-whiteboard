import {
  Workflow,
  Network,
  Brain,
  Monitor,
  Smartphone,
  LucideIcon,
} from "lucide-react";

export type AITool = {
  name: string;
  description: string;
  icon: LucideIcon;
  color: string; // tailwind text + bg classes
  prompt: string;
};

/**
 * AI tools shown in the AI floating sidebar.
 * Client sends only the tool `name`, server picks the prompt from here.
 */
export const AI_TOOLS: AITool[] = [
  {
    name: "Flowchart",
    description: "Step by step process with decisions",
    icon: Workflow,
    color: "text-blue-600 bg-blue-50",
    prompt: `You create clear flowcharts.
- Use "ellipse" for Start and End.
- Use "rectangle" for process steps.
- Use "diamond" for decisions (yes/no questions). Label outgoing connections "Yes" / "No".
- Flow top to bottom. Main path in a single vertical column, alternate branches to the right.`,
  },
  {
    name: "Architecture Diagram",
    description: "System components and how they talk",
    icon: Network,
    color: "text-purple-600 bg-purple-50",
    prompt: `You create software architecture diagrams.
- Each component (client, API, service, database, queue, cache, third party) is a "rectangle". Use "ellipse" for databases.
- Arrange in layers from left to right: clients -> gateway/API -> services -> data stores.
- Connections describe the communication (e.g. "REST", "SQL", "events").`,
  },
  {
    name: "Mind Map",
    description: "Central idea with branching topics",
    icon: Brain,
    color: "text-pink-600 bg-pink-50",
    prompt: `You create mind maps.
- One central "ellipse" with the main idea in the middle.
- 4 to 7 main topics as "rectangle" around it, each connected from the center.
- Optional sub topics connected from main topics, placed further out.`,
  },
  {
    name: "Web Wireframe",
    description: "Desktop page layout mockup",
    icon: Monitor,
    color: "text-emerald-600 bg-emerald-50",
    prompt: `You create low fidelity desktop web wireframes.
- First element: a large "rectangle" page frame 1200 wide, white background, no text.
- Inside it, place sections as "rectangle" elements: navbar, hero, content cards, footer, etc.
- Use "text" elements for headings and short copy. Buttons are small rectangles with a label.
- Every element must be fully inside the page frame. No connections needed (empty array).`,
  },
  {
    name: "Mobile Wireframe",
    description: "Phone screen layout mockup",
    icon: Smartphone,
    color: "text-orange-600 bg-orange-50",
    prompt: `You create low fidelity mobile app wireframes.
- First element: a "rectangle" phone frame of width 375 and height 812, white background, no text.
- Inside it, place UI parts: status/header bar, inputs, buttons, lists, bottom nav as "rectangle" elements with labels.
- Use "text" elements for titles. Every element must be fully inside the phone frame.
- No connections needed (empty array).`,
  },
];

export const getAITool = (name: string) =>
  AI_TOOLS.find((tool) => tool.name === name);
