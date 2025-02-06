import { NextResponse } from "next/server";
import connectDB from "@/config/connect";
import Userjob from "@/schema/User";

export async function POST(req) {
  try {
    await connectDB();

    // Parse request body correctly
    const body = await req.json();
    const { fullName, email, password } = body;

    // Validate input
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await Userjob.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Create new user
    const user = await Userjob.create({
      fullName,
      email,
      password,
    });

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
