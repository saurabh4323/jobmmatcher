import Userjobrec from "@/schema/UserJobrec";
import connectDB from "@/config/connect";
import { NextResponse } from "next/server";

export async function GET(_request, { params }) {
  const { email } = params;

  await connectDB();

  try {
    const Userjobr = await Userjobrec.find({ email }).sort({
      createdAt: -1,
    });

    return NextResponse.json(
      { success: true, data: Userjobr },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
