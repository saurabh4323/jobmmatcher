import { NextResponse } from "next/server";

const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "A prompt is required." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured in .env.local." },
        { status: 500 }
      );
    }

    const response = await fetch(GROQ_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
        messages: [{ role: "user", content: prompt.trim() }],
        temperature: 0.4,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("Groq API request failed:", response.status, result?.error?.message);
      return NextResponse.json(
        { error: result?.error?.message || "Groq request failed." },
        { status: response.status }
      );
    }

    // Keep the shape expected by the existing resume and analysis screens.
    return NextResponse.json({
      candidates: [
        { content: { parts: [{ text: result.choices?.[0]?.message?.content || "" }] } },
      ],
    });
  } catch (error) {
    console.error("Groq route error:", error.message);
    return NextResponse.json({ error: "Unable to process the AI request." }, { status: 500 });
  }
}
