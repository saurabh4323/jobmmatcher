"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  Code2,
  FileText,
  MapPin,
  MessagesSquare,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { api, formatDate, timeAgo } from "@/lib/client";
import { completeness, matchSkills, useProfile } from "@/lib/profile";
import { Alert, LoadingBlock, StatCard, StatusBadge } from "@/components/ui";

const QUICK_ACTIONS = [
  { href: "/resume", label: "Build resume", icon: FileText, tone: "text-brand" },
  { href: "/interview", label: "Mock interview", icon: MessagesSquare, tone: "text-accent" },
  { href: "/programming", label: "Coding round", icon: Code2, tone: "text-info" },
  { href: "/jobs", label: "Browse jobs", icon: BriefcaseBusiness, tone: "text-success" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { profile, loading: profileLoading, error: profileError } = useProfile();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api("/api/applications"), api("/api/jobs")])
      .then(([apps, list]) => {
        setApplications(apps.applications || []);
        setJobs(list.jobs || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const score = completeness(profile);
  const firstName = (profile.full_name || user?.fullName || "").split(" ")[0];
  const counts = useMemo(
    () => ({
      total: applications.length,
      interviewed: applications.filter((item) => item.status === "interviewed").length,
      offered: applications.filter((item) => item.status === "offered").length,
    }),
    [applications]
  );

  const appliedIds = new Set(applications.map((item) => String(item.jobId)));
  const recommended = jobs
    .filter((job) => !appliedIds.has(String(job._id)))
    .map((job) => ({ job, matched: matchSkills(profile.skills, job.skills || []) }))
    .sort((a, b) => b.matched.length - a.matched.length)
    .slice(0, 4);

  if (profileLoading && loading) return <LoadingBlock label="Loading your dashboard…" />;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome */}
      <section className="neon-border card relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="grid-bg absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="kicker mb-3">Dashboard</p>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back{firstName ? <>, <span className="neon-text">{firstName}</span></> : ""}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {profile.headline || "Add a headline to your profile so recruiters know what you do."}
            </p>
            {(profile.city || profile.country) && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin size={13} /> {[profile.city, profile.country].filter(Boolean).join(", ")}
              </p>
            )}
          </div>
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-ink-950/60 p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-900">Profile strength</span>
              <span className="font-display font-bold text-brand">{score.percent}%</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-brand to-accent transition-all duration-700" style={{ width: `${score.percent}%` }} />
            </div>
            {score.missing.length ? (
              <p className="mt-3 text-xs text-slate-500">
                Missing: {score.missing.slice(0, 3).join(", ")}
                {score.missing.length > 3 ? ` +${score.missing.length - 3}` : ""} ·{" "}
                <Link href="/profile" className="text-brand hover:text-slate-900">Complete profile</Link>
              </p>
            ) : (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700"><CheckCircle2 size={13} /> Your profile is complete.</p>
            )}
          </div>
        </div>
      </section>

      <Alert>{profileError || error}</Alert>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ClipboardList} label="Applications" value={counts.total} hint="Jobs you've applied to" />
        <StatCard icon={MessagesSquare} label="Interviewing" value={counts.interviewed} hint="Moved to interview" accent="violet" />
        <StatCard icon={Trophy} label="Offers" value={counts.offered} hint="Offers received" accent="lime" />
        <StatCard icon={Sparkles} label="Skills" value={profile.skills.length} hint="On your profile" accent="pink" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {QUICK_ACTIONS.map(({ href, label, icon: Icon, tone }) => (
          <Link key={href} href={href} className="card card-hover flex items-center gap-3 p-4">
            <span className={`grid h-10 w-10 place-items-center rounded-xl bg-slate-100 ${tone}`}><Icon size={18} /></span>
            <span className="text-sm font-semibold text-slate-900">{label}</span>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Recommended */}
        <section className="card p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recommended for you</h2>
            <Link href="/jobs" className="btn-link">All jobs <ArrowRight size={14} /></Link>
          </div>
          {loading ? (
            <p className="text-sm text-slate-500">Loading jobs…</p>
          ) : recommended.length ? (
            <ul className="space-y-3">
              {recommended.map(({ job, matched }) => (
                <li key={job._id}>
                  <Link href={`/jobs/${job._id}`} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-ink-950/40 p-4 transition hover:border-brand/40">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">{job.title}</p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">{job.name} · {job.location} · {job.jobType}</p>
                      {matched.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {matched.slice(0, 4).map((skill) => <span key={skill} className="chip !text-[10px]">{skill}</span>)}
                        </div>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-slate-500">{timeAgo(job.createdAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No open roles right now. Check the remote feed on the jobs page.</p>
          )}
        </section>

        {/* Recent applications */}
        <section className="card p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent applications</h2>
            <Link href="/applications" className="btn-link">View all <ArrowRight size={14} /></Link>
          </div>
          {applications.length ? (
            <ul className="divide-y divide-slate-100">
              {applications.slice(0, 5).map((item) => (
                <li key={item._id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{item.job?.title || "Job no longer listed"}</p>
                    <p className="text-xs text-slate-500">{item.job?.name} · {formatDate(item.createdAt)}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">You haven&apos;t applied anywhere yet.</p>
          )}
        </section>
      </div>

      {/* Skills */}
      {profile.skills.length > 0 && (
        <section className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your skills</h2>
            <Link href="/learning" className="btn-link">Learning paths <ArrowRight size={14} /></Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => <span key={skill} className="chip">{skill}</span>)}
          </div>
        </section>
      )}
    </div>
  );
}
