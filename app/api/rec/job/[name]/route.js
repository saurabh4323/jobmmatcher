import { NextResponse } from "next/server";
import job from "@/schema/Job";
import connectDB from "@/config/connect";

export async function GET(req, { params }) {
  const { name } = params;
  await connectDB();

  try {
    const jobs = await job.find({ name }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: jobs }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
