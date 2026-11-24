import { NextResponse } from "next/server";
import { getSession, publicUser } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ user: publicUser(await getSession()) });
}
