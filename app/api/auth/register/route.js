import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connectDB from "@/config/connect";
import { ROLES, attachSession, clean, isEmail, jsonError } from "@/lib/auth";
import { userModelFor } from "@/lib/users";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const fullName = clean(body.fullName, 120);
    const email = clean(body.email, 200).toLowerCase();
    const password = typeof body.password === "string" ? body.password : "";
    const role = ROLES.includes(body.role) ? body.role : "candidate";
    const company = clean(body.company, 120);

    if (!fullName) return jsonError("Enter your full name.");
    if (!isEmail(email)) return jsonError("Enter a valid email address.");
    if (password.length < 6) return jsonError("Password must be at least 6 characters.");

    await connectDB();
    const Model = userModelFor(role);
    if (await Model.exists({ email })) {
      return jsonError("An account with this email already exists. Sign in instead.", 409);
    }

    const user = await Model.create({
      fullName,
      email,
      password: await bcrypt.hash(password, 10),
      ...(role === "recruiter" ? { company } : {}),
    });

    const account = { _id: user._id, email: user.email, fullName: user.fullName, role };
    return attachSession(
      NextResponse.json(
        { user: { id: String(user._id), email: user.email, fullName: user.fullName, role } },
        { status: 201 }
      ),
      account
    );
  } catch (error) {
    if (error?.code === 11000) {
      return jsonError("An account with this email already exists. Sign in instead.", 409);
    }
    console.error("Registration error:", error);
    return jsonError(error.message?.includes("AUTH_SECRET") ? error.message : "Unable to create your account right now.", 500);
  }
}
