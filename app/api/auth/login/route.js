import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connectDB from "@/config/connect";
import { ROLES, attachSession, clean, jsonError } from "@/lib/auth";
import { userModelFor } from "@/lib/users";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = clean(body.email, 200).toLowerCase();
    const password = typeof body.password === "string" ? body.password : "";
    const role = ROLES.includes(body.role) ? body.role : "candidate";

    if (!email || !password) return jsonError("Email and password are required.");

    await connectDB();
    const user = await userModelFor(role).findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return jsonError(
        `Incorrect email or password for a ${role} account.`,
        401
      );
    }

    const account = { _id: user._id, email: user.email, fullName: user.fullName, role };
    return attachSession(
      NextResponse.json({ user: { id: String(user._id), email: user.email, fullName: user.fullName, role } }),
      account
    );
  } catch (error) {
    console.error("Login error:", error);
    return jsonError(error.message?.includes("AUTH_SECRET") ? error.message : "Unable to sign in right now.", 500);
  }
}
