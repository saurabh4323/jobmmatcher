"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PublicJobPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", resumeUrl: "", coverLetter: "" });

  useEffect(() => {
    if (!id) return;
    fetch(`/api/rec/job/id/${id}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Job not found.");
        setJob(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const apply = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, jobId: id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not submit your application.");
      setSuccess("Your application was submitted successfully.");
      setForm({ fullName: "", email: "", phone: "", resumeUrl: "", coverLetter: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <main className="min-h-screen bg-[#0c111f] p-10 text-center text-slate-300">Loading job…</main>;
  if (!job) return <main className="min-h-screen bg-[#0c111f] p-10 text-center text-red-300">{error || "Job not found."}</main>;

  return (
    <main className="min-h-screen bg-[#0c111f] px-4 py-10 text-slate-100 sm:px-6">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_0.9fr]">
        <section className="rounded-2xl border border-slate-800 bg-[#111827] p-7 sm:p-9">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-300">Job opportunity</p>
          <h1 className="mt-3 text-3xl font-bold text-white">{job.title}</h1>
          <p className="mt-2 text-lg text-slate-300">{job.name}{job.location ? ` · ${job.location}` : ""}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            {[job.jobType, job.experience, job.salary].filter(Boolean).map((item) => <span key={item} className="rounded-full border border-slate-700 px-3 py-1 text-slate-300">{item}</span>)}
          </div>
          <h2 className="mt-8 text-lg font-semibold">About the role</h2>
          <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-300">{job.description}</p>
          {job.skills?.length > 0 && <><h2 className="mt-7 text-lg font-semibold">Required skills</h2><div className="mt-3 flex flex-wrap gap-2">{job.skills.map((skill) => <span key={skill} className="rounded-md bg-slate-800 px-3 py-1 text-sm text-slate-300">{skill}</span>)}</div></>}
          {job.applicationDeadline && <p className="mt-7 text-sm text-slate-400">Apply by {new Date(job.applicationDeadline).toLocaleDateString()}</p>}
        </section>

        <section className="h-fit rounded-2xl border border-slate-800 bg-[#111827] p-7 sm:p-9">
          <h2 className="text-2xl font-bold">Apply for this job</h2>
          <p className="mt-2 text-sm text-slate-400">Your application will be sent directly to the hiring team.</p>
          {error && <p role="alert" className="mt-5 rounded-lg border border-red-500/30 bg-red-950/40 p-3 text-sm text-red-200">{error}</p>}
          {success ? <p role="status" className="mt-6 rounded-lg border border-emerald-500/30 bg-emerald-950/30 p-4 text-emerald-200">{success}</p> : (
            <form onSubmit={apply} className="mt-6 space-y-4">
              <Field label="Full name" name="fullName" value={form.fullName} onChange={update} required />
              <Field label="Email address" name="email" type="email" value={form.email} onChange={update} required />
              <Field label="Phone (optional)" name="phone" type="tel" value={form.phone} onChange={update} />
              <Field label="Resume link (optional)" name="resumeUrl" type="url" value={form.resumeUrl} onChange={update} placeholder="https://…" />
              <label className="block text-sm text-slate-300">Cover letter (optional)<textarea name="coverLetter" value={form.coverLetter} onChange={update} rows={4} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-blue-500" /></label>
              <button disabled={submitting} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-60">{submitting ? "Submitting…" : "Submit application"}</button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}

function Field({ label, name, value, onChange, type = "text", required = false, placeholder = "" }) {
  return <label className="block text-sm text-slate-300">{label}<input name={name} type={type} value={value} onChange={onChange} required={required} placeholder={placeholder} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-white outline-none focus:border-blue-500" /></label>;
}
