import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/config/connect";
import { jsonError, requireSession } from "@/lib/auth";
import { parseJobInput } from "@/lib/jobs";
import Job from "@/schema/Job";
import JobsApplied from "@/schema/Jobsapplied";

async function loadOwnedJob(params) {
  const { session, error } = await requireSession("recruiter");
  if (error) return { error };
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) return { error: jsonError("Job not found.", 404) };
  await connectDB();
  const job = await Job.findOne({ _id: id, recruiterEmail: session.email });
  if (!job) return { error: jsonError("Job not found.", 404) };
  return { job };
}

export async function GET(_request, { params }) {
  try {
    const { job, error } = await loadOwnedJob(params);
    if (error) return error;
    const applications = await JobsApplied.find({ jobId: job._id }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ job: job.toObject(), applications });
  } catch (err) {
    console.error("Recruiter job detail error:", err);
    return jsonError("Unable to load this job.", 500);
  }
}

export async function PATCH(request, { params }) {
  try {
    const { job, error } = await loadOwnedJob(params);
    if (error) return error;
    const body = await request.json().catch(() => ({}));
    const { data, error: invalid } = parseJobInput(body, { partial: true });
    if (invalid) return jsonError(invalid);
    Object.assign(job, data);
    await job.save();
    return NextResponse.json({ job: job.toObject() });
  } catch (err) {
    console.error("Job update error:", err);
    return jsonError("Unable to update this job.", 500);
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { job, error } = await loadOwnedJob(params);
    if (error) return error;
    await JobsApplied.deleteMany({ jobId: job._id });
    await job.deleteOne();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Job delete error:", err);
    return jsonError("Unable to delete this job.", 500);
  }
}
