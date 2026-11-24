"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { askAI } from "@/lib/client";
import { EXPERIENCE_LABELS, EXPERIENCE_LEVELS, JOB_TYPES } from "@/lib/constants";
import { Alert, Field, Spinner } from "@/components/ui";

export const EMPTY_JOB = {
  title: "",
  name: "",
  location: "",
  description: "",
  skills: "",
  experience: "",
  jobType: "Full-time",
  salary: "",
  applicationDeadline: "",
};

/** Converts an API job into form state. */
export function jobToForm(job) {
  return {
    ...EMPTY_JOB,
    ...job,
    skills: (job.skills || []).join(", "),
    applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().slice(0, 10) : "",
  };
}

export default function JobForm({ initial = EMPTY_JOB, submitLabel, onSubmit }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [error, setError] = useState("");

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const today = new Date().toISOString().slice(0, 10);

  const draftDescription = async () => {
    if (!form.title) {
      setError("Add a job title first so AI knows what to write.");
      return;
    }
    setDrafting(true);
    setError("");
    try {
      const text = await askAI(
        `Write a job description for "${form.title}" at ${form.name || "our company"} (${form.jobType}, ${form.location || "location flexible"}, ${form.experience || "any level"}). ` +
          `Key skills: ${form.skills || "not specified"}. Include a 2-sentence intro, "What you'll do" with 4 bullets, and "What we're looking for" with 4 bullets. Use plain text with "- " bullets. No salary, no invented benefits.`,
        "You write clear, inclusive job descriptions. Reply with only the description."
      );
      if (text) setForm((current) => ({ ...current, description: text }));
    } catch (err) {
      setError(err.message);
    } finally {
      setDrafting(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSubmit({
        ...form,
        skills: form.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
        applicationDeadline: form.applicationDeadline || null,
      });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-5 p-6 sm:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Job title" name="title" value={form.title} onChange={update} required placeholder="Senior frontend engineer" />
        <Field label="Company" name="name" value={form.name} onChange={update} required placeholder="Acme Inc." />
        <Field label="Location" name="location" value={form.location} onChange={update} required placeholder="Remote · Bengaluru · Hybrid (NYC)" />
        <Field label="Salary range" name="salary" value={form.salary} onChange={update} placeholder="₹18–24 LPA or $90k–$120k" />
        <Field label="Experience level" required>
          <select id="experience" name="experience" value={form.experience} onChange={update} required className="input">
            <option value="" disabled>Select a level</option>
            {EXPERIENCE_LEVELS.map((level) => <option key={level} value={level}>{EXPERIENCE_LABELS[level]}</option>)}
          </select>
        </Field>
        <Field label="Job type" required>
          <select id="jobType" name="jobType" value={form.jobType} onChange={update} required className="input">
            {JOB_TYPES.map((type) => <option key={type}>{type}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Required skills" name="skills" value={form.skills} onChange={update} required placeholder="React, TypeScript, GraphQL" hint="Comma-separated. Used to match candidates." />

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="description" className="label !mb-0">Description<span className="text-accent"> *</span></label>
          <button type="button" onClick={draftDescription} disabled={drafting} className="btn btn-ghost btn-sm">
            {drafting ? <Spinner size={14} /> : <Sparkles size={14} className="text-accent" />} {form.description ? "Rewrite with AI" : "Draft with AI"}
          </button>
        </div>
        <textarea id="description" name="description" rows={10} value={form.description} onChange={update} required className="input" placeholder="What the role involves and who you're looking for…" />
      </div>

      <Field label="Application deadline" name="applicationDeadline" type="date" min={today} value={form.applicationDeadline} onChange={update} hint="Optional. Applications close automatically after this date." className="md:w-1/2" />

      <Alert>{error}</Alert>

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="btn btn-primary btn-lg">
          {saving && <Spinner className="!text-ink-950" />} {submitLabel}
        </button>
      </div>
    </form>
  );
}
