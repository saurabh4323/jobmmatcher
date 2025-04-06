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
      location,
      description,
      skills,
      experience,
      jobType,
      salary,
      applicationDeadline,
      createdAt,
    } = body;

    if (
      !title ||
      !name ||
      !location ||
      !description ||
      !createdAt ||
      !skills ||
      !experience ||
      !jobType ||
      !salary ||
      !applicationDeadline
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const newJob = await job.create({
      title,
      name,
      location,
      description,
      skills,
      experience,
      jobType,
      salary,
      applicationDeadline,
      createdAt,
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
