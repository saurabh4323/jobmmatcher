// Server-only helper for the Groq chat completions API (OpenAI-compatible).
const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";

export class AIError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

export async function generateText(prompt, { system, temperature = 0.4 } = {}) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new AIError("AI is not configured. Set GROQ_API_KEY in .env.local.", 503);

  const messages = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: prompt });

  const response = await fetch(GROQ_CHAT_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
      messages,
      temperature,
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new AIError(result?.error?.message || "The AI service returned an error.", response.status);
  }
  return result.choices?.[0]?.message?.content?.trim() || "";
}
