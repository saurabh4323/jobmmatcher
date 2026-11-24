import { NextResponse } from "next/server";
import { clean, jsonError, requireSession } from "@/lib/auth";
import { AIError, generateText } from "@/lib/ai";

export async function POST(request) {
  const { error } = await requireSession();
  if (error) return error;

  try {
    const body = await request.json().catch(() => ({}));
    const prompt = clean(body.prompt, 12000);
    const system = clean(body.system, 2000);
    if (!prompt) return jsonError("A prompt is required.");

    const text = await generateText(prompt, { system: system || undefined });
    return NextResponse.json({ text });
  } catch (err) {
    console.error("AI route error:", err.message);
    const status = err instanceof AIError ? err.status : 500;
    return jsonError(err instanceof AIError ? err.message : "Unable to process the AI request.", status);
  }
}
