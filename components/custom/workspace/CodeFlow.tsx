"use client";

import React, { useContext, useRef, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { GitBranch, Loader2, MonitorPlay, Sparkles, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { UserDetailContext } from "@/context/UserDetailContext";
import { FREE_AI_CREDITS, getNextCreditReset } from "@/lib/plans";
import {
  CODE_LANGUAGES,
  MAX_CODE_CHARS,
  MAX_CODE_LINES,
  type CodeFlowResult,
} from "@/lib/codeFlow";

type Props = {
  excalidrawAPI: any;
  // Called with the new elements, so the page can open the whiteboard and zoom to them
  onFlowchartReady: (elements: any[]) => void;
};

const EXAMPLE_CODE = `function sumOfEvens(numbers) {
  let total = 0;
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] % 2 === 0) {
      total += numbers[i];
    }
  }
  return total;
}`;

// Colors by shape, so start/end, steps and decisions are easy to tell apart
const SHAPE_COLORS: Record<string, string> = {
  ellipse: "#b2f2bb", // start / end
  rectangle: "#a5d8ff", // step
  diamond: "#ffec99", // decision / loop condition
};

function CodeFlow({ excalidrawAPI, onFlowchartReady }: Props) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<string>(CODE_LANGUAGES[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CodeFlowResult | null>(null);
  // Ids of the last flowchart on the canvas, for "Show on whiteboard"
  const [flowIds, setFlowIds] = useState<string[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const aiCredits = Number(userDetails?.credits ?? 0);
  const noCredits = !!userDetails && aiCredits <= 0;
  const resetDate = format(getNextCreditReset(), "d MMM");

  const lineCount = code ? code.split("\n").length : 1;
  const tooLong = code.length > MAX_CODE_CHARS || lineCount > MAX_CODE_LINES;

  const updateCredits = (credits: unknown) => {
    if (typeof credits !== "number") return;
    setUserDetails((prev: any) => (prev ? { ...prev, credits } : prev));
  };

  /* ---------- editor ---------- */

  // Tab inserts 2 spaces instead of leaving the box
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const el = e.currentTarget;
    const { selectionStart, selectionEnd } = el;
    const next = code.slice(0, selectionStart) + "  " + code.slice(selectionEnd);
    setCode(next);
    requestAnimationFrame(() => el.setSelectionRange(selectionStart + 2, selectionStart + 2));
  };

  // Line numbers scroll together with the code
  const onScroll = () => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Click a step: select the lines it talks about
  const highlightLines = (lines: string | null) => {
    const el = textareaRef.current;
    const match = lines?.match(/(\d+)(?:\s*-\s*(\d+))?/);
    if (!el || !match) return;

    const all = code.split("\n");
    const from = Math.max(1, Number(match[1]));
    const to = Math.min(all.length, Number(match[2] ?? match[1]));
    if (from > all.length) return;

    const start = all.slice(0, from - 1).join("\n").length + (from > 1 ? 1 : 0);
    const end = all.slice(0, to).join("\n").length;
    el.focus();
    el.setSelectionRange(start, end);
  };

  /* ---------- flowchart on the canvas ---------- */

  const drawFlowchart = async (mermaid: string) => {
    // Browser only (they use the DOM), so imported here
    const { parseMermaidToExcalidraw } = await import("@excalidraw/mermaid-to-excalidraw");
    const { convertToExcalidrawElements, CaptureUpdateAction, getCommonBounds } =
      await import("@excalidraw/excalidraw");

    const { elements: skeleton, files } = await parseMermaidToExcalidraw(mermaid, {
      themeVariables: { fontSize: "16px" },
    });

    // regenerateIds: Mermaid ids (A, B...) could clash with elements already on the board
    let elements: any[] = convertToExcalidrawElements(skeleton as any, { regenerateIds: true });

    elements = elements.map((el) =>
      SHAPE_COLORS[el.type] && !el.containerId
        ? { ...el, backgroundColor: SHAPE_COLORS[el.type], fillStyle: "solid", strokeColor: "#1e1e1e" }
        : el
    );

    // Place it to the right of what is already there, or in the middle of the view
    const existing = excalidrawAPI.getSceneElements();
    const [flowMinX, flowMinY] = getCommonBounds(elements);
    let target: { x: number; y: number };
    if (existing.length > 0) {
      const [, minY, maxX] = getCommonBounds(existing);
      target = { x: maxX + 200, y: minY };
    } else {
      const { scrollX, scrollY, zoom, width, height } = excalidrawAPI.getAppState();
      target = {
        x: -scrollX + width / 2 / zoom.value - 200,
        y: -scrollY + height / 4 / zoom.value,
      };
    }
    const dx = target.x - flowMinX;
    const dy = target.y - flowMinY;
    elements = elements.map((el) => ({ ...el, x: el.x + dx, y: el.y + dy }));

    if (files && Object.keys(files).length > 0) {
      excalidrawAPI.addFiles(Object.values(files));
    }
    excalidrawAPI.updateScene({
      elements: [...excalidrawAPI.getSceneElementsIncludingDeleted(), ...elements],
      captureUpdate: CaptureUpdateAction.IMMEDIATELY, // Ctrl+Z removes it
    });

    return elements;
  };

  const onGenerate = async () => {
    if (!excalidrawAPI || !code.trim() || loading || noCredits || tooLong) return;
    setLoading(true);

    try {
      const res = await axios.post("/api/ai/code", { code, language });
      updateCredits(res.data.credits);
      const flow: CodeFlowResult = res.data.flow;

      let elements: any[];
      try {
        elements = await drawFlowchart(flow.mermaid);
      } catch (error) {
        // AI answered, but its Mermaid could not be drawn
        console.error("Mermaid could not be drawn", error, flow.mermaid);
        toast.add({
          title: "Flowchart nahi ban paya",
          description: "AI ka jawab draw nahi ho saka. Dobara try karo.",
          type: "error",
        });
        return;
      }

      setResult(flow);
      setFlowIds(elements.map((el) => el.id));
      toast.add({ title: "Flowchart ready", description: flow.title, type: "success" });
      onFlowchartReady(elements);
    } catch (error: any) {
      console.error("Code flowchart failed", error);
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
                : status === 422
                  ? "Ye code nahi lagta"
                  : "Error",
        description: error?.response?.data?.message ?? "Flowchart generate nahi ho paya. Dobara try karo.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const showOnWhiteboard = () => {
    const onCanvas = excalidrawAPI
      ?.getSceneElements()
      .filter((el: any) => flowIds.includes(el.id));
    if (!onCanvas?.length) {
      toast.add({ title: "Flowchart board pe nahi mila", description: "Shayad delete ho gaya.", type: "error" });
      return;
    }
    onFlowchartReady(onCanvas);
  };

  /* ---------- UI ---------- */

  return (
    <div className="grid h-[calc(100vh-85px)] grid-cols-1 gap-4 overflow-auto p-4 lg:grid-cols-[1fr_380px]">
      {/* Code */}
      <div className="flex min-h-[420px] flex-col rounded-xl border bg-card text-card-foreground">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b p-3">
          <div>
            <h2 className="flex items-center gap-2 font-semibold">
              <GitBranch className="h-4 w-4 text-indigo-500" />
              Code to Flowchart
            </h2>
            <p className="text-xs text-muted-foreground">
              Paste code with loops and conditions. AI draws how it runs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={loading}
              className="h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground disabled:opacity-50"
            >
              {CODE_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            {!code && (
              <Button variant="outline" size="sm" onClick={() => setCode(EXAMPLE_CODE)}>
                Try example
              </Button>
            )}
            {code && (
              <Button variant="ghost" size="sm" onClick={() => setCode("")} disabled={loading} title="Clear">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Editor with line numbers */}
        <div className="flex min-h-0 flex-1 font-mono text-sm leading-6">
          <div
            ref={gutterRef}
            aria-hidden
            className="select-none overflow-hidden border-r bg-muted px-3 py-3 text-right text-muted-foreground"
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={onKeyDown}
            onScroll={onScroll}
            disabled={loading}
            spellCheck={false}
            wrap="off"
            placeholder={"// Paste your code here\nfor (let i = 0; i < 5; i++) {\n  console.log(i);\n}"}
            className="min-h-0 flex-1 resize-none overflow-auto bg-card p-3 leading-6 text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t p-3">
          <span className={`text-xs ${tooLong ? "text-red-500" : "text-muted-foreground"}`}>
            {lineCount} / {MAX_CODE_LINES} lines · {code.length} / {MAX_CODE_CHARS} characters
          </span>
          <div className="flex flex-col items-end gap-1">
            <Button
              onClick={onGenerate}
              disabled={loading || !code.trim() || noCredits || tooLong}
              className="gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Generating..." : "Generate Flowchart"}
            </Button>
            {noCredits ? (
              <p className="text-xs text-red-500">
                AI credits finished for this month. They reset on {resetDate}.
              </p>
            ) : userDetails ? (
              <p className="text-xs text-muted-foreground">
                {aiCredits} / {FREE_AI_CREDITS} AI credits left · 1 credit per flowchart
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="flex flex-col rounded-xl border bg-card text-card-foreground">
        <div className="border-b p-3">
          <h2 className="font-semibold">How it works</h2>
          <p className="text-xs text-muted-foreground">
            {result ? result.title : "Steps appear here after you generate a flowchart."}
          </p>
        </div>

        <div className="flex-1 overflow-auto p-3">
          {!result ? (
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="mr-2 inline-block h-3 w-3 rounded-full bg-[#b2f2bb] align-middle" />Start / End</li>
              <li><span className="mr-2 inline-block h-3 w-3 rounded-sm bg-[#a5d8ff] align-middle" />Step (a statement)</li>
              <li><span className="mr-2 inline-block h-3 w-3 rotate-45 bg-[#ffec99] align-middle" />Decision (if / loop condition)</li>
            </ul>
          ) : (
            <ol className="space-y-2">
              {result.steps.map((step, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => highlightLines(step.lines)}
                    className="w-full rounded-lg border p-2 text-left text-sm transition hover:border-indigo-300 hover:bg-accent"
                    title={step.lines ? "Highlight these lines in the code" : undefined}
                  >
                    <span className="mr-2 font-semibold text-indigo-600">{i + 1}.</span>
                    {step.lines && (
                      <span className="mr-2 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                        line {step.lines}
                      </span>
                    )}
                    {step.text}
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>

        {result && (
          <div className="border-t p-3">
            <Button variant="outline" className="w-full gap-2" onClick={showOnWhiteboard}>
              <MonitorPlay className="h-4 w-4" /> Show on whiteboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CodeFlow;
