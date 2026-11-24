"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BriefcaseBusiness, Building2, FilePlus2, Inbox, Trophy, Users } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { api, timeAgo } from "@/lib/client";
import { Alert, LoadingBlock, StatCard, StatusBadge } from "@/components/ui";
import CopyLinkButton from "@/components/recruiter/CopyLinkButton";

export default function RecruiterOverviewPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [recruiter, setRecruiter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api("/api/recruiter/jobs"), api("/api/recruiter/applications"), api("/api/recruiter/profile")])
      .then(([jobData, appData, profileData]) => {
        setJobs(jobData.jobs || []);
        setApplications(appData.applications || []);
        setRecruiter(profileData.recruiter);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const weekAgo = Date.now() - 7 * 864e5;
    return {
      open: jobs.filter((job) => job.status !== "closed").length,
      total: applications.length,
      week: applications.filter((item) => new Date(item.createdAt).getTime() > weekAgo).length,
      offered: applications.filter((item) => item.status === "offered").length,
    };
  }, [jobs, applications]);

  if (loading) return <LoadingBlock label="Loading your hiring overview…" />;

  const firstName = (user?.fullName || "").split(" ")[0];
  const profileIncomplete = recruiter && !(recruiter.company && recruiter.about);
  const memberSince = recruiter?.createdAt ? new Date(recruiter.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" }) : "";

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="neon-border card relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="grid-bg absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="kicker mb-3 !text-accent">Recruiter overview</p>
            <h1 className="text-3xl font-bold tracking-tight">
              Hello, <span className="neon-text-pink">{firstName}</span>
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {recruiter?.company ? `Hiring for ${recruiter.company}` : "Add your company name to your profile."}
              {memberSince && <span className="text-slate-400"> · Member since {memberSince}</span>}
            </p>
          </div>
          <Link href="/recruiter/jobs/new" className="btn btn-pink btn-lg"><FilePlus2 size={18} /> Post a job</Link>
        </div>
      </section>

      <Alert>{error}</Alert>
      {profileIncomplete && (
        <Alert tone="info">
          Candidates trust complete company profiles. <Link href="/recruiter/profile" className="font-semibold underline">Add your company details</Link>.
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BriefcaseBusiness} label="Open roles" value={stats.open} hint={`${jobs.length} total posted`} />
        <StatCard icon={Inbox} label="Applications" value={stats.total} hint="Across all roles" accent="violet" />
        <StatCard icon={Users} label="This week" value={stats.week} hint="New in the last 7 days" accent="pink" />
        <StatCard icon={Trophy} label="Offers made" value={stats.offered} hint="Candidates offered" accent="lime" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <section className="card p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your job posts</h2>
            <Link href="/recruiter/jobs" className="btn-link">Manage <ArrowRight size={14} /></Link>
          </div>
          {jobs.length ? (
            <ul className="space-y-3">
              {jobs.slice(0, 5).map((job) => (
                <li key={job._id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-ink-950/40 p-4">
                  <Link href={`/recruiter/jobs/${job._id}`} className="min-w-0 flex-1 hover:text-brand">
                    <p className="truncate font-semibold text-slate-900">{job.title}</p>
                    <p className="text-xs text-slate-500">{job.applicationCount} applicant{job.applicationCount === 1 ? "" : "s"} · posted {timeAgo(job.createdAt)}</p>
                  </Link>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={job.status || "open"} />
                    <CopyLinkButton jobId={job._id} label="Link" />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
              <p className="text-sm text-slate-500">You haven&apos;t posted a job yet.</p>
              <Link href="/recruiter/jobs/new" className="btn btn-primary mt-4"><FilePlus2 size={16} /> Post your first job</Link>
            </div>
          )}
        </section>

        <section className="card p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Latest applicants</h2>
            <Link href="/recruiter/candidates" className="btn-link">All candidates <ArrowRight size={14} /></Link>
          </div>
          {applications.length ? (
            <ul className="divide-y divide-slate-100">
              {applications.slice(0, 6).map((item) => (
                <li key={item._id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{item.fullName}</p>
                    <p className="truncate text-xs text-slate-500">{item.jobTitle} · {timeAgo(item.createdAt)}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">Applications appear here when candidates apply through your job links.</p>
          )}
        </section>
      </div>

      {!recruiter?.company && (
        <Link href="/recruiter/profile" className="card card-hover flex items-center gap-4 p-5">
          <span className="grid h-11 w-11 place-items-center rounded-xl border border-info/30 bg-info/10 text-info"><Building2 size={20} /></span>
          <div className="flex-1">
            <p className="font-semibold text-slate-900">Set up your company profile</p>
            <p className="text-sm text-slate-500">Your company name pre-fills every new job post.</p>
          </div>
          <ArrowRight size={18} className="text-slate-500" />
        </Link>
      )}
    </div>
  );
}
