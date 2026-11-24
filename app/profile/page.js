"use client";

import Link from "next/link";
import { useState } from "react";
import { FileText, Save } from "lucide-react";
import { useProfile } from "@/lib/profile";
import ProfileEditor from "@/components/profile/ProfileEditor";
import { Alert, LoadingBlock, PageHeader, Spinner } from "@/components/ui";

export default function ProfilePage() {
  const { profile, setProfile, loading, error, save } = useProfile();
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ tone: "", message: "" });

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus({ tone: "", message: "" });
    try {
      await save(profile);
      setStatus({ tone: "success", message: "Profile saved." });
    } catch (err) {
      setStatus({ tone: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingBlock label="Loading your profile…" />;

  return (
    <form onSubmit={submit} className="mx-auto max-w-5xl">
      <PageHeader
        kicker="Account"
        title="Your profile"
        description="This powers your resume, job matching, and learning recommendations."
        actions={
          <>
            <Link href="/resume/templates" className="btn btn-ghost"><FileText size={16} /> Preview resume</Link>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? <Spinner className="!text-ink-950" /> : <Save size={16} />} Save profile
            </button>
          </>
        }
      />
      <Alert className="mb-6">{error}</Alert>
      <Alert tone={status.tone || "error"} className="mb-6">{status.message}</Alert>

      <ProfileEditor value={profile} onChange={setProfile} />

      <div className="sticky bottom-4 mt-8 flex justify-end">
        <button type="submit" disabled={saving} className="btn btn-primary btn-lg">
          {saving ? <Spinner className="!text-ink-950" /> : <Save size={18} />} Save profile
        </button>
      </div>
    </form>
  );
}
