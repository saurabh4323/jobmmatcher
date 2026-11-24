"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import Logo from "./Logo";

const LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#how", label: "How it works" },
  { href: "/#recruiters", label: "For recruiters" },
];

export default function PublicNavbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const home = user?.role === "recruiter" ? "/recruiter" : "/dashboard";

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`no-print sticky top-0 z-40 transition ${
        scrolled || open ? "border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8" aria-label="Main">
        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:text-slate-900">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Link href={home} className="btn btn-primary">
              Open workspace <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn text-slate-600 hover:text-slate-900">
                Sign in
              </Link>
              <Link href="/register" className="btn btn-primary">
                Get started <ArrowRight size={16} />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 px-5 pb-6 pt-3 md:hidden">
          <ul className="space-y-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="block rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-2">
            {user ? (
              <Link href={home} className="btn btn-primary">Open workspace</Link>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost">Sign in</Link>
                <Link href="/register" className="btn btn-primary">Get started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
