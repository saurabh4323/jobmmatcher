import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/config/connect";
import Job from "@/schema/Job";
import JobsApplied from "@/schema/Jobsapplied";

export async function GET(request) {
  const recruiterEmail = request.nextUrl.searchParams
    .get("recruiterEmail")
    ?.trim()
    .toLowerCase();

  if (!recruiterEmail) {
    return NextResponse.json(
      { error: "Recruiter email is required." },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const ownedJobs = await Job.find({ recruiterEmail })
      .select("_id title name")
      .lean();
    const jobsById = new Map(ownedJobs.map((item) => [String(item._id), item]));

    if (ownedJobs.length === 0) return NextResponse.json([], { status: 200 });

    const applications = await JobsApplied.find({
      jobId: { $in: ownedJobs.map((item) => item._id) },
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      applications.map((application) => {
        const relatedJob = jobsById.get(String(application.jobId));
        return {
          ...application,
          jobTitle: relatedJob?.title || "Job posting",
          company: relatedJob?.name || "",
        };
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error loading job applications:", error);
    return NextResponse.json(
      { error: "Unable to load applications right now." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const resumeUrl = typeof body.resumeUrl === "string" ? body.resumeUrl.trim() : "";
    const coverLetter = typeof body.coverLetter === "string" ? body.coverLetter.trim() : "";
    const { jobId } = body;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return NextResponse.json({ error: "This job link is invalid." }, { status: 400 });
    }
    if (!fullName || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: "Enter your name and a valid email address." },
        { status: 400 }
      );
    }
    if (resumeUrl) {
      try {
        const url = new URL(resumeUrl);
        if (!/^https?:$/.test(url.protocol)) throw new Error("Unsupported protocol");
      } catch {
        return NextResponse.json(
          { error: "Resume link must be a valid http or https URL." },
          { status: 400 }
        );
      }
    }

    await connectDB();
    const job = await Job.findById(jobId).select("title name applicationDeadline");
    if (!job) {
      return NextResponse.json({ error: "This job is no longer available." }, { status: 404 });
    }
    if (job.applicationDeadline && job.applicationDeadline < new Date()) {
      return NextResponse.json({ error: "The application deadline has passed." }, { status: 410 });
    }

    const existingApplication = await JobsApplied.findOne({ jobId, email });
    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied to this job." },
        { status: 409 }
      );
    }

    const application = await JobsApplied.create({
      applicantId: email,
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
  } catch (error) {
    console.error("Error submitting job application:", error);
    return NextResponse.json(
      { error: "Unable to submit your application right now." },
      { status: 500 }
    );
  }
}
