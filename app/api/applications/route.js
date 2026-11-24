import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/config/connect";
import { clean, getSession, isEmail, jsonError, requireSession } from "@/lib/auth";
import Job from "@/schema/Job";
import JobsApplied from "@/schema/Jobsapplied";

// Signed-in candidate's own applications.
export async function GET() {
  const { session, error } = await requireSession("candidate");
  if (error) return error;
  try {
    await connectDB();
    const applications = await JobsApplied.find({ email: session.email }).sort({ createdAt: -1 }).lean();
    const jobs = await Job.find({ _id: { $in: applications.map((item) => item.jobId) } })
      .select("title name location jobType status")
      .lean();
    const byId = new Map(jobs.map((job) => [String(job._id), job]));
    return NextResponse.json({
      applications: applications.map((item) => ({ ...item, job: byId.get(String(item.jobId)) || null })),
    });
  } catch (err) {
    console.error("Candidate applications error:", err);
    return jsonError("Unable to load your applications.", 500);
  }
}

// Public: anyone with a job link can apply. Signed-in candidates apply with their account email.
export async function POST(request) {
  try {
    const session = await getSession();
    const body = await request.json().catch(() => ({}));
    const fullName = clean(body.fullName, 120);
    const email = (session?.role === "candidate" ? session.email : clean(body.email, 200)).toLowerCase();
    const phone = clean(body.phone, 40);
    const resumeUrl = clean(body.resumeUrl, 500);
    const coverLetter = clean(body.coverLetter, 5000);
    const { jobId } = body;

    if (!mongoose.Types.ObjectId.isValid(jobId)) return jsonError("This job link is invalid.");
    if (!fullName || !isEmail(email)) return jsonError("Enter your name and a valid email address.");
    if (resumeUrl) {
      try {
        if (!/^https?:$/.test(new URL(resumeUrl).protocol)) throw new Error();
      } catch {
        return jsonError("Resume link must be a valid http or https URL.");
      }
    }

    await connectDB();
    const job = await Job.findById(jobId).select("title name applicationDeadline status");
    if (!job) return jsonError("This job is no longer available.", 404);
    if (job.status === "closed") return jsonError("This job is no longer accepting applications.", 410);
    if (job.applicationDeadline && job.applicationDeadline < new Date()) {
      return jsonError("The application deadline has passed.", 410);
    }
    if (await JobsApplied.exists({ jobId, email })) {
      return jsonError("You have already applied to this job.", 409);
    }

    const application = await JobsApplied.create({
      applicantId: session?.role === "candidate" ? session.sub : email,
      fullName,
      email,
      phone,
      resumeUrl,
      coverLetter,
      jobId,
    });

    return NextResponse.json(
      {
        message: "Application submitted successfully.",
        applicationId: application._id,
        jobTitle: job.title,
        company: job.name,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Application submit error:", err);
    return jsonError("Unable to submit your application right now.", 500);
  }
}
