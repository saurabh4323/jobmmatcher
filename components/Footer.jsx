import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0b101c] py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-7 px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" className="font-semibold tracking-tight text-slate-100">
            Job Matcher
          </Link>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
            Tools to help you prepare for your next opportunity and build a stronger team.
          </p>
        </div>
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400"
        >
          <Link className="transition-colors hover:text-white" href="/jobs">
            Browse jobs
          </Link>
          <Link className="transition-colors hover:text-white" href="/resume">
            Resume builder
          </Link>
          <Link className="transition-colors hover:text-white" href="/interview">
            Interview practice
          </Link>
          <Link className="transition-colors hover:text-white" href="/learning">
            Learning
          </Link>
        </nav>
        <div className="border-t border-white/10 pt-5 text-xs text-slate-500 md:border-0 md:pt-0">
          © {new Date().getFullYear()} Job Matcher
        </div>
      </div>
    </footer>
  );
}
