import { NextResponse } from "next/server";
import connectDB from "@/config/connect";
import { jsonError, requireSession } from "@/lib/auth";
import { jobSearchFilter, parseJobInput } from "@/lib/jobs";
import Job from "@/schema/Job";
import JobsApplied from "@/schema/Jobsapplied";

// The signed-in recruiter's own postings, with application counts.
export async function GET(request) {
  const { session, error } = await requireSession("recruiter");
  if (error) return error;
  try {
    await connectDB();
    const filter = { ...jobSearchFilter(request.nextUrl.searchParams), recruiterEmail: session.email };
    const jobs = await Job.find(filter).sort({ createdAt: -1 }).lean();
    const counts = await JobsApplied.aggregate([
      { $match: { jobId: { $in: jobs.map((job) => job._id) } } },
      { $group: { _id: "$jobId", count: { $sum: 1 } } },
    ]);
    const byJob = new Map(counts.map((item) => [String(item._id), item.count]));
    return NextResponse.json({
      jobs: jobs.map((job) => ({ ...job, applicationCount: byJob.get(String(job._id)) || 0 })),
    });
  } catch (err) {
    console.error("Recruiter jobs error:", err);
    return jsonError("Unable to load your job posts.", 500);
  }
}

export async function POST(request) {
  const { session, error } = await requireSession("recruiter");
  if (error) return error;
  try {
    const body = await request.json().catch(() => ({}));
    const { data, error: invalid } = parseJobInput(body);
    if (invalid) return jsonError(invalid);

    await connectDB();
    const job = await Job.create({ ...data, recruiterEmail: session.email, status: "open" });
    return NextResponse.json({ job }, { status: 201 });
  } catch (err) {
    console.error("Job create error:", err);
    return jsonError("Unable to publish this job right now.", 500);
  }
}
