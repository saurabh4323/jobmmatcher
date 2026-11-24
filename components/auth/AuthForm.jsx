"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowRight, BriefcaseBusiness, Eye, EyeOff, GraduationCap } from "lucide-react";
import { api } from "@/lib/client";
import { Alert, Field, Spinner } from "@/components/ui";

const ROLES = [
  { id: "candidate", label: "Candidate", icon: GraduationCap, blurb: "Find work & prepare" },
  { id: "recruiter", label: "Recruiter", icon: BriefcaseBusiness, blurb: "Post jobs & hire" },
];

// Only allow same-site relative redirects after sign-in.
const safeNext = (value) => (value && value.startsWith("/") && !value.startsWith("//") ? value : null);

export default function AuthForm({ mode }) {
  const params = useSearchParams();
  const isSignup = mode === "register";
  const [role, setRole] = useState(params.get("role") === "recruiter" ? "recruiter" : "candidate");
  const [form, setForm] = useState({ fullName: "", company: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user } = await api(isSignup ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        body: { ...form, role },
      });
      const home = user.role === "recruiter" ? "/recruiter" : "/dashboard";
      const next = safeNext(params.get("next"));
      const allowed = next && (user.role === "recruiter" ? next.startsWith("/recruiter") : !next.startsWith("/recruiter"));
      // Full navigation so the server layout picks up the new session cookie.
      window.location.href = allowed ? next : home;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const switchHref = `${isSignup ? "/login" : "/register"}${role === "recruiter" ? "?role=recruiter" : ""}`;

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-5 py-14">
      <div className="grid-bg absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-info/20 blur-[110px]" aria-hidden="true" />

      <div className="relative w-full max-w-md animate-fade-up">
        <div className="mb-8 text-center">
          <p className="kicker mb-3">{isSignup ? "Create account" : "Welcome back"}</p>
          <h1 className="text-3xl font-bold tracking-tight">{isSignup ? "Join Job Matcher" : "Sign in to your workspace"}</h1>
        </div>

        <div className="neon-border card rounded-3xl p-6 sm:p-8">
          <div role="radiogroup" aria-label="Account type" className="mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-ink-950/60 p-1.5">
            {ROLES.map(({ id, label, icon: Icon, blurb }) => {
              const active = role === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setRole(id)}
                  className={`rounded-xl px-3 py-2.5 text-left transition ${
                    active ? "bg-brand/10 shadow-[inset_0_0_0_1px_rgba(37,99,235,0.45)]" : "hover:bg-slate-50"
                  }`}
                >
                  <span className={`flex items-center gap-2 text-sm font-semibold ${active ? "text-slate-900" : "text-slate-500"}`}>
                    <Icon size={16} className={active ? "text-brand" : ""} /> {label}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-slate-500">{blurb}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={submit} className="space-y-4" noValidate={false}>
            {isSignup && (
              <Field label="Full name" name="fullName" value={form.fullName} onChange={update} autoComplete="name" required placeholder="Ada Lovelace" />
            )}
            {isSignup && role === "recruiter" && (
              <Field label="Company" name="company" value={form.company} onChange={update} autoComplete="organization" placeholder="Acme Inc." />
            )}
            <Field label="Email" name="email" type="email" value={form.email} onChange={update} autoComplete="email" required placeholder="you@example.com" />
            <Field label="Password" hint={isSignup ? "At least 6 characters." : undefined} required>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={update}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  minLength={isSignup ? 6 : undefined}
                  required
                  className="input pr-11"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 grid w-11 place-items-center text-slate-500 hover:text-slate-900"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </Field>

            <Alert>{error}</Alert>

            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
              {loading ? <Spinner className="!text-ink-950" /> : null}
              {loading ? "Please wait…" : isSignup ? `Create ${role} account` : "Sign in"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          {isSignup ? "Already have an account?" : "New to Job Matcher?"}{" "}
          <Link href={switchHref} className="font-semibold text-brand hover:text-slate-900">
            {isSignup ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </div>
    </section>
  );
}
