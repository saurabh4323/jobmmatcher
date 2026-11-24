import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

const CANDIDATE_PREFIXES = [
  "/dashboard",
  "/profile",
  "/applications",
  "/resume",
  "/interview",
  "/programming",
  "/learning",
];
const AUTH_PAGES = ["/login", "/register"];

const matches = (pathname, prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`);
export const homeFor = (role) => (role === "recruiter" ? "/recruiter" : "/dashboard");

export async function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);

  if (AUTH_PAGES.includes(pathname)) {
    return session
      ? NextResponse.redirect(new URL(homeFor(session.role), request.url))
      : NextResponse.next();
  }

  // `/jobs` (the board) needs a candidate; `/jobs/:id` stays public for shared links.
  const needsCandidate =
    pathname === "/jobs" || CANDIDATE_PREFIXES.some((prefix) => matches(pathname, prefix));
  const needsRecruiter = matches(pathname, "/recruiter");
  if (!needsCandidate && !needsRecruiter) return NextResponse.next();

  if (!session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", `${pathname}${search}`);
    if (needsRecruiter) url.searchParams.set("role", "recruiter");
    return NextResponse.redirect(url);
  }

  const required = needsRecruiter ? "recruiter" : "candidate";
  if (session.role !== required) {
    return NextResponse.redirect(new URL(homeFor(session.role), request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
