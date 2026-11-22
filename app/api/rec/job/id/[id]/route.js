import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/config/connect";
import job from "@/schema/Job";

export async function GET(_request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
  }

  try {
    await connectDB();
    const foundJob = await job.findById(id).select("-recruiterEmail");

    if (!foundJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(foundJob, { status: 200 });
  } catch (error) {
    console.error("Error fetching job details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
