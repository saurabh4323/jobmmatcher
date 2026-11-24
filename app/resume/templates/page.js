"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useProfile } from "@/lib/profile";
import { RESUME_TEMPLATES, ResumeDocument } from "@/components/resume/templates";
import { Alert, LoadingBlock, PageHeader } from "@/components/ui";

export default function ResumeTemplatesPage() {
  const { profile, loading, error } = useProfile();

  if (loading) return <LoadingBlock label="Loading designs…" />;

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        kicker="Resume builder"
        title="Choose a design"
        description="Every theme uses the details from your profile. Open one to preview it full-size and download it as a PDF."
        actions={<Link href="/resume" className="btn btn-ghost"><ArrowLeft size={16} /> Edit details</Link>}
      />
      <Alert className="mb-6">{error}</Alert>
      {!profile.full_name && (
        <Alert tone="info" className="mb-6">
          Your resume is empty. <Link href="/resume" className="font-semibold underline">Add your details</Link> first.
        </Alert>
      )}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {RESUME_TEMPLATES.map((template) => (
          <Link key={template.id} href={`/resume/${template.id}`} className="card card-hover group flex flex-col overflow-hidden">
            {/* Live, scaled-down thumbnail of the real template */}
            <div className="relative h-72 overflow-hidden border-b border-slate-200 bg-ink-950" aria-hidden="true">
              <div className="pointer-events-none absolute left-1/2 top-4 w-[794px] origin-top -translate-x-1/2 scale-[0.32]">
                <ResumeDocument template={template.id} profile={profile} />
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-2">
                {template.swatch.map((color) => (
                  <span key={color} className="h-3 w-3 rounded-full border border-slate-300" style={{ background: color }} />
                ))}
                <h2 className="ml-1 text-lg font-semibold">{template.name}</h2>
              </div>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">{template.description}</p>
              <span className="btn-link mt-4">Use {template.name} <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
