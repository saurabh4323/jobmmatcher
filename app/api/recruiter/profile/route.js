import { NextResponse } from "next/server";
import connectDB from "@/config/connect";
import { attachSession, clean, jsonError, requireSession } from "@/lib/auth";
import Userjobrec from "@/schema/UserJobrec";

export async function GET() {
  const { session, error } = await requireSession("recruiter");
  if (error) return error;
  try {
    await connectDB();
    const recruiter = await Userjobrec.findOne({ email: session.email }).select("-password").lean();
    if (!recruiter) return jsonError("Account not found.", 404);
    return NextResponse.json({ recruiter });
  } catch (err) {
    console.error("Recruiter profile error:", err);
    return jsonError("Unable to load your profile.", 500);
  }
}

export async function PUT(request) {
  const { session, error } = await requireSession("recruiter");
  if (error) return error;
  try {
    const body = await request.json().catch(() => ({}));
    const fullName = clean(body.fullName, 120);
    if (!fullName) return jsonError("Your name can't be empty.");

    await connectDB();
    const recruiter = await Userjobrec.findOneAndUpdate(
      { email: session.email },
      {
        $set: {
          fullName,
          company: clean(body.company, 120),
          website: clean(body.website, 200),
          about: clean(body.about, 3000),
        },
      },
      { new: true }
    )
      .select("-password")
      .lean();
    if (!recruiter) return jsonError("Account not found.", 404);

    // Re-issue the session so the new name shows across the app.
    return attachSession(NextResponse.json({ recruiter }), { ...recruiter, role: "recruiter" });
  } catch (err) {
    console.error("Recruiter profile save error:", err);
    return jsonError("Unable to save your profile.", 500);
  }
}
