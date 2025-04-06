import UserProfile from "@/schema/UserProfile";
import connectDB from "@/config/connect";
import { NextResponse } from "next/server";

export async function GET(_request, { params }) {
  const { phone } = params;

  await connectDB();

  try {
    const userProfiles = await UserProfile.find({ phone }).sort({
      createdAt: -1,
    });

    return NextResponse.json(
      { success: true, data: userProfiles },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
