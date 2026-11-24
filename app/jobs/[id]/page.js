import mongoose from "mongoose";
import { notFound } from "next/navigation";
import connectDB from "@/config/connect";
import Job from "@/schema/Job";
import JobApply from "@/components/jobs/JobApply";

// Public, shareable job page. Loaded on the server so unknown IDs return a real 404.
async function loadJob(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  await connectDB();
  const job = await Job.findById(id).select("-recruiterEmail").lean();
  return job ? JSON.parse(JSON.stringify(job)) : null;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const job = await loadJob(id).catch(() => null);
  if (!job) return { title: "Job not found" };
  return {
    title: `${job.title} at ${job.name}`,
    description: `${job.jobType} · ${job.location}. ${String(job.description || "").slice(0, 150)}`,
  };
}

export default async function JobPage({ params }) {
  const { id } = await params;
  const job = await loadJob(id);
  if (!job) notFound();
  return <JobApply job={job} />;
}
