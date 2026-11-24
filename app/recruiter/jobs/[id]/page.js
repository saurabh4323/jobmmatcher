"use client";

import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Lock, PencilLine, Trash2, Unlock, Users } from "lucide-react";
import { api, formatDate } from "@/lib/client";
import JobForm, { jobToForm } from "@/components/recruiter/JobForm";
import ApplicantRow from "@/components/recruiter/ApplicantRow";
import CopyLinkButton from "@/components/recruiter/CopyLinkButton";
import { Alert, EmptyState, LoadingBlock, StatusBadge } from "@/components/ui";

export default function RecruiterJobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    api(`/api/recruiter/jobs/${id}`)
      .then((data) => {
        setJob(data.job);
        setApplications(data.applications || []);
      })
      .catch((err) => (err.status === 404 ? setMissing(true) : setError(err.message)))
      .finally(() => setLoading(false));
  }, [id]);

  if (missing) notFound();
  if (loading) return <LoadingBlock label="Loading job…" />;
  if (!job) return <Alert>{error || "Unable to load this job."}</Alert>;

  const closed = job.status === "closed";

  const patch = async (body, label) => {
    setBusy(label);
    setError("");
    try {
      const data = await api(`/api/recruiter/jobs/${id}`, { method: "PATCH", body });
      setJob(data.job);
      return data.job;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setBusy("");
    }
  };

  const remove = async () => {
    setBusy("delete");
    try {
      await api(`/api/recruiter/jobs/${id}`, { method: "DELETE" });
      router.push("/recruiter/jobs");
    } catch (err) {
      setError(err.message);
      setBusy("");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Link href="/recruiter/jobs" className="btn-link"><ArrowLeft size={14} /> Job posts</Link>

      <section className="card p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2">
              <StatusBadge status={job.status || "open"} />
              <span className="text-xs text-slate-500">Posted {formatDate(job.createdAt)}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
            <p className="mt-1 text-slate-500">{[job.name, job.location, job.jobType, job.experience].filter(Boolean).join(" · ")}</p>
            {job.applicationDeadline && <p className="mt-1 text-xs text-slate-500">Deadline {formatDate(job.applicationDeadline)}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyLinkButton jobId={job._id} className="btn btn-primary" />
            <Link href={`/jobs/${job._id}`} target="_blank" className="btn btn-ghost"><ExternalLink size={16} /> View public page</Link>
            <button type="button" onClick={() => setEditing((value) => !value)} className="btn btn-ghost"><PencilLine size={16} /> {editing ? "Cancel edit" : "Edit"}</button>
            <button type="button" onClick={() => patch({ status: closed ? "open" : "closed" }, "status").catch(() => {})} disabled={busy === "status"} className="btn btn-ghost">
              {closed ? <Unlock size={16} /> : <Lock size={16} />} {closed ? "Reopen" : "Close applications"}
            </button>
          </div>
        </div>
        <Alert className="mt-5">{error}</Alert>
      </section>

      {editing ? (
        <JobForm
          initial={jobToForm(job)}
          submitLabel="Save changes"
          onSubmit={async (payload) => {
            await patch(payload, "save");
            setEditing(false);
          }}
        />
      ) : (
        <section className="card p-6 sm:p-8">
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">{job.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">{(job.skills || []).map((skill) => <span key={skill} className="chip">{skill}</span>)}</div>
        </section>
      )}

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Users size={18} className="text-accent" /> Applicants ({applications.length})</h2>
        {applications.length ? (
          <div className="card overflow-hidden">
            <ul className="divide-y divide-slate-100">
              {applications.map((item) => (
                <ApplicantRow key={item._id} application={item} onChange={(updated) => setApplications((list) => list.map((a) => (a._id === updated._id ? updated : a)))} />
              ))}
            </ul>
          </div>
        ) : (
          <EmptyState icon={Users} title="No applicants yet" description="Share the apply link to start receiving applications." action={<CopyLinkButton jobId={job._id} className="btn btn-primary" />} />
        )}
      </section>

      <section className="card border-danger/20 p-6">
        <h2 className="font-semibold text-red-700">Danger zone</h2>
        <p className="mt-1 text-sm text-slate-500">Deleting removes this post and all {applications.length} application{applications.length === 1 ? "" : "s"}. This can&apos;t be undone.</p>
        {confirmDelete ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={remove} disabled={busy === "delete"} className="btn btn-danger"><Trash2 size={16} /> Yes, delete permanently</button>
            <button type="button" onClick={() => setConfirmDelete(false)} className="btn btn-ghost">Cancel</button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmDelete(true)} className="btn btn-danger mt-4"><Trash2 size={16} /> Delete job</button>
        )}
      </section>
    </div>
  );
}
