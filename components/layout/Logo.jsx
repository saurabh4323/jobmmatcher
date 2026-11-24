import Link from "next/link";

export default function Logo({ href = "/", compact = false }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5" aria-label="Job Matcher home">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-white shadow-sm">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="m9 13 2 2 4-4" />
        </svg>
      </span>
      {!compact && (
        <span className="font-display text-lg font-bold tracking-tight text-slate-900">
          Job<span className="text-accent">Matcher</span>
        </span>
      )}
    </Link>
  );
}
