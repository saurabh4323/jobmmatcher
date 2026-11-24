import { NextResponse } from "next/server";
import { jsonError, requireSession } from "@/lib/auth";

const ML_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

/** Proxies a POST to the FastAPI ML service for signed-in users. */
export async function proxyToML(path, body) {
  const { error } = await requireSession();
  if (error) return error;
  try {
    const response = await fetch(`${ML_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(15000),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return jsonError(data.detail || "The ML service returned an error.", response.status);
    return NextResponse.json(data);
  } catch {
    return jsonError(`Could not reach the ML service at ${ML_URL}. Start it with: cd python_backend && python main.py`, 503);
  }
}
