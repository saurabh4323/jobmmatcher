"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BriefcaseBusiness, Mail, Phone, Search, Users } from "lucide-react";

export default function CandidatePage() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const recruiterEmail = localStorage.getItem("recemail");
    if (!recruiterEmail) {
      setError("Sign in as a recruiter to view applications.");
      setLoading(false);
      return;
    }
    axios.get("/api/applications", { params: { recruiterEmail } })
      .then(({ data }) => setApplications(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.response?.data?.error || "Could not load applications."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return applications;
    return applications.filter((item) => [item.fullName, item.email, item.phone, item.jobTitle, item.company]
      .some((value) => String(value || "").toLowerCase().includes(query)));
  }, [applications, search]);

  return (
    <main className="min-h-screen bg-[#0c111f] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-blue-300">Recruiting</p>
          <h1 className="text-3xl font-bold tracking-tight text-white">Candidates</h1>
          <p className="mt-2 text-sm text-slate-400">Applications submitted for your job listings.</p>
        </header>

        <div className="mb-5 flex flex-col gap-4 rounded-xl border border-slate-800 bg-[#111827] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-400"><Users size={17} /> {applications.length} application{applications.length === 1 ? "" : "s"}</div>
          <label className="relative block w-full sm:max-w-sm">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search candidates or jobs…" className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-blue-500" />
          </label>
        </div>

        {error && <div role="alert" className="mb-5 rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-200">{error}</div>}
        {loading ? <div className="rounded-xl border border-slate-800 bg-[#111827] p-12 text-center text-slate-400">Loading applications…</div> : filtered.length ? (
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#111827]">
            <div className="hidden grid-cols-[1.2fr_1fr_1.2fr_0.8fr] gap-4 border-b border-slate-800 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 md:grid">
              <span>Candidate</span><span>Contact</span><span>Job</span><span>Applied</span>
            </div>
            <ul className="divide-y divide-slate-800">
              {filtered.map((item) => (
                <li key={item._id} className="grid gap-4 px-5 py-5 md:grid-cols-[1.2fr_1fr_1.2fr_0.8fr] md:items-center">
                  <div><p className="font-semibold text-white">{item.fullName || "Candidate"}</p><p className="mt-1 text-xs text-slate-500">Status: {item.status || "applied"}</p></div>
                  <div className="space-y-1 text-sm text-slate-300"><a className="flex items-center gap-2 hover:text-blue-300" href={`mailto:${item.email}`}><Mail size={14} />{item.email}</a>{item.phone && <a className="flex items-center gap-2 hover:text-blue-300" href={`tel:${item.phone}`}><Phone size={14} />{item.phone}</a>}</div>
                  <div className="flex items-start gap-2 text-sm"><BriefcaseBusiness size={16} className="mt-0.5 shrink-0 text-blue-300" /><span><span className="font-medium text-slate-200">{item.jobTitle}</span>{item.company && <span className="block text-slate-500">{item.company}</span>}{item.resumeUrl && <a className="mt-1 inline-block text-blue-300 hover:underline" href={item.resumeUrl} target="_blank" rel="noreferrer">View resume</a>}</span></div>
                  <time className="text-sm text-slate-400">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}</time>
                  {item.coverLetter && <p className="whitespace-pre-wrap text-sm leading-6 text-slate-400 md:col-span-4">{item.coverLetter}</p>}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <section className="rounded-2xl border border-slate-800 bg-[#111827] px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300"><Users size={26} /></div>
            <h2 className="mt-5 text-xl font-semibold text-white">{search ? "No matching candidates" : "No applications yet"}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">{search ? "Try another name, email, or job title." : "Share a job link with candidates. Their submitted applications will appear here."}</p>
          </section>
        )}
      </div>
    </main>
  );
}
