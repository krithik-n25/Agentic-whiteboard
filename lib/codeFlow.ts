// Code -> flowchart: limits and languages, shared by the Code tab and /api/ai/code

// Keeps the AI fast and the flowchart readable
export const MAX_CODE_CHARS = 6000;
export const MAX_CODE_LINES = 200;

export const CODE_LANGUAGES = [
  "Auto-detect",
  "JavaScript / TypeScript",
  "Python",
  "Java",
  "C / C++",
  "C#",
  "Go",
] as const;

export type CodeStep = {
  lines: string | null; // e.g. "3" or "4-7"
  text: string;
};

export type CodeFlowResult = {
  title: string;
  mermaid: string;
  steps: CodeStep[];
};
