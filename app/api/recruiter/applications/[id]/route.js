import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/config/connect";
import { jsonError, requireSession } from "@/lib/auth";
import Job from "@/schema/Job";
import JobsApplied from "@/schema/Jobsapplied";
import { APPLICATION_STATUSES as STATUSES } from "@/lib/constants";

// Recruiter moves an application through the pipeline.
export async function PATCH(request, { params }) {
  const { session, error } = await requireSession("recruiter");
  if (error) return error;
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) return jsonError("Application not found.", 404);

  try {
    const { status } = await request.json().catch(() => ({}));
    if (!STATUSES.includes(status)) return jsonError("Invalid status.");

    await connectDB();
    const application = await JobsApplied.findById(id);
    if (!application) return jsonError("Application not found.", 404);
    const owns = await Job.exists({ _id: application.jobId, recruiterEmail: session.email });
    if (!owns) return jsonError("Application not found.", 404);

    application.status = status;
    await application.save();
    return NextResponse.json({ application: application.toObject() });
  } catch (err) {
    console.error("Application update error:", err);
    return jsonError("Unable to update this application.", 500);
  }
}
