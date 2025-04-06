import UserProfile from "@/schema/UserProfile";
import connectDB from "@/config/connect";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  try {
    const {
      full_name,
      headline,
      phone,
      github,
      linkedIn,
      openToWork,
      preferredWork,
    } = await req.json();
    const userprofile = new UserProfile({
      full_name,
      headline,
      phone,
      github,
      linkedIn,
      openToWork,
      preferredWork,
    });
    const result = await userprofile.save();
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
}
