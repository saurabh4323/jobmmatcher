"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { api } from "@/lib/client";
import { APPLICATION_STATUSES } from "@/lib/constants";
import ApplicantRow from "@/components/recruiter/ApplicantRow";
import { Alert, EmptyState, LoadingBlock, PageHeader } from "@/components/ui";

export default function CandidatesPage() {
  const [applications, setApplications] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [job, setJob] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/recruiter/applications")
      .then((data) => setApplications(data.applications || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const jobs = useMemo(() => {
    const map = new Map();
    applications.forEach((item) => map.set(String(item.jobId), item.jobTitle));
    return [...map.entries()];
  }, [applications]);

  const q = query.trim().toLowerCase();
  const visible = applications.filter(
    (item) =>
      (status === "all" || item.status === status) &&
      (job === "all" || String(item.jobId) === job) &&
      (!q || [item.fullName, item.email, item.phone, item.jobTitle].some((value) => String(value || "").toLowerCase().includes(q)))
  );

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader kicker="Pipeline" title="Candidates" description="Everyone who applied to your roles. Update a status and the candidate sees it on their dashboard." />
      <Alert className="mb-6">{error}</Alert>

      {loading ? (
        <LoadingBlock label="Loading candidates…" />
      ) : !applications.length ? (
        <EmptyState
          icon={Users}
          title="No applications yet"
          description="Share a job's apply link with candidates. Their applications will appear here."
          action={<Link href="/recruiter/jobs" className="btn btn-primary">Go to job posts</Link>}
        />
      ) : (
        <>
          <div className="card mb-5 flex flex-col gap-3 p-3 lg:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">Search candidates</span>
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, or job…" className="input pl-10" />
            </label>
            <select value={job} onChange={(event) => setJob(event.target.value)} className="input lg:w-56" aria-label="Job">
              <option value="all">All jobs</option>
              {jobs.map(([jobId, title]) => <option key={jobId} value={jobId}>{title}</option>)}
            </select>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="input capitalize lg:w-44" aria-label="Status">
              <option value="all">All statuses</option>
              {APPLICATION_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>

          <p className="mb-3 text-sm text-slate-500">{visible.length} of {applications.length} application{applications.length === 1 ? "" : "s"}</p>
          <div className="card overflow-hidden">
            <ul className="divide-y divide-slate-100">
              {visible.map((item) => (
                <ApplicantRow key={item._id} application={item} showJob onChange={(updated) => setApplications((list) => list.map((a) => (a._id === updated._id ? updated : a)))} />
              ))}
              {!visible.length && <li className="px-5 py-10 text-center text-sm text-slate-500">No candidates match your filters.</li>}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
