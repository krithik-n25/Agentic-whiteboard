// Server only: Groq (primary) + Gemini (fallback) with JSON schema output.
// Used by /api/ai (diagrams) and /api/ai/code (code -> flowchart).
import { GoogleGenAI, ApiError } from "@google/genai";

// Status codes on which we try the next provider once
const RETRYABLE_STATUS = [429, 500, 503];

export type OutputSchema = {
  name: string; // schema name for Groq
  gemini: object; // normal JSON schema (optional fields allowed)
  groqStrict: object; // strict: every field required, optional ones nullable
};

type Provider = {
  name: string;
  model: string;
  generate: (systemPrompt: string, userInput: string) => Promise<any>;
};

export class ProviderError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const callGroq = async (
  model: string,
  apiKey: string,
  schema: OutputSchema,
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
        json_schema: { name: schema.name, strict: true, schema: schema.groqStrict },
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
  schema: OutputSchema,
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
        responseJsonSchema: schema.gemini,
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
export const getProviders = (schema: OutputSchema): Provider[] => {
  const providers: Provider[] = [];
  const { GROQ_API_KEY, GROQ_MODEL, GOOGLE_API_KEY, GEMINI_MODEL } = process.env;

  if (GROQ_API_KEY && GROQ_MODEL) {
    providers.push({
      name: "Groq",
      model: GROQ_MODEL,
      generate: (sys, input) => callGroq(GROQ_MODEL, GROQ_API_KEY, schema, sys, input),
    });
  }
  if (GOOGLE_API_KEY && GEMINI_MODEL) {
    providers.push({
      name: "Gemini",
      model: GEMINI_MODEL,
      generate: (sys, input) => callGemini(GEMINI_MODEL, GOOGLE_API_KEY, schema, sys, input),
    });
  }
  return providers;
};

/**
 * Tries providers in order. On 429 / 500 / 503 it moves to the next one.
 * Returns the result, or throws ProviderError with the last status.
 */
export const generateWithFallback = async (
  providers: Provider[],
  label: string,
  systemPrompt: string,
  userInput: string
) => {
  let lastStatus = 500;

  for (const [index, provider] of providers.entries()) {
    try {
      console.log(`AI: generating "${label}" with ${provider.name} (${provider.model})`);
      const result = await provider.generate(systemPrompt, userInput);
      console.log(`AI: success with ${provider.name} (${provider.model})`);
      return { result, provider: provider.name };
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

  throw new ProviderError(lastStatus, "All AI providers failed");
};

// Toast text for the user. 429 / 503 keep their status, everything else is 500.
export const aiErrorResponse = (status: number) => {
  const finalStatus = status === 429 || status === 503 ? status : 500;
  const message =
    finalStatus === 429
      ? "AI limit abhi khatam ho gayi, thodi der baad try karo."
      : finalStatus === 503
        ? "AI model abhi busy hai, thodi der baad try karo."
        : "AI se jawab nahi aaya. Dobara try karo.";
  return { status: finalStatus, message };
};
