"use client";

import Link from "next/link";
import { ArrowLeft, Download, PencilLine } from "lucide-react";
import { useProfile } from "@/lib/profile";
import { RESUME_TEMPLATES, ResumeDocument } from "@/components/resume/templates";
import { Alert, LoadingBlock } from "@/components/ui";

export default function ResumePreview({ template }) {
  const meta = RESUME_TEMPLATES.find((item) => item.id === template);
  const { profile, loading, error } = useProfile();

  if (loading) return <LoadingBlock label="Rendering your resume…" />;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="kicker mb-2">Resume · {meta.name}</p>
          <h1 className="text-2xl font-bold">{profile.full_name || "Your resume"}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/resume/templates" className="btn btn-ghost"><ArrowLeft size={16} /> Designs</Link>
          <Link href="/resume" className="btn btn-ghost"><PencilLine size={16} /> Edit content</Link>
          <button type="button" onClick={() => window.print()} className="btn btn-primary" disabled={!profile.full_name}>
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      <div className="no-print">
        <Alert className="mb-4">{error}</Alert>
        {!profile.full_name ? (
          <Alert tone="info" className="mb-4">
            Nothing to show yet — <Link href="/resume" className="font-semibold underline">add your details</Link> first.
          </Alert>
        ) : (
          <p className="mb-4 text-xs text-slate-500">
            Tip: in the print dialog choose “Save as PDF”, paper size A4, and turn on “Background graphics”.
          </p>
        )}
      </div>

      <div className="overflow-x-auto pb-6 print-reset">
        <ResumeDocument template={meta.id} profile={profile} />
      </div>
    </div>
  );
}
