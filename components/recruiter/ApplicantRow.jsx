"use client";

import { useState } from "react";
import { ChevronDown, FileText, Mail, Phone } from "lucide-react";
import { api, formatDate } from "@/lib/client";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { StatusBadge } from "@/components/ui";

/** One applicant with an inline status picker. Calls onChange(updated) after saving. */
export default function ApplicantRow({ application, showJob = false, onChange }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const setStatus = async (status) => {
    setSaving(true);
    setError("");
    try {
      const data = await api(`/api/recruiter/applications/${application._id}`, { method: "PATCH", body: { status } });
      onChange?.({ ...application, status: data.application.status });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <li className="px-5 py-4">
      <div className="grid gap-3 md:grid-cols-[1.2fr_1.2fr_1fr_auto] md:items-center">
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">{application.fullName}</p>
          <p className="text-xs text-slate-500">Applied {formatDate(application.createdAt)}</p>
        </div>
        <div className="min-w-0 space-y-1 text-sm">
          <a href={`mailto:${application.email}`} className="flex items-center gap-2 truncate text-slate-600 hover:text-brand"><Mail size={13} /> {application.email}</a>
          {application.phone && <a href={`tel:${application.phone}`} className="flex items-center gap-2 text-slate-500 hover:text-brand"><Phone size={13} /> {application.phone}</a>}
        </div>
        <div className="min-w-0 text-sm">
          {showJob && <p className="truncate font-medium text-slate-700">{application.jobTitle}</p>}
          {application.resumeUrl ? (
            <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-brand hover:text-slate-900"><FileText size={13} /> Resume</a>
          ) : (
            <span className="text-xs text-slate-400">No resume link</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor={`status-${application._id}`}>Status</label>
          <select
            id={`status-${application._id}`}
            value={application.status || "applied"}
            onChange={(event) => setStatus(event.target.value)}
            disabled={saving}
            className="input !w-36 !py-1.5 text-xs capitalize"
          >
            {APPLICATION_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <span className="hidden lg:inline"><StatusBadge status={application.status} /></span>
          {application.coverLetter && (
            <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-lg p-1.5 text-slate-500 hover:text-slate-900" aria-expanded={open} aria-label="Toggle cover letter">
              <ChevronDown size={16} className={`transition ${open ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
      {open && application.coverLetter && (
        <p className="mt-3 whitespace-pre-wrap rounded-xl border border-slate-200 bg-ink-950/60 p-4 text-sm leading-6 text-slate-600">{application.coverLetter}</p>
      )}
    </li>
  );
}
