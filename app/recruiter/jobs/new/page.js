"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, ExternalLink } from "lucide-react";
import { api } from "@/lib/client";
import JobForm, { EMPTY_JOB } from "@/components/recruiter/JobForm";
import CopyLinkButton from "@/components/recruiter/CopyLinkButton";
import { LoadingBlock, PageHeader } from "@/components/ui";

export default function NewJobPage() {
  const [initial, setInitial] = useState(null);
  const [created, setCreated] = useState(null);

  // Pre-fill the company from the recruiter profile.
  useEffect(() => {
    api("/api/recruiter/profile")
      .then(({ recruiter }) => setInitial({ ...EMPTY_JOB, name: recruiter.company || "" }))
      .catch(() => setInitial(EMPTY_JOB));
  }, []);

  if (created) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="neon-border card rounded-3xl p-8 text-center sm:p-10">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl border border-success/40 bg-success/10 text-success"><CheckCircle2 size={30} /></div>
          <p className="kicker mb-2">Published</p>
          <h1 className="text-2xl font-bold">{created.title} is live</h1>
          <p className="mt-2 text-sm text-slate-500">Share the apply link with candidates. Their applications will show up in Candidates.</p>
          <div className="mt-6 rounded-xl border border-slate-200 bg-ink-950/70 px-4 py-3 font-mono text-xs text-blue-700 break-all">
            {typeof window !== "undefined" ? `${window.location.origin}/jobs/${created._id}` : `/jobs/${created._id}`}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <CopyLinkButton jobId={created._id} className="btn btn-primary" />
            <Link href={`/jobs/${created._id}`} target="_blank" className="btn btn-ghost"><ExternalLink size={16} /> Preview</Link>
            <Link href={`/recruiter/jobs/${created._id}`} className="btn btn-ghost">Manage post</Link>
          </div>
          <button type="button" onClick={() => setCreated(null)} className="btn-link mt-6">Post another job</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        kicker="Hiring"
        title="Post a job"
        description="Fill in the details. You'll get a shareable link the moment it's published."
        actions={<Link href="/recruiter/jobs" className="btn btn-ghost"><ArrowLeft size={16} /> Job posts</Link>}
      />
      {initial ? (
        <JobForm
          key={initial.name}
          initial={initial}
          submitLabel="Publish job"
          onSubmit={async (payload) => {
            const { job } = await api("/api/recruiter/jobs", { method: "POST", body: payload });
            setCreated(job);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      ) : (
        <LoadingBlock />
      )}
    </div>
  );
}
