"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, FileText, Sparkles, ArrowRight } from "lucide-react";

const emptyResume = {
  full_name: "",
  headline: "",
  email: "",
  phone: "",
  city: "",
  country: "",
  summary: "",
  skills: [],
  experiences: [],
  education: [],
};

const sectionPattern = /^(professional\s+)?(summary|profile|objective|experience|work\s+experience|employment|education|academic|skills|technical\s+skills|projects|certifications|achievements|publications|languages|interests)\s*:?$/i;

function parseResumeText(text) {
  const lines = text.split(/\r?\n/).map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean);
  const sectionAt = (names) => lines.findIndex((line) => names.test(line));
  const firstSection = lines.findIndex((line) => sectionPattern.test(line));
  const header = lines.slice(0, firstSection < 0 ? 8 : firstSection);
  const email = text.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)?.[0] || "";
  const phoneMatch = text.match(/(?:\+?\d[\d\s().-]{7,}\d)/);
  const phone = phoneMatch?.[0]?.replace(/\s+/g, " ").trim() || "";
  const isContact = (line) => /@|https?:\/\/|www\.|linkedin|github|portfolio/i.test(line) || /(?:\+?\d[\d\s().-]{7,}\d)/.test(line);
  const firstContactIndex = (line) => {
    const positions = [line.search(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/), line.search(/(?:\+?\d[\d\s().-]{7,}\d)/), line.search(/https?:\/\/|www\.|linkedin|github|portfolio/i)].filter((position) => position >= 0);
    return positions.length ? Math.min(...positions) : line.length;
  };
  const fullName = header.map((line) => line.slice(0, firstContactIndex(line)).replace(/[|,•\s-]+$/g, "").trim()).find((line) => /[A-Za-z]/.test(line) && line.length < 70 && !sectionPattern.test(line) && !/^(resume|curriculum vitae|cv)$/i.test(line)) || "";
  const headline = header.filter((line) => !isContact(line)).find((line) => line !== fullName && /[A-Za-z]/.test(line) && line.length < 100) || "";

  const section = (names) => {
    const start = sectionAt(names);
    if (start < 0) return [];
    let end = lines.length;
    for (let i = start + 1; i < lines.length; i += 1) {
      if (sectionPattern.test(lines[i])) { end = i; break; }
    }
    return lines.slice(start + 1, end);
  };

  let summaryLines = section(/^(professional\s+)?(summary|profile|objective)\s*:?$/i);
  if (!summaryLines.length) {
    const nextSection = firstSection < 0 ? lines.length : firstSection;
    summaryLines = lines.slice(header.length, Math.min(nextSection, header.length + 5)).filter((line) => !isContact(line));
  }
  const skillsLines = section(/^(technical\s+)?skills\s*:?$/i);
  const skills = skillsLines.join(" ").split(/[•,;|\n]/).map((skill) => skill.replace(/^[^:]{1,35}:\s*/, "").trim()).filter((skill) => skill && skill.length < 50).flatMap((skill) => skill.split(/\s{2,}/)).slice(0, 40);

  const educationLines = section(/^(education|academic\s+background)\s*:?$/i);
  const education = [];
  for (let i = 0; i < educationLines.length; i += 1) {
    const line = educationLines[i];
    const parts = line.split(/\s*\|\s*/).map((part) => part.trim()).filter(Boolean);
    if (parts.length >= 2) {
      education.push({ school: parts[0], degree: parts[1], year: parts[2] || line.match(/(?:19|20)\d{2}(?:\s*[–-]\s*(?:19|20)?\d{2})?/)?.[0] || "" });
      continue;
    }
    if (/\b(?:19|20)\d{2}\b/.test(line) || /university|college|institute|school/i.test(line)) {
      const previous = educationLines[i - 1] || "";
      const degree = /b\.?\s?tech|bachelor|master|ph\.?d|diploma|degree|associate/i.test(line) ? line : (educationLines[i + 1] || "");
      const school = /university|college|institute|school/i.test(line) ? line : previous;
      if (school || degree) education.push({ school, degree, year: line.match(/(?:19|20)\d{2}(?:\s*[–-]\s*(?:19|20)?\d{2})?/)?.[0] || "" });
    }
  }

  const experienceLines = section(/^(work\s+)?experience|^employment\s*(history)?\s*:?$/i);
  const experiences = [];
  const dateRange = /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?(?:19|20)\d{2}\s*(?:[-–—]|to)\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?(?:(?:19|20)\d{2}|present|current)/i;
  for (let i = 0; i < experienceLines.length; i += 1) {
    const line = experienceLines[i];
    const date = line.match(dateRange)?.[0] || "";
    if (date || /\s\|\s/.test(line)) {
      const parts = line.split(/\s\|\s/);
      const title = parts.length > 1 ? parts[0] : line.replace(dateRange, "").trim();
      const company = parts.length > 1 ? parts[1] : (experienceLines[i + 1] || "");
      if (title || company) experiences.push({ title, company, dates: date, description: "" });
    }
  }

  return {
    full_name: fullName,
    headline,
    email,
    phone,
    summary: summaryLines.join(" ").trim(),
    skills,
    experiences,
    education,
  };
}

export default function ResumeIntake() {
  const router = useRouter();
  const [mode, setMode] = useState("");
  const [resume, setResume] = useState(emptyResume);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setResume((current) => ({ ...current, [key]: value }));

  const importFile = async (file) => {
    if (!file) return;
    setError("");
    setLoading(true);
    setFileName(file.name);
    try {
      let text;
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/legacy/build/pdf.worker.mjs",
          import.meta.url
        ).toString();
        const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
        const pages = await Promise.all(
          Array.from({ length: pdf.numPages }, async (_, index) => {
            const page = await pdf.getPage(index + 1);
            const content = await page.getTextContent();
            const rows = new Map();
            for (const item of content.items) {
              const y = Math.round(item.transform?.[5] || 0);
              rows.set(y, [...(rows.get(y) || []), { x: item.transform?.[4] || 0, text: item.str }]);
            }
            return [...rows.entries()].sort((a, b) => b[0] - a[0]).map(([, row]) => row.sort((a, b) => a.x - b.x).map((item) => item.text).join(" ")).join("\n");
          })
        );
        text = pages.join("\n\n");
      } else if (file.type.startsWith("text/") || /\.(txt|md)$/i.test(file.name)) {
        text = await file.text();
      } else {
        throw new Error("Choose a PDF or plain text resume.");
      }
      if (!text.trim()) throw new Error("No selectable text was found. You can type your resume below.");
      const parsed = parseResumeText(text);
      setResume((current) => ({ ...current, ...parsed }));
      if (!parsed.full_name) setError("We imported the resume text but couldn’t identify your name. Review the fields and enter it before continuing.");
    } catch (err) {
      setError(err.message || "Could not read that file.");
    } finally {
      setLoading(false);
    }
  };

  const saveAndChoose = (event) => {
    event.preventDefault();
    if (!resume.full_name.trim()) {
      setError("Add your name to continue.");
      return;
    }
    const toDate = (value) => {
      if (!value || /present|current/i.test(value)) return null;
      const parts = value.trim().match(/^([A-Za-z]+)\s*,?\s*(\d{4})$/) || value.trim().match(/^(\d{4})$/);
      return parts ? { month: parts[2] ? parts[1] : "", year: parts[2] || parts[1] } : { month: "", year: value.trim() };
    };
    localStorage.setItem("profiledata", JSON.stringify({
      ...resume,
      skills: typeof resume.skills === "string" ? resume.skills.split(",").map((skill) => skill.trim()).filter(Boolean) : resume.skills,
      experiences: resume.experiences.map(({ dates, ...experience }) => {
        const [start, end] = (dates || "").split(/\s*(?:–|-|\bto\b)\s*/i);
        return { ...experience, starts_at: toDate(start), ends_at: toDate(end) };
      }),
      education: resume.education.map(({ degree, year, ...education }) => ({
        ...education,
        degree_name: degree,
        starts_at: toDate(year),
        ends_at: toDate(year),
      })),
    }));
    router.push("/resume/templates");
  };

  return (
    <main className="min-h-screen bg-[#111322] px-5 pb-16 pt-36 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 flex items-center gap-2 text-sm font-medium text-blue-300"><Sparkles size={16} /> RESUME BUILDER</p>
        <h1 className="text-4xl font-bold tracking-tight">Start with your resume</h1>
        <p className="mt-3 max-w-2xl text-slate-300">Upload an existing resume or enter your details. Files are parsed in this browser; choosing a template sends your summary and role details to Groq for AI writing.</p>

        {!mode ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <button onClick={() => setMode("upload")} className="rounded-2xl border border-slate-700 bg-slate-900 p-7 text-left transition hover:border-blue-400">
              <FileUp className="mb-5 text-blue-300" size={28} />
              <span className="block text-xl font-semibold">Upload a resume</span>
              <span className="mt-2 block text-sm text-slate-400">Import text from a PDF or plain text file, then review and complete the fields.</span>
            </button>
            <button onClick={() => setMode("create")} className="rounded-2xl border border-slate-700 bg-slate-900 p-7 text-left transition hover:border-blue-400">
              <FileText className="mb-5 text-violet-300" size={28} />
              <span className="block text-xl font-semibold">Create from scratch</span>
              <span className="mt-2 block text-sm text-slate-400">Add your contact details, summary, skills, experience, and education.</span>
            </button>
          </div>
        ) : (
          <form onSubmit={saveAndChoose} className="mt-9 space-y-5 rounded-2xl border border-slate-700 bg-slate-900 p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">{mode === "upload" ? "Upload and review" : "Your details"}</h2>
              <button type="button" onClick={() => { setMode(""); setError(""); }} className="text-sm text-blue-300 hover:text-white">Change method</button>
            </div>
            {mode === "upload" && <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-600 p-4 text-sm text-slate-300 hover:border-blue-400"><FileUp size={20} />{loading ? "Reading resume…" : fileName || "Choose PDF or TXT"}<input type="file" accept=".pdf,.txt,.md,text/plain,application/pdf" className="sr-only" onChange={(event) => importFile(event.target.files?.[0])} /></label>}
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full name" value={resume.full_name} onChange={(value) => update("full_name", value)} required />
              <Field label="Professional headline" value={resume.headline} onChange={(value) => update("headline", value)} placeholder="e.g. Product designer" />
              <Field label="Email" value={resume.email} onChange={(value) => update("email", value)} type="email" />
              <Field label="Phone" value={resume.phone} onChange={(value) => update("phone", value)} />
              <Field label="City" value={resume.city} onChange={(value) => update("city", value)} />
              <Field label="Country" value={resume.country} onChange={(value) => update("country", value)} />
              <div className="md:col-span-2"><Field label="Skills (comma separated)" value={resume.skills} onChange={(value) => update("skills", value)} placeholder="React, UX research, SQL" /></div>
              <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">Summary or imported resume text<textarea rows={mode === "upload" ? 12 : 5} value={resume.summary} onChange={(event) => update("summary", event.target.value)} className="w-full rounded-lg border border-slate-700 bg-[#111322] px-3 py-2 text-white outline-none focus:border-blue-400" placeholder="Describe your experience and career goals…" /></label>
              <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">Experience (one role per line: Title | Company | Dates | Description)<textarea rows={4} value={resume.experiences.map((item) => [item.title, item.company, item.dates, item.description].filter(Boolean).join(" | ")).join("\n")} onChange={(event) => update("experiences", event.target.value.split(/\r?\n/).filter(Boolean).map((line) => { const [title, company, dates, description] = line.split("|").map((part) => part.trim()); return { title, company, dates, description }; }))} className="w-full rounded-lg border border-slate-700 bg-[#111322] px-3 py-2 text-white outline-none focus:border-blue-400" placeholder="Software Engineer | Acme | 2022–2025 | Built…" /></label>
              <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">Education (one entry per line: School | Degree | Year)<textarea rows={3} value={resume.education.map((item) => [item.school, item.degree, item.year].filter(Boolean).join(" | ")).join("\n")} onChange={(event) => update("education", event.target.value.split(/\r?\n/).filter(Boolean).map((line) => { const [school, degree, year] = line.split("|").map((part) => part.trim()); return { school, degree, year }; }))} className="w-full rounded-lg border border-slate-700 bg-[#111322] px-3 py-2 text-white outline-none focus:border-blue-400" placeholder="State University | B.S. Computer Science | 2024" /></label>
            </div>
            {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500">Choose a design <ArrowRight size={17} /></button>
          </form>
        )}
      </div>
    </main>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, required = false }) {
  return <label className="grid gap-2 text-sm text-slate-300">{label}<input required={required} type={type} value={typeof value === "string" ? value : value.join(", ")} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-slate-700 bg-[#111322] px-3 py-2 text-white outline-none focus:border-blue-400" /></label>;
}
