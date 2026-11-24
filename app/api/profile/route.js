import { NextResponse } from "next/server";
import connectDB from "@/config/connect";
import { clean, jsonError, requireSession } from "@/lib/auth";
import CandidateProfile from "@/schema/UserProfile";

const WORK_MODES = ["Remote", "On-site", "Hybrid"];
const list = (value, mapper, max = 30) => (Array.isArray(value) ? value.slice(0, max).map(mapper) : []);

function sanitize(body) {
  const skills = Array.isArray(body.skills)
    ? body.skills
    : typeof body.skills === "string"
      ? body.skills.split(",")
      : [];
  return {
    full_name: clean(body.full_name, 120),
    headline: clean(body.headline, 160),
    phone: clean(body.phone, 40),
    city: clean(body.city, 80),
    country: clean(body.country, 80),
    summary: clean(body.summary, 6000),
    skills: [...new Set(skills.map((skill) => clean(String(skill), 50)).filter(Boolean))].slice(0, 60),
    experiences: list(body.experiences, (item = {}) => ({
      title: clean(item.title, 120),
      company: clean(item.company, 120),
      dates: clean(item.dates, 60),
      description: clean(item.description, 2000),
    })).filter((item) => item.title || item.company),
    education: list(body.education, (item = {}) => ({
      school: clean(item.school, 160),
      degree: clean(item.degree, 160),
      year: clean(item.year, 40),
    })).filter((item) => item.school || item.degree),
    github: clean(body.github, 200),
    linkedIn: clean(body.linkedIn, 200),
    website: clean(body.website, 200),
    openToWork: body.openToWork !== false,
    preferredWork: WORK_MODES.includes(body.preferredWork) ? body.preferredWork : "Remote",
  };
}

export async function GET() {
  const { session, error } = await requireSession("candidate");
  if (error) return error;
  try {
    await connectDB();
    const profile = await CandidateProfile.findOne({ email: session.email }).lean();
    return NextResponse.json({
      profile: profile || { email: session.email, full_name: session.fullName },
      exists: Boolean(profile),
    });
  } catch (err) {
    console.error("Profile load error:", err);
    return jsonError("Unable to load your profile.", 500);
  }
}

export async function PUT(request) {
  const { session, error } = await requireSession("candidate");
  if (error) return error;
  try {
    const body = await request.json().catch(() => ({}));
    const data = sanitize(body);
    if (!data.full_name) data.full_name = session.fullName;

    await connectDB();
    const profile = await CandidateProfile.findOneAndUpdate(
      { email: session.email },
      { $set: { ...data, email: session.email } },
      { new: true, upsert: true, runValidators: true }
    ).lean();
    return NextResponse.json({ profile });
  } catch (err) {
    console.error("Profile save error:", err);
    return jsonError("Unable to save your profile.", 500);
  }
}
