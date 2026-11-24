import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession } from "./session";

export const ROLES = ["candidate", "recruiter"];

/** Returns the signed-in user ({ sub, email, fullName, role }) or null. */
export async function getSession() {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

export function jsonError(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Guard for route handlers. Usage:
 *   const { session, error } = await requireSession("recruiter");
 *   if (error) return error;
 */
export async function requireSession(role) {
  const session = await getSession();
  if (!session) return { error: jsonError("Please sign in to continue.", 401) };
  if (role && session.role !== role) {
    return { error: jsonError("You don't have access to this resource.", 403) };
  }
  return { session };
}

export async function attachSession(response, user) {
  const token = await signSession({
    sub: String(user._id),
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}

export function clearSession(response) {
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}

export function publicUser(session) {
  if (!session) return null;
  return { id: session.sub, email: session.email, fullName: session.fullName, role: session.role };
}

export const isEmail = (value) => typeof value === "string" && /^\S+@\S+\.\S+$/.test(value);
export const clean = (value, max = 5000) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";
