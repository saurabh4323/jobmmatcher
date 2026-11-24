"use client";

// Heuristic plain-text resume parser. It does a best-effort pass so the user
// only has to review and correct fields rather than retype them.

const SECTION =
  /^(professional\s+)?(summary|profile|objective|experience|work\s+experience|employment(\s+history)?|education|academic(\s+background)?|skills|technical\s+skills|projects|certifications|achievements|publications|languages|interests)\s*:?$/i;
const EMAIL = /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/;
const PHONE = /(?:\+?\d[\d\s().-]{7,}\d)/;
const LINK = /https?:\/\/|www\.|linkedin|github|portfolio/i;
const YEAR_RANGE = /(?:19|20)\d{2}(?:\s*[–-]\s*(?:(?:19|20)?\d{2}|present|current))?/i;
const DATE_RANGE =
  /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?(?:19|20)\d{2}\s*(?:[-–—]|to)\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+)?(?:(?:19|20)\d{2}|present|current)/i;

export function parseResumeText(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const firstSection = lines.findIndex((line) => SECTION.test(line));
  const header = lines.slice(0, firstSection < 0 ? 8 : firstSection);
  const isContact = (line) => EMAIL.test(line) || PHONE.test(line) || LINK.test(line);
  const contactStart = (line) => {
    const positions = [line.search(EMAIL), line.search(PHONE), line.search(LINK)].filter((p) => p >= 0);
    return positions.length ? Math.min(...positions) : line.length;
  };

  const section = (pattern) => {
    const start = lines.findIndex((line) => pattern.test(line));
    if (start < 0) return [];
    const end = lines.findIndex((line, index) => index > start && SECTION.test(line));
    return lines.slice(start + 1, end < 0 ? lines.length : end);
  };

  const fullName =
    header
      .map((line) => line.slice(0, contactStart(line)).replace(/[|,•\s-]+$/g, "").trim())
      .find((line) => /[A-Za-z]/.test(line) && line.length < 70 && !SECTION.test(line) && !/^(resume|curriculum vitae|cv)$/i.test(line)) || "";
  const headline = header.filter((line) => !isContact(line)).find((line) => line !== fullName && /[A-Za-z]/.test(line) && line.length < 100) || "";

  let summary = section(/^(professional\s+)?(summary|profile|objective)\s*:?$/i);
  if (!summary.length) {
    const stop = firstSection < 0 ? lines.length : firstSection;
    summary = lines.slice(header.length, Math.min(stop, header.length + 5)).filter((line) => !isContact(line));
  }

  const skills = section(/^(technical\s+)?skills\s*:?$/i)
    .join(" , ")
    .split(/[•,;|]/)
    .map((skill) => skill.replace(/^[^:]{1,35}:\s*/, "").trim())
    .filter((skill) => skill && skill.length < 40);

  const education = [];
  const educationLines = section(/^(education|academic(\s+background)?)\s*:?$/i);
  educationLines.forEach((line, index) => {
    const parts = line.split(/\s*\|\s*/).filter(Boolean);
    if (parts.length >= 2) {
      education.push({ school: parts[0], degree: parts[1], year: parts[2] || line.match(YEAR_RANGE)?.[0] || "" });
    } else if (/university|college|institute|school/i.test(line)) {
      const next = educationLines[index + 1] || "";
      const degree = /b\.?\s?tech|bachelor|master|ph\.?d|diploma|degree|associate|b\.?s|m\.?s/i.test(next) ? next : "";
      education.push({ school: line.replace(YEAR_RANGE, "").trim(), degree, year: (line + " " + degree).match(YEAR_RANGE)?.[0] || "" });
    }
  });

  const experiences = [];
  const experienceLines = section(/^((work\s+)?experience|employment(\s+history)?)\s*:?$/i);
  experienceLines.forEach((line, index) => {
    const dates = line.match(DATE_RANGE)?.[0] || "";
    if (!dates && !/\s\|\s/.test(line)) {
      // Attach bullet lines to the previous role as its description.
      const last = experiences[experiences.length - 1];
      if (last && index > 0 && line.length > 25) last.description = `${last.description} ${line.replace(/^[•\-*]\s*/, "")}`.trim();
      return;
    }
    const parts = line.replace(DATE_RANGE, "").split(/\s\|\s|\s[-–—]\s|,\s(?=[A-Z])/).map((part) => part.trim()).filter(Boolean);
    const title = parts[0] || "";
    const company = parts[1] || experienceLines[index + 1] || "";
    if (title || company) experiences.push({ title, company, dates, description: "" });
  });

  return {
    full_name: fullName,
    headline,
    email: text.match(EMAIL)?.[0] || "",
    phone: text.match(PHONE)?.[0]?.replace(/\s+/g, " ").trim() || "",
    summary: summary.join(" ").trim(),
    skills: [...new Set(skills)].slice(0, 40),
    experiences: experiences.slice(0, 12),
    education: education.slice(0, 8),
  };
}

/** Extracts text from a PDF or plain-text file in the browser. */
export async function readResumeFile(file) {
  if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.mjs", import.meta.url).toString();
    const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    const pages = await Promise.all(
      Array.from({ length: pdf.numPages }, async (_, index) => {
        const page = await pdf.getPage(index + 1);
        const content = await page.getTextContent();
        // Group text items into visual rows by their y position.
        const rows = new Map();
        for (const item of content.items) {
          const y = Math.round(item.transform?.[5] || 0);
          rows.set(y, [...(rows.get(y) || []), { x: item.transform?.[4] || 0, text: item.str }]);
        }
        return [...rows.entries()]
          .sort((a, b) => b[0] - a[0])
          .map(([, row]) => row.sort((a, b) => a.x - b.x).map((item) => item.text).join(" "))
          .join("\n");
      })
    );
    return pages.join("\n\n");
  }
  if (file.type.startsWith("text/") || /\.(txt|md)$/i.test(file.name)) return file.text();
  throw new Error("Choose a PDF or plain-text (.txt) resume.");
}
