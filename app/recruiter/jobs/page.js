"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BriefcaseBusiness, FilePlus2, MapPin, Search, Users } from "lucide-react";
import { api, formatDate } from "@/lib/client";
import { Alert, EmptyState, LoadingBlock, PageHeader, StatusBadge } from "@/components/ui";
import CopyLinkButton from "@/components/recruiter/CopyLinkButton";

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/recruiter/jobs")
      .then((data) => setJobs(data.jobs || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const q = query.trim().toLowerCase();
  const visible = jobs.filter(
    (job) =>
      (status === "all" || (job.status || "open") === status) &&
      (!q || [job.title, job.name, job.location, ...(job.skills || [])].some((value) => String(value || "").toLowerCase().includes(q)))
  );

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        kicker="Hiring"
        title="Job posts"
        description="Every role you've published. Share a post's apply link anywhere — applications land in Candidates."
        actions={<Link href="/recruiter/jobs/new" className="btn btn-primary"><FilePlus2 size={16} /> Post a job</Link>}
      />
      <Alert className="mb-6">{error}</Alert>

      {loading ? (
        <LoadingBlock label="Loading your jobs…" />
      ) : !jobs.length ? (
        <EmptyState
          icon={BriefcaseBusiness}
          title="No job posts yet"
          description="Publish your first role to get a shareable apply link."
          action={<Link href="/recruiter/jobs/new" className="btn btn-primary"><FilePlus2 size={16} /> Post a job</Link>}
        />
      ) : (
        <>
          <div className="card mb-5 flex flex-col gap-3 p-3 sm:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">Search your jobs</span>
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title, location, or skill…" className="input pl-10" />
            </label>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="input sm:w-40" aria-label="Status">
              <option value="all">All statuses</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((job) => (
              <article key={job._id} className="card card-hover flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <StatusBadge status={job.status || "open"} />
                  <span className="text-xs text-slate-500">{formatDate(job.createdAt)}</span>
                </div>
                <Link href={`/recruiter/jobs/${job._id}`} className="mt-3 hover:text-brand">
                  <h2 className="text-lg font-semibold leading-snug">{job.title}</h2>
                </Link>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><MapPin size={12} /> {job.location} · {job.jobType}</p>
                <p className="mt-3 line-clamp-2 text-sm text-slate-500">{job.description}</p>
                <div className="mt-auto flex items-center justify-between gap-2 pt-5">
                  <Link href={`/recruiter/jobs/${job._id}`} className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-brand">
                    <Users size={15} className="text-accent" /> {job.applicationCount} applicant{job.applicationCount === 1 ? "" : "s"}
                  </Link>
                  <CopyLinkButton jobId={job._id} label="Link" />
                </div>
              </article>
            ))}
          </div>
          {!visible.length && <p className="py-10 text-center text-sm text-slate-500">No jobs match your filters.</p>}
        </>
      )}
    </div>
  );
}
