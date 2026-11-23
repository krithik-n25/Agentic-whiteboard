import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { GoogleGenAI, ApiError } from "@google/genai";
import { getAITool } from "@/lib/aiTools";

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

// Status codes on which we try the next provider once
const RETRYABLE_STATUS = [429, 500, 503];

type Provider = {
  name: string;
  model: string;
  generate: (systemPrompt: string, userInput: string) => Promise<any>;
};

class ProviderError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const callGroq = async (
  model: string,
  apiKey: string,
  systemPrompt: string,
  userInput: string
) => {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `USER REQUEST: ${userInput}` },
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: "diagram", strict: true, schema: GROQ_STRICT_SCHEMA },
      },
    }),
  });

  if (!res.ok) {
    // Only the error body, never the request (it has the key in headers)
    throw new ProviderError(res.status, (await res.text()).slice(0, 500));
  }

  const data = await res.json();
  return JSON.parse(data.choices?.[0]?.message?.content ?? "{}");
};

const callGemini = async (
  model: string,
  apiKey: string,
  systemPrompt: string,
  userInput: string
) => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: `${systemPrompt}\n\nUSER REQUEST: ${userInput}`,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: RESPONSE_SCHEMA,
      },
    });
    return JSON.parse(response.text ?? "{}");
  } catch (err) {
    if (err instanceof ApiError) throw new ProviderError(err.status, err.message);
    throw err;
  }
};

/**
 * Groq is primary, Gemini is fallback. A provider is used only if
 * both its key and model are set in .env.
 */
const getProviders = (): Provider[] => {
  const providers: Provider[] = [];
  const { GROQ_API_KEY, GROQ_MODEL, GOOGLE_API_KEY, GEMINI_MODEL } = process.env;

  if (GROQ_API_KEY && GROQ_MODEL) {
    providers.push({
      name: "Groq",
      model: GROQ_MODEL,
      generate: (sys, input) => callGroq(GROQ_MODEL, GROQ_API_KEY, sys, input),
    });
  }
  if (GOOGLE_API_KEY && GEMINI_MODEL) {
    providers.push({
      name: "Gemini",
      model: GEMINI_MODEL,
      generate: (sys, input) => callGemini(GEMINI_MODEL, GOOGLE_API_KEY, sys, input),
    });
  }
  return providers;
};

const errorMessage = (status: number) => {
  if (status === 429) return "AI limit abhi khatam ho gayi, thodi der baad try karo.";
  if (status === 503) return "AI model abhi busy hai, thodi der baad try karo.";
  return "Diagram generate nahi ho paya. Dobara try karo.";
};

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

  const providers = getProviders();
  if (providers.length === 0) {
    console.error("AI: no provider configured (GROQ_* or GOOGLE_API_KEY/GEMINI_MODEL missing in .env)");
    return NextResponse.json(
      { message: "AI is not configured on the server", success: false },
      { status: 500 }
    );
  }

  const systemPrompt = `${tool.prompt}\n${CANVAS_RULES}`;
  let lastStatus = 500;

  for (const [index, provider] of providers.entries()) {
    try {
      console.log(`AI: generating "${tool.name}" with ${provider.name} (${provider.model})`);
      const diagramResult = await provider.generate(systemPrompt, userInput.trim());
      console.log(`AI: success with ${provider.name} (${provider.model})`);

      return NextResponse.json({ success: true, diagramResult, provider: provider.name });
    } catch (err) {
      lastStatus = err instanceof ProviderError ? err.status : 500;
      console.error(
        `AI: ${provider.name} (${provider.model}) failed with status ${lastStatus}`,
        err instanceof Error ? err.message : err
      );

      const hasNext = index < providers.length - 1;
      if (!hasNext || !RETRYABLE_STATUS.includes(lastStatus)) break;
      console.log(`AI: falling back to ${providers[index + 1].name}`);
    }
  }

  const status = lastStatus === 429 || lastStatus === 503 ? lastStatus : 500;
  return NextResponse.json(
    { message: errorMessage(status), success: false },
    { status }
  );
}
