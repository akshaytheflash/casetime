// BharatCode LLM — server-side only. Base https://bharatcode.ai/api/model/v1, model qwen-3.8-27b.
// 503-prone: exponential backoff, then a deterministic template-explainer fallback.
const BASE = process.env.BHARATCODE_BASE_URL || "https://bharatcode.ai/api/model/v1";
const MODEL = process.env.BHARATCODE_MODEL || "qwen-3.8-27b";

export async function bharatcodeExplain(prompt: string): Promise<{ text: string; via: "llm" | "fallback" }> {
  const key = process.env.BHARATCODE_API_KEY || "";
  const delays = [0, 2000, 5000];
  for (let attempt = 0; attempt < delays.length; attempt++) {
    if (delays[attempt]) await new Promise((r) => setTimeout(r, delays[attempt]));
    try {
      const res = await fetch(`${BASE}/chat/completions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "system",
              content:
                "You explain an Indian litigation time-vs-cost estimate in plain language. Never give legal advice. Always repeat: this is an estimate from NJDG aggregates, not a prediction for any individual case.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 700,
        }),
      });
      if (res.status === 503 || res.status === 429) continue;
      const data = (await res.json().catch(() => null)) as {
        choices?: { message?: { content?: string } }[];
      } | null;
      const text = data?.choices?.[0]?.message?.content;
      if (text) return { text, via: "llm" };
    } catch {
      // fall through to retry / fallback
    }
  }
  return { text: null as unknown as string, via: "fallback" };
}

export function templateExplainer(estimateJson: string): string {
  return `The LLM is temporarily unavailable (BharatCode returns 503 when busy), so here is a plain-language read of the same numbers. ${estimateJson} Bottom line: court time is a queue problem — use the estimate for planning, not advice.`;
}
