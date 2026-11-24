"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarClock, CheckCircle2, MapPin, Send } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { api, formatDate } from "@/lib/client";
import { Alert, Field, Spinner } from "@/components/ui";

const EMPTY = { fullName: "", email: "", phone: "", resumeUrl: "", coverLetter: "" };

export default function JobApply({ job }) {
  const id = job._id;
  const { user } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const isCandidate = user?.role === "candidate";

  // Pre-fill from the signed-in candidate's account and profile.
  useEffect(() => {
    if (!isCandidate) return;
    setForm((current) => ({ ...current, fullName: user.fullName, email: user.email }));
    api("/api/profile")
      .then(({ profile }) =>
        setForm((current) => ({ ...current, fullName: profile.full_name || current.fullName, phone: profile.phone || current.phone }))
      )
      .catch(() => {});
  }, [isCandidate, user]);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const closed = job.status === "closed" || (job.applicationDeadline && new Date(job.applicationDeadline) < new Date());

  const apply = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api("/api/applications", { method: "POST", body: { ...form, jobId: id } });
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`mx-auto max-w-6xl ${user ? "" : "px-5 py-10 sm:px-8"}`}>
      <Link href={isCandidate ? "/jobs" : "/"} className="btn-link mb-6"><ArrowLeft size={15} /> {isCandidate ? "Back to jobs" : "Job Matcher home"}</Link>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <article className="card p-6 sm:p-8">
          <p className="kicker mb-3">Job opportunity</p>
          <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
          <p className="mt-2 text-lg text-slate-600">{job.name}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="chip-muted"><MapPin size={12} /> {job.location}</span>
            {[job.jobType, job.experience, job.salary].filter(Boolean).map((item) => <span key={item} className="chip-muted">{item}</span>)}
          </div>

          <div className="divider my-7" />
          <h2 className="text-lg font-semibold">About the role</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">{job.description}</p>

          {job.skills?.length > 0 && (
            <>
              <h2 className="mt-8 text-lg font-semibold">Skills</h2>
              <div className="mt-3 flex flex-wrap gap-2">{job.skills.map((skill) => <span key={skill} className="chip">{skill}</span>)}</div>
            </>
          )}
          {job.applicationDeadline && (
            <p className="mt-8 flex items-center gap-2 text-sm text-slate-500"><CalendarClock size={16} className="text-accent" /> Apply by {formatDate(job.applicationDeadline)}</p>
          )}
        </article>

        <aside className="neon-border card h-fit rounded-3xl p-6 sm:p-8 lg:sticky lg:top-24">
          {done ? (
            <div className="py-6 text-center">
              <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-success/40 bg-success/10 text-success">
                <CheckCircle2 size={26} />
              </div>
              <h2 className="text-xl font-semibold">Application sent</h2>
              <p className="mt-2 text-sm text-slate-500">The hiring team at {job.name} will review it soon.</p>
              {isCandidate ? (
                <Link href="/applications" className="btn btn-primary mt-6">Track my applications</Link>
              ) : (
                <Link href="/register" className="btn btn-ghost mt-6">Create an account to track it</Link>
              )}
            </div>
          ) : user?.role === "recruiter" ? (
            <div className="text-sm text-slate-500">
              <h2 className="mb-2 text-lg font-semibold text-slate-900">Recruiter preview</h2>
              This is the page candidates see. Share its URL to collect applications.
            </div>
          ) : closed ? (
            <div>
              <h2 className="text-xl font-semibold">Applications closed</h2>
              <p className="mt-2 text-sm text-slate-500">This role is no longer accepting applications.</p>
            </div>
          ) : (
            <form onSubmit={apply} className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Apply for this role</h2>
                <p className="mt-1 text-sm text-slate-500">Your application goes straight to the hiring team.</p>
              </div>
              <Field label="Full name" name="fullName" value={form.fullName} onChange={update} required autoComplete="name" />
              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={update}
                required
                readOnly={isCandidate}
                hint={isCandidate ? "Using your account email so you can track this application." : undefined}
                autoComplete="email"
              />
              <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={update} autoComplete="tel" />
              <Field label="Resume link" name="resumeUrl" type="url" value={form.resumeUrl} onChange={update} placeholder="https://drive.google.com/…" />
              <Field label="Cover letter" as="textarea" name="coverLetter" rows={4} value={form.coverLetter} onChange={update} placeholder="Why you're a great fit…" />
              <Alert>{error}</Alert>
              <button type="submit" disabled={submitting} className="btn btn-primary w-full py-3">
                {submitting ? <Spinner className="!text-ink-950" /> : <Send size={16} />} Submit application
              </button>
              {!user && (
                <p className="text-center text-xs text-slate-500">
                  Have an account? <Link href={`/login?next=/jobs/${id}`} className="text-brand">Sign in</Link> to track applications.
                </p>
              )}
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}
