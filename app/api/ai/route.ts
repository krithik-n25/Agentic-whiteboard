import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getAITool } from "@/lib/aiTools";
import { refundAICredit, spendAICredit } from "@/lib/credits";
import { aiErrorResponse, generateWithFallback, getProviders, ProviderError } from "@/lib/aiProviders";

const CANVAS_RULES = `
CANVAS RULES (Excalidraw):
- Coordinates start from (0, 0) at the top-left of the diagram. Use positive x and y only.
- Elements must NEVER overlap. Keep at least 60px gap between elements.
- Default size of a box: width 180, height 80. Make boxes wide enough for their text (about 9px per character).
- Keep text short: 1 to 4 words per label. Minimal text.
- Every element needs a unique short "id" (e.g. "n1", "n2").
- "connections" use those ids in "from" and "to". Only connect ids that exist.
- Colors: use soft pastel backgroundColor (#a5d8ff, #b2f2bb, #ffec99, #ffc9c9, #d0bfff, #ffd8a8, #ffffff)
  and strokeColor "#1e1e1e". Use the same color for the same kind of element.
`;

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    elements: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          type: {
            type: "string",
            enum: ["rectangle", "ellipse", "diamond", "text"],
          },
          x: { type: "number" },
          y: { type: "number" },
          width: { type: "number" },
          height: { type: "number" },
          text: { type: "string" },
          backgroundColor: { type: "string" },
          strokeColor: { type: "string" },
        },
        required: ["id", "type", "x", "y", "width", "height"],
      },
    },
    connections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          from: { type: "string" },
          to: { type: "string" },
          label: { type: "string" },
        },
        required: ["from", "to"],
      },
    },
  },
  required: ["title", "elements", "connections"],
};

/**
 * Groq strict mode needs every field in `required` and
 * `additionalProperties: false`. Optional fields become nullable.
 */
const nullableString = { type: ["string", "null"] };

const GROQ_STRICT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    elements: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          ...RESPONSE_SCHEMA.properties.elements.items.properties,
          text: nullableString,
          backgroundColor: nullableString,
          strokeColor: nullableString,
        },
        required: [
          "id", "type", "x", "y", "width", "height",
          "text", "backgroundColor", "strokeColor",
        ],
      },
    },
    connections: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          from: { type: "string" },
          to: { type: "string" },
          label: nullableString,
        },
        required: ["from", "to", "label"],
      },
    },
  },
  required: ["title", "elements", "connections"],
};

const DIAGRAM_SCHEMA = { name: "diagram", gemini: RESPONSE_SCHEMA, groqStrict: GROQ_STRICT_SCHEMA };

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  const { userInput, toolName } = await req.json();
  const tool = getAITool(toolName);

  if (!userInput?.trim() || !tool) {
    return NextResponse.json(
      { message: "Prompt or tool is missing", success: false },
      { status: 400 }
    );
  }

  const providers = getProviders(DIAGRAM_SCHEMA);
  if (providers.length === 0) {
    console.error("AI: no provider configured (GROQ_* or GOOGLE_API_KEY/GEMINI_MODEL missing in .env)");
    return NextResponse.json(
      { message: "AI is not configured on the server", success: false },
      { status: 500 }
    );
  }

  // 1 credit per generation, taken before calling the AI (refunded below if it fails)
  const creditsLeft = await spendAICredit(user.id);
  if (creditsLeft === null) {
    return NextResponse.json(
      {
        message: "Is mahine ke AI credits khatam ho gaye. Agle mahine ki 1 tareekh ko reset honge.",
        success: false,
        code: "NO_AI_CREDITS",
        credits: 0,
      },
      { status: 403 }
    );
  }

  const systemPrompt = `${tool.prompt}\n${CANVAS_RULES}`;

  try {
    const { result: diagramResult, provider } = await generateWithFallback(
      providers,
      tool.name,
      systemPrompt,
      userInput.trim()
    );
    return NextResponse.json({ success: true, diagramResult, provider, credits: creditsLeft });
  } catch (err) {
    // Every provider failed, so the user got nothing: give the credit back
    const credits = await refundAICredit(user.id);

    const { status, message } = aiErrorResponse(err instanceof ProviderError ? err.status : 500);
    return NextResponse.json(
      {
        message: status === 500 ? "Diagram generate nahi ho paya. Dobara try karo." : message,
        success: false,
        credits,
      },
      { status }
    );
  }
}
