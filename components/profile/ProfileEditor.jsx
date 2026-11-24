"use client";

import { useState } from "react";
import { GraduationCap, Plus, Sparkles, Trash2, X } from "lucide-react";
import { askAI } from "@/lib/client";
import { Field, Spinner } from "@/components/ui";

const blankExperience = { title: "", company: "", dates: "", description: "" };
const blankEducation = { school: "", degree: "", year: "" };

/** Controlled editor for every candidate profile field. */
export default function ProfileEditor({ value, onChange, showPreferences = true }) {
  const [skillDraft, setSkillDraft] = useState("");
  const [aiBusy, setAiBusy] = useState("");
  const [aiError, setAiError] = useState("");

  const set = (key, next) => onChange({ ...value, [key]: next });
  const input = (key) => ({ name: key, value: value[key] || "", onChange: (event) => set(key, event.target.value) });

  const addSkills = (raw) => {
    const incoming = raw.split(",").map((skill) => skill.trim()).filter(Boolean);
    if (!incoming.length) return;
    const existing = new Set(value.skills.map((skill) => skill.toLowerCase()));
    set("skills", [...value.skills, ...incoming.filter((skill) => !existing.has(skill.toLowerCase()))]);
    setSkillDraft("");
  };

  const updateItem = (key, index, patch) =>
    set(key, value[key].map((item, i) => (i === index ? { ...item, ...patch } : item)));
  const removeItem = (key, index) => set(key, value[key].filter((_, i) => i !== index));

  const improveSummary = async () => {
    setAiBusy("summary");
    setAiError("");
    try {
      const text = await askAI(
        `Rewrite this into a confident, specific 3-sentence professional resume summary in first person without pronouns. ` +
          `Headline: ${value.headline || "n/a"}. Skills: ${value.skills.join(", ") || "n/a"}. ` +
          `Roles: ${value.experiences.map((e) => `${e.title} at ${e.company}`).join("; ") || "n/a"}. ` +
          `Current summary: ${value.summary || "(empty — write one from the details above)"}`,
        "You are an expert resume writer. Reply with only the summary text, no preamble, no quotes."
      );
      if (text) set("summary", text);
    } catch (err) {
      setAiError(err.message);
    } finally {
      setAiBusy("");
    }
  };

  const improveExperience = async (index) => {
    const role = value.experiences[index];
    setAiBusy(`exp-${index}`);
    setAiError("");
    try {
      const text = await askAI(
        `Write 2-3 concise resume bullet sentences (as one paragraph, no bullet characters) describing impact for this role. ` +
          `Title: ${role.title}. Company: ${role.company}. Candidate skills: ${value.skills.join(", ")}. ` +
          `Existing notes: ${role.description || "none"}. Do not invent specific numbers.`,
        "You are an expert resume writer. Reply with only the description text."
      );
      if (text) updateItem("experiences", index, { description: text });
    } catch (err) {
      setAiError(err.message);
    } finally {
      setAiBusy("");
    }
  };

  return (
    <div className="space-y-6">
      <Section title="Basics" description="How you appear on your resume and to recruiters.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Full name" required {...input("full_name")} autoComplete="name" />
          <Field label="Headline" placeholder="e.g. Frontend engineer · React & TypeScript" {...input("headline")} />
          <Field label="Contact email" type="email" placeholder="Shown on your resume" {...input("email")} />
          <Field label="Phone" type="tel" {...input("phone")} autoComplete="tel" />
          <Field label="City" {...input("city")} />
          <Field label="Country" {...input("country")} />
        </div>
      </Section>

      <Section
        title="Summary"
        description="Two or three sentences on who you are and what you do best."
        action={
          <button type="button" onClick={improveSummary} disabled={Boolean(aiBusy)} className="btn btn-ghost btn-sm">
            {aiBusy === "summary" ? <Spinner size={14} /> : <Sparkles size={14} className="text-accent" />}
            {value.summary ? "Improve with AI" : "Write with AI"}
          </button>
        }
      >
        <textarea rows={5} className="input" placeholder="Describe your experience and goals…" {...input("summary")} />
      </Section>

      <Section title="Skills" description="Used to match you with jobs and learning paths.">
        <div className="flex flex-wrap gap-2">
          {value.skills.map((skill) => (
            <span key={skill} className="chip">
              {skill}
              <button type="button" onClick={() => set("skills", value.skills.filter((item) => item !== skill))} aria-label={`Remove ${skill}`} className="-mr-1 rounded-full p-0.5 hover:bg-slate-200">
                <X size={12} />
              </button>
            </span>
          ))}
          {!value.skills.length && <p className="text-sm text-slate-500">No skills yet.</p>}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            className="input"
            value={skillDraft}
            onChange={(event) => setSkillDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === ",") {
                event.preventDefault();
                addSkills(skillDraft);
              }
            }}
            placeholder="Type a skill and press Enter (comma-separate several)"
            aria-label="Add skill"
          />
          <button type="button" onClick={() => addSkills(skillDraft)} className="btn btn-ghost">
            <Plus size={16} /> Add
          </button>
        </div>
      </Section>

      <Section
        title="Experience"
        action={
          <button type="button" onClick={() => set("experiences", [...value.experiences, { ...blankExperience }])} className="btn btn-ghost btn-sm">
            <Plus size={14} /> Add role
          </button>
        }
      >
        {!value.experiences.length && <p className="text-sm text-slate-500">Add your most recent roles first.</p>}
        <div className="space-y-4">
          {value.experiences.map((role, index) => (
            <div key={index} className="rounded-2xl border border-slate-200 bg-ink-950/50 p-4">
              <div className="grid gap-3 md:grid-cols-3">
                <Field label="Title" value={role.title} onChange={(e) => updateItem("experiences", index, { title: e.target.value })} name={`exp-title-${index}`} />
                <Field label="Company" value={role.company} onChange={(e) => updateItem("experiences", index, { company: e.target.value })} name={`exp-company-${index}`} />
                <Field label="Dates" placeholder="Jan 2022 – Present" value={role.dates} onChange={(e) => updateItem("experiences", index, { dates: e.target.value })} name={`exp-dates-${index}`} />
              </div>
              <div className="mt-3">
                <label className="label" htmlFor={`exp-desc-${index}`}>What you did</label>
                <textarea id={`exp-desc-${index}`} rows={3} className="input" value={role.description} onChange={(e) => updateItem("experiences", index, { description: e.target.value })} />
              </div>
              <div className="mt-3 flex flex-wrap justify-between gap-2">
                <button type="button" onClick={() => improveExperience(index)} disabled={Boolean(aiBusy) || !(role.title || role.company)} className="btn btn-ghost btn-sm">
                  {aiBusy === `exp-${index}` ? <Spinner size={14} /> : <Sparkles size={14} className="text-accent" />} Polish with AI
                </button>
                <button type="button" onClick={() => removeItem("experiences", index)} className="btn btn-danger btn-sm">
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Education"
        action={
          <button type="button" onClick={() => set("education", [...value.education, { ...blankEducation }])} className="btn btn-ghost btn-sm">
            <Plus size={14} /> Add education
          </button>
        }
      >
        {!value.education.length && <p className="text-sm text-slate-500">Degrees, bootcamps, or certifications.</p>}
        <div className="space-y-3">
          {value.education.map((item, index) => (
            <div key={index} className="grid items-end gap-3 rounded-2xl border border-slate-200 bg-ink-950/50 p-4 md:grid-cols-[1.3fr_1.3fr_0.7fr_auto]">
              <Field label="School" value={item.school} onChange={(e) => updateItem("education", index, { school: e.target.value })} name={`edu-school-${index}`} />
              <Field label="Degree" value={item.degree} onChange={(e) => updateItem("education", index, { degree: e.target.value })} name={`edu-degree-${index}`} />
              <Field label="Year" value={item.year} onChange={(e) => updateItem("education", index, { year: e.target.value })} name={`edu-year-${index}`} />
              <button type="button" onClick={() => removeItem("education", index)} className="btn btn-danger" aria-label="Remove education">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Links">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="LinkedIn" placeholder="linkedin.com/in/you" {...input("linkedIn")} />
          <Field label="GitHub" placeholder="github.com/you" {...input("github")} />
          <Field label="Website" placeholder="you.dev" {...input("website")} />
        </div>
      </Section>

      {showPreferences && (
        <Section title="Job preferences">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Preferred work mode">
              <select id="preferredWork" className="input" value={value.preferredWork} onChange={(event) => set("preferredWork", event.target.value)}>
                <option>Remote</option>
                <option>Hybrid</option>
                <option>On-site</option>
              </select>
            </Field>
            <label className="flex cursor-pointer items-center gap-3 self-end rounded-xl border border-slate-200 bg-ink-950/60 px-4 py-2.5 text-sm text-slate-700">
              <input type="checkbox" checked={value.openToWork} onChange={(event) => set("openToWork", event.target.checked)} className="h-4 w-4 accent-[#2563eb]" />
              Open to work — let recruiters know I&apos;m looking
            </label>
          </div>
        </Section>
      )}

      {aiError && (
        <p role="alert" className="text-sm text-red-700">
          AI: {aiError}
        </p>
      )}
    </div>
  );
}

function Section({ title, description, action, children }) {
  return (
    <section className="card p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold">
            {title === "Education" && <GraduationCap size={17} className="text-brand" />}
            {title}
          </h2>
          {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
