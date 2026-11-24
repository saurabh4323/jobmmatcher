import { NextResponse } from "next/server";
import connectDB from "@/config/connect";
import { jsonError } from "@/lib/auth";
import { jobSearchFilter } from "@/lib/jobs";
import Job from "@/schema/Job";

// Public list of open internal job postings.
export async function GET(request) {
  try {
    await connectDB();
    const filter = { ...jobSearchFilter(request.nextUrl.searchParams), status: { $ne: "closed" } };
    const jobs = await Job.find(filter).select("-recruiterEmail").sort({ createdAt: -1 }).limit(200).lean();
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Jobs list error:", error);
    return jsonError("Unable to load jobs right now.", 500);
  }
}
