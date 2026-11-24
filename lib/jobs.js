import { clean } from "@/lib/auth";
import { EXPERIENCE_LEVELS, JOB_TYPES } from "@/lib/constants";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Builds a Mongo filter from ?q=&type= search params. */
export function jobSearchFilter(searchParams) {
  const filter = {};
  const q = clean(searchParams.get("q") || "", 100);
  const type = searchParams.get("type");
  if (q) {
    const pattern = new RegExp(escapeRegex(q), "i");
    filter.$or = [{ title: pattern }, { name: pattern }, { location: pattern }, { skills: pattern }];
  }
  if (JOB_TYPES.includes(type)) filter.jobType = type;
  return filter;
}

/** Validates a create/update payload. Returns { data } or { error }. */
export function parseJobInput(body, { partial = false } = {}) {
  const data = {};
  const text = { title: 140, name: 140, location: 140, description: 8000, salary: 80 };
  for (const [field, max] of Object.entries(text)) {
    if (body[field] !== undefined) data[field] = clean(body[field], max);
  }
  if (body.skills !== undefined) {
    const raw = Array.isArray(body.skills) ? body.skills : String(body.skills).split(",");
    data.skills = [...new Set(raw.map((skill) => clean(String(skill), 50)).filter(Boolean))].slice(0, 30);
  }
  if (body.experience !== undefined) {
    if (!EXPERIENCE_LEVELS.includes(body.experience)) return { error: "Choose an experience level." };
    data.experience = body.experience;
  }
  if (body.jobType !== undefined) {
    if (!JOB_TYPES.includes(body.jobType)) return { error: "Choose a job type." };
    data.jobType = body.jobType;
  }
  if (body.status !== undefined) {
    if (!["open", "closed"].includes(body.status)) return { error: "Invalid status." };
    data.status = body.status;
  }
  if (body.applicationDeadline !== undefined) {
    if (!body.applicationDeadline) {
      data.applicationDeadline = null;
    } else {
      const deadline = new Date(body.applicationDeadline);
      if (Number.isNaN(deadline.getTime())) return { error: "Application deadline must be a valid date." };
      data.applicationDeadline = deadline;
    }
  }

  if (!partial) {
    const required = { title: "job title", name: "company name", location: "location", description: "description" };
    const missing = Object.entries(required)
      .filter(([field]) => !data[field])
      .map(([, label]) => label);
    if (!data.skills?.length) missing.push("at least one skill");
    if (!data.experience) missing.push("experience level");
    if (!data.jobType) missing.push("job type");
    if (missing.length) return { error: `Please add: ${missing.join(", ")}.` };
  }
  return { data };
}
