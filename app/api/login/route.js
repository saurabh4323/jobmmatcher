import { NextResponse } from "next/server";
import connectDB from "@/config/connect";
import Userjob from "@/schema/User";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await Userjob.findOne({ email, password });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password (using comparePassword method if it's part of your schema)
    // const isMatch = await user.comparePassword(password);
    // if (!isMatch) {
    //   return NextResponse.json(
    //     { error: "Invalid credentials" },
    //     { status: 401 }
    //   );
    // }

    // If login is successful, return a success message
    return NextResponse.json({
      message: "Login successful",
      user, // You can return user data if needed
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
