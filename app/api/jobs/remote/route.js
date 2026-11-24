import { NextResponse } from "next/server";
import { jsonError } from "@/lib/auth";

// Server-side proxy for the RemoteOK public feed. Browsers are blocked from calling
// it directly by CORS. Responses are cached for 30 minutes.
const stripHtml = (value = "") =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

export async function GET() {
  try {
    const response = await fetch("https://remoteok.com/api", {
      headers: { "User-Agent": "JobMatcher/1.0", Accept: "application/json" },
      next: { revalidate: 1800 },
    });
    if (!response.ok) return jsonError("The remote job feed is unavailable right now.", 502);
    const data = await response.json();
    const jobs = (Array.isArray(data) ? data : [])
      .filter((item) => item && item.id && item.position)
      .slice(0, 120)
      .map((item) => ({
        id: String(item.id),
        position: item.position,
        company: item.company || "",
        logo: item.company_logo || item.logo || "",
        location: item.location || "Remote",
        tags: Array.isArray(item.tags) ? item.tags.slice(0, 8) : [],
        description: stripHtml(item.description).slice(0, 280),
        url: item.apply_url || item.url,
        date: item.date,
        salaryMin: item.salary_min || 0,
        salaryMax: item.salary_max || 0,
      }));
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Remote jobs error:", error);
    return jsonError("The remote job feed is unavailable right now.", 502);
  }
}
