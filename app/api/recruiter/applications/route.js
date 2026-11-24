import { NextResponse } from "next/server";
import connectDB from "@/config/connect";
import { jsonError, requireSession } from "@/lib/auth";
import Job from "@/schema/Job";
import JobsApplied from "@/schema/Jobsapplied";

// All applications submitted to the signed-in recruiter's postings.
export async function GET() {
  const { session, error } = await requireSession("recruiter");
  if (error) return error;
  try {
    await connectDB();
    const jobs = await Job.find({ recruiterEmail: session.email }).select("_id title name").lean();
    if (!jobs.length) return NextResponse.json({ applications: [] });

    const byId = new Map(jobs.map((job) => [String(job._id), job]));
    const applications = await JobsApplied.find({ jobId: { $in: jobs.map((job) => job._id) } })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      applications: applications.map((application) => {
        const job = byId.get(String(application.jobId));
        return { ...application, jobTitle: job?.title || "Job posting", company: job?.name || "" };
      }),
    });
  } catch (err) {
    console.error("Recruiter applications error:", err);
    return jsonError("Unable to load applications right now.", 500);
  }
}
