import { NextResponse } from "next/server";
import { clean, jsonError, requireSession } from "@/lib/auth";

// JDoodle language codes. versionIndex "0" is available for every language.
const LANGUAGES = {
  python3: "python3",
  nodejs: "nodejs",
  java: "java",
  cpp17: "cpp17",
};

export async function POST(request) {
  const { error } = await requireSession();
  if (error) return error;

  const clientId = process.env.JDOODLE_CLIENT_ID;
  const clientSecret = process.env.JDOODLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return jsonError("Code runner is not configured. Set JDOODLE_CLIENT_ID and JDOODLE_CLIENT_SECRET.", 503);
  }

  try {
    const body = await request.json().catch(() => ({}));
    const script = clean(body.code, 50000);
    const language = LANGUAGES[body.language];
    if (!script) return jsonError("Write some code before running it.");
    if (!language) return jsonError("Unsupported language.");

    const response = await fetch("https://api.jdoodle.com/v1/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,
        clientSecret,
        script,
        stdin: clean(body.stdin, 10000),
        language,
        versionIndex: "0",
      }),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.error) {
      return jsonError(result.error || "The code runner returned an error.", response.ok ? 502 : response.status);
    }
    return NextResponse.json({
      output: result.output ?? "",
      cpuTime: result.cpuTime ?? null,
      memory: result.memory ?? null,
    });
  } catch (err) {
    console.error("Code execution error:", err);
    return jsonError("Unable to reach the code runner.", 502);
  }
}
