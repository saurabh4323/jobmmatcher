"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowRight, FilePenLine, FileUp, UploadCloud } from "lucide-react";
import { useProfile } from "@/lib/profile";
import { parseResumeText, readResumeFile } from "@/lib/resumeParser";
import ProfileEditor from "@/components/profile/ProfileEditor";
import { Alert, LoadingBlock, PageHeader, Spinner } from "@/components/ui";

export default function ResumeBuilderPage() {
  const router = useRouter();
  const fileInput = useRef(null);
  const { profile, setProfile, loading, error: loadError, save } = useProfile();
  const [mode, setMode] = useState("");
  const [importing, setImporting] = useState(false);
  const [fileName, setFileName] = useState("");
  const [notice, setNotice] = useState({ tone: "", message: "" });
  const [saving, setSaving] = useState(false);

  const hasContent = Boolean(profile.summary || profile.experiences.length || profile.skills.length);
  const step = mode || (hasContent ? "edit" : "");

  const importFile = async (file) => {
    if (!file) return;
    setImporting(true);
    setFileName(file.name);
    setNotice({ tone: "", message: "" });
    try {
      const text = await readResumeFile(file);
      if (!text.trim()) throw new Error("No selectable text found — the PDF may be a scanned image. Fill in the fields manually.");
      const parsed = parseResumeText(text);
      // Merge: keep what the user already has unless the import found something.
      setProfile((current) => ({
        ...current,
        ...Object.fromEntries(Object.entries(parsed).filter(([, value]) => (Array.isArray(value) ? value.length : value))),
      }));
      setMode("edit");
      setNotice({
        tone: "info",
        message: `Imported ${file.name}. Review each section — automatic parsing isn't perfect.`,
      });
    } catch (err) {
      setNotice({ tone: "error", message: err.message || "Could not read that file." });
    } finally {
      setImporting(false);
    }
  };

  const continueToDesign = async (event) => {
    event.preventDefault();
    if (!profile.full_name.trim()) {
      setNotice({ tone: "error", message: "Add your name before choosing a design." });
      return;
    }
    setSaving(true);
    try {
      await save(profile);
      router.push("/resume/templates");
    } catch (err) {
      setNotice({ tone: "error", message: err.message });
      setSaving(false);
    }
  };

  if (loading) return <LoadingBlock label="Loading resume builder…" />;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        kicker="Resume builder"
        title="Build your resume"
        description="Import an existing resume or start from scratch. Everything saves to your profile, then you pick a design to export."
        actions={step === "edit" && (
          <button type="button" onClick={() => fileInput.current?.click()} className="btn btn-ghost" disabled={importing}>
            {importing ? <Spinner /> : <FileUp size={16} />} Import file
          </button>
        )}
      />

      <input
        ref={fileInput}
        type="file"
        accept=".pdf,.txt,.md,application/pdf,text/plain"
        className="sr-only"
        onChange={(event) => {
          importFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      <Alert className="mb-6">{loadError}</Alert>
      <Alert tone={notice.tone || "error"} className="mb-6">{notice.message}</Alert>

      {step === "" ? (
        <div className="grid gap-5 md:grid-cols-2">
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              importFile(event.dataTransfer.files?.[0]);
            }}
            className="card card-hover group flex flex-col items-start p-7 text-left"
          >
            <span className="mb-6 grid h-12 w-12 place-items-center rounded-xl border border-brand/30 bg-brand/10 text-brand">
              {importing ? <Spinner size={22} /> : <UploadCloud size={22} />}
            </span>
            <span className="text-xl font-semibold text-slate-900">Upload a resume</span>
            <span className="mt-2 text-sm leading-6 text-slate-500">
              Drop a PDF or .txt here, or click to browse. It&apos;s read in your browser and the fields are filled in for you to review.
            </span>
            {fileName && <span className="chip-muted mt-4">{fileName}</span>}
          </button>
          <button type="button" onClick={() => setMode("edit")} className="card card-hover flex flex-col items-start p-7 text-left">
            <span className="mb-6 grid h-12 w-12 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
              <FilePenLine size={22} />
            </span>
            <span className="text-xl font-semibold text-slate-900">Start from scratch</span>
            <span className="mt-2 text-sm leading-6 text-slate-500">
              Add your details section by section. AI can draft your summary and polish each role.
            </span>
          </button>
        </div>
      ) : (
        <form onSubmit={continueToDesign}>
          <ProfileEditor value={profile} onChange={setProfile} showPreferences={false} />
          <div className="sticky bottom-4 mt-8 flex justify-end">
            <button type="submit" disabled={saving} className="btn btn-primary btn-lg">
              {saving ? <Spinner className="!text-ink-950" /> : null} Save & choose a design <ArrowRight size={18} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
