import { jsonError } from "@/lib/auth";
import { proxyToML } from "@/lib/ml";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const features = Array.isArray(body.features) ? body.features.map(Number) : [];
  if (features.length !== 4 || features.some((value) => !Number.isFinite(value))) {
    return jsonError("Provide exactly four numeric features.");
  }
  return proxyToML("/predict", { features });
}
