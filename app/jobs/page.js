"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BriefcaseBusiness, Globe2, MapPin, Search, Sparkles } from "lucide-react";
import { api, formatDate, timeAgo } from "@/lib/client";
import { JOB_TYPES } from "@/lib/constants";
import { matchSkills, useProfile } from "@/lib/profile";
import { Alert, EmptyState, LoadingBlock, PageHeader } from "@/components/ui";

const TABS = [
  { id: "internal", label: "Posted here", icon: BriefcaseBusiness },
  { id: "remote", label: "Remote feed", icon: Globe2 },
];

export default function JobsPage() {
  const { profile } = useProfile();
  const [tab, setTab] = useState("internal");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [matchedOnly, setMatchedOnly] = useState(false);
  const [internal, setInternal] = useState({ jobs: [], loading: true, error: "" });
  const [remote, setRemote] = useState({ jobs: [], loading: false, loaded: false, error: "" });

  useEffect(() => {
    api("/api/jobs")
      .then((data) => setInternal({ jobs: data.jobs || [], loading: false, error: "" }))
      .catch((err) => setInternal({ jobs: [], loading: false, error: err.message }));
  }, []);

  useEffect(() => {
    if (tab !== "remote" || remote.loaded || remote.loading) return;
    setRemote((current) => ({ ...current, loading: true }));
    api("/api/jobs/remote")
      .then((data) => setRemote({ jobs: data.jobs || [], loading: false, loaded: true, error: "" }))
      .catch((err) => setRemote({ jobs: [], loading: false, loaded: true, error: err.message }));
  }, [tab, remote.loaded, remote.loading]);

  const q = query.trim().toLowerCase();
  const internalJobs = useMemo(
    () =>
      internal.jobs
        .map((job) => ({ job, matched: matchSkills(profile.skills, job.skills || []) }))
        .filter(({ job, matched }) => {
          if (type && job.jobType !== type) return false;
          if (matchedOnly && !matched.length) return false;
          if (!q) return true;
          return [job.title, job.name, job.location, ...(job.skills || [])].some((value) => String(value || "").toLowerCase().includes(q));
        }),
    [internal.jobs, profile.skills, type, matchedOnly, q]
  );
  const remoteJobs = useMemo(
    () =>
      remote.jobs
        .map((job) => ({ job, matched: matchSkills(profile.skills, job.tags) }))
        .filter(({ job, matched }) => {
          if (matchedOnly && !matched.length) return false;
          if (!q) return true;
          return [job.position, job.company, job.location, ...job.tags].some((value) => String(value || "").toLowerCase().includes(q));
        }),
    [remote.jobs, profile.skills, matchedOnly, q]
  );

  const active = tab === "internal" ? internal : remote;
  const list = tab === "internal" ? internalJobs : remoteJobs;

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader kicker="Opportunities" title="Find jobs" description="Roles posted by recruiters here, plus a live feed of remote openings — matched to your skills." />

      <div className="card mb-6 flex flex-col gap-3 p-3 lg:flex-row lg:items-center">
        <div className="flex gap-1 rounded-xl bg-ink-950/60 p-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-pressed={tab === id}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                tab === id ? "bg-brand/10 text-slate-900 shadow-[inset_0_0_0_1px_rgba(37,99,235,0.4)]" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>
        <label className="relative flex-1">
          <span className="sr-only">Search jobs</span>
          <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, company, location, or skill…" className="input pl-10" />
        </label>
        {tab === "internal" && (
          <select value={type} onChange={(event) => setType(event.target.value)} className="input lg:w-44" aria-label="Job type">
            <option value="">All types</option>
            {JOB_TYPES.map((item) => <option key={item}>{item}</option>)}
          </select>
        )}
        <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-600">
          <input type="checkbox" checked={matchedOnly} onChange={(event) => setMatchedOnly(event.target.checked)} className="h-4 w-4 accent-[#2563eb]" />
          <Sparkles size={14} className="text-accent" /> Matches my skills
        </label>
      </div>

      {matchedOnly && !profile.skills.length && (
        <Alert tone="info" className="mb-6">
          Add skills to your <Link href="/profile" className="font-semibold underline">profile</Link> to see matched jobs.
        </Alert>
      )}
      <Alert className="mb-6">{active.error}</Alert>

      {active.loading ? (
        <LoadingBlock label={tab === "remote" ? "Loading the remote feed…" : "Loading jobs…"} />
      ) : !list.length ? (
        <EmptyState
          icon={BriefcaseBusiness}
          title={q || type || matchedOnly ? "No jobs match your filters" : "No jobs posted yet"}
          description={q || type || matchedOnly ? "Try a broader search or clear the filters." : "Check the remote feed while recruiters add new roles."}
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-500">{list.length} job{list.length === 1 ? "" : "s"}</p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tab === "internal"
              ? internalJobs.map(({ job, matched }) => <InternalCard key={job._id} job={job} matched={matched} />)
              : remoteJobs.map(({ job, matched }) => <RemoteCard key={job.id} job={job} matched={matched} />)}
          </div>
        </>
      )}
    </div>
  );
}

function InternalCard({ job, matched }) {
  return (
    <Link href={`/jobs/${job._id}`} className="card card-hover flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-brand/30 bg-brand/10 font-display text-sm font-bold text-brand">
          {(job.name || "?").slice(0, 2).toUpperCase()}
        </span>
        <span className="chip-muted">{job.jobType}</span>
      </div>
      <h3 className="mt-4 text-lg font-semibold leading-snug">{job.title}</h3>
      <p className="mt-1 text-sm text-slate-500">{job.name}</p>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500"><MapPin size={13} /> {job.location} · {job.experience}</p>
      <p className="mt-3 line-clamp-2 text-sm text-slate-500">{job.description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {(job.skills || []).slice(0, 5).map((skill) => (
          <span key={skill} className={matched.includes(skill) ? "chip" : "chip-muted"}>{skill}</span>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between pt-5 text-xs text-slate-500">
        <span>{job.salary || "Salary not listed"}</span>
        <span>{job.applicationDeadline ? `Apply by ${formatDate(job.applicationDeadline)}` : timeAgo(job.createdAt)}</span>
      </div>
    </Link>
  );
}

function RemoteCard({ job, matched }) {
  return (
    <a href={job.url} target="_blank" rel="noopener noreferrer" className="card card-hover flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        {job.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={job.logo} alt="" className="h-11 w-11 rounded-xl border border-slate-200 bg-white object-contain p-1" loading="lazy" referrerPolicy="no-referrer" />
        ) : (
          <span className="grid h-11 w-11 place-items-center rounded-xl border border-info/30 bg-info/10 font-display text-sm font-bold text-info">
            {(job.company || "?").slice(0, 2).toUpperCase()}
          </span>
        )}
        <span className="chip-muted"><Globe2 size={12} /> Remote</span>
      </div>
      <h3 className="mt-4 text-lg font-semibold leading-snug">{job.position}</h3>
      <p className="mt-1 text-sm text-slate-500">{job.company}</p>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500"><MapPin size={13} /> {job.location}</p>
      {job.description && <p className="mt-3 line-clamp-2 text-sm text-slate-500">{job.description}</p>}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {job.tags.slice(0, 5).map((tag) => (
          <span key={tag} className={matched.includes(tag) ? "chip" : "chip-muted"}>{tag}</span>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between pt-5 text-xs text-slate-500">
        <span>{timeAgo(job.date)}</span>
        <span className="inline-flex items-center gap-1 font-semibold text-brand">Apply on RemoteOK <ArrowUpRight size={13} /></span>
      </div>
    </a>
  );
}
