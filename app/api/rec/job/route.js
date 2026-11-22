import { NextResponse } from "next/server";
import job from "@/schema/Job";
import connectDB from "@/config/connect";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      title,
      name = body.company,
      recruiterEmail,
      location,
      description,
      skills,
      experience,
      jobType,
      salary,
      applicationDeadline,
      createdAt,
    } = body;

    const requiredFields = { title, name, recruiterEmail, location, description, experience, jobType };
    const missingFields = Object.entries(requiredFields)
      .filter(([, value]) => typeof value !== "string" || !value.trim())
      .map(([field]) => field);
    const normalizedSkills = Array.isArray(skills)
      ? skills.map((skill) => String(skill).trim()).filter(Boolean)
      : typeof skills === "string"
        ? skills.split(",").map((skill) => skill.trim()).filter(Boolean)
        : [];

    if (normalizedSkills.length === 0) missingFields.push("skills");

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Please complete the required fields: ${missingFields.join(", ")}.` },
        { status: 400 }
      );
    }

    const parsedDeadline = applicationDeadline ? new Date(applicationDeadline) : undefined;
    if (parsedDeadline && Number.isNaN(parsedDeadline.getTime())) {
      return NextResponse.json(
        { error: "Application deadline must be a valid date." },
        { status: 400 }
      );
    }

    const newJob = await job.create({
      title,
      name,
      recruiterEmail: recruiterEmail.trim().toLowerCase(),
      location,
      description,
      skills: normalizedSkills,
      experience,
      jobType,
      salary: typeof salary === "string" ? salary.trim() : "",
      applicationDeadline: parsedDeadline,
      createdAt: createdAt ? new Date(createdAt) : undefined,
    });

    return NextResponse.json(
      { message: "Job created successfully", newJob },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    console.error("Job creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function GET(req) {
  try {
    await connectDB();
    const jobs = await job.find({}).select("-recruiterEmail").sort({ createdAt: -1 });
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
