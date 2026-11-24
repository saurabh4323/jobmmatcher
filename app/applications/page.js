"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ClipboardList, ExternalLink, Search } from "lucide-react";
import { api, formatDate } from "@/lib/client";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { Alert, EmptyState, LoadingBlock, PageHeader, StatusBadge } from "@/components/ui";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/applications")
      .then((data) => setApplications(data.applications || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(
    () => Object.fromEntries(APPLICATION_STATUSES.map((status) => [status, applications.filter((item) => item.status === status).length])),
    [applications]
  );
  const visible = filter === "all" ? applications : applications.filter((item) => item.status === filter);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        kicker="Tracking"
        title="My applications"
        description="Every role you've applied to and where it stands. Recruiters update the status as they review."
        actions={<Link href="/jobs" className="btn btn-primary"><Search size={16} /> Find more jobs</Link>}
      />
      <Alert className="mb-6">{error}</Alert>

      {loading ? (
        <LoadingBlock label="Loading applications…" />
      ) : !applications.length ? (
        <EmptyState
          icon={ClipboardList}
          title="No applications yet"
          description="When you apply to a job, it shows up here so you can track its progress."
          action={<Link href="/jobs" className="btn btn-primary">Browse jobs</Link>}
        />
      ) : (
        <>
          <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
            {["all", ...APPLICATION_STATUSES].map((status) => (
              <button
                key={status}
                type="button"
                role="tab"
                aria-selected={filter === status}
                onClick={() => setFilter(status)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
                  filter === status ? "border-brand/50 bg-brand/10 text-slate-900" : "border-slate-200 text-slate-500 hover:text-slate-900"
                }`}
              >
                {status} <span className="ml-1 text-slate-500">{status === "all" ? applications.length : counts[status]}</span>
              </button>
            ))}
          </div>

          <div className="card overflow-hidden">
            <ul className="divide-y divide-slate-100">
              {visible.map((item) => (
                <li key={item._id} className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{item.job?.title || "Job no longer listed"}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {[item.job?.name, item.job?.location, item.job?.jobType].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500">Applied {formatDate(item.createdAt)}</span>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={item.status} />
                    {item.job && (
                      <Link href={`/jobs/${item.jobId}`} className="text-slate-500 hover:text-brand" aria-label="View job">
                        <ExternalLink size={16} />
                      </Link>
                    )}
                  </div>
                </li>
              ))}
              {!visible.length && <li className="px-5 py-10 text-center text-sm text-slate-500">No applications with this status.</li>}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
