"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { api } from "@/lib/client";
import { Alert, Field, LoadingBlock, PageHeader, Spinner } from "@/components/ui";

export default function RecruiterProfilePage() {
  const { setUser } = useAuth();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ tone: "", message: "" });

  useEffect(() => {
    api("/api/recruiter/profile")
      .then(({ recruiter }) => setForm({ fullName: recruiter.fullName || "", email: recruiter.email, company: recruiter.company || "", website: recruiter.website || "", about: recruiter.about || "" }))
      .catch((err) => setStatus({ tone: "error", message: err.message }));
  }, []);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus({ tone: "", message: "" });
    try {
      const { recruiter } = await api("/api/recruiter/profile", { method: "PUT", body: form });
      setUser((current) => ({ ...current, fullName: recruiter.fullName }));
      setStatus({ tone: "success", message: "Profile saved." });
    } catch (err) {
      setStatus({ tone: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (!form) return status.message ? <Alert>{status.message}</Alert> : <LoadingBlock label="Loading profile…" />;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader kicker="Account" title="Company profile" description="Your company name pre-fills new job posts." />
      <form onSubmit={submit} className="card space-y-5 p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Your name" name="fullName" value={form.fullName} onChange={update} required autoComplete="name" />
          <Field label="Sign-in email" name="email" value={form.email} readOnly hint="Your email can't be changed." />
          <Field label="Company" name="company" value={form.company} onChange={update} autoComplete="organization" />
          <Field label="Company website" name="website" value={form.website} onChange={update} placeholder="acme.com" />
        </div>
        <Field label="About the company" as="textarea" rows={5} name="about" value={form.about} onChange={update} placeholder="What you build, team size, culture…" />
        <Alert tone={status.tone || "error"}>{status.message}</Alert>
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? <Spinner className="!text-ink-950" /> : <Save size={16} />} Save profile
          </button>
        </div>
      </form>
    </div>
  );
}
