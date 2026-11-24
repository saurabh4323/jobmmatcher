import { proxyToML } from "@/lib/ml";

export async function POST() {
  return proxyToML("/train");
}
