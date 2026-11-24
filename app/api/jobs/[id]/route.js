import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/config/connect";
import { jsonError } from "@/lib/auth";
import Job from "@/schema/Job";

export async function GET(_request, { params }) {
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) return jsonError("This job link is invalid.", 404);
  try {
    await connectDB();
    const job = await Job.findById(id).select("-recruiterEmail").lean();
    if (!job) return jsonError("This job is no longer available.", 404);
    return NextResponse.json({ job });
  } catch (error) {
    console.error("Job detail error:", error);
    return jsonError("Unable to load this job.", 500);
  }
}
