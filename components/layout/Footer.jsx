import Link from "next/link";
import Logo from "./Logo";

const COLUMNS = [
  {
    title: "Candidates",
    links: [
      { href: "/register", label: "Create account" },
      { href: "/resume", label: "Resume builder" },
      { href: "/interview", label: "Interview prep" },
      { href: "/jobs", label: "Find jobs" },
    ],
  },
  {
    title: "Recruiters",
    links: [
      { href: "/register?role=recruiter", label: "Start hiring" },
      { href: "/recruiter/jobs/new", label: "Post a job" },
      { href: "/recruiter/candidates", label: "Review candidates" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="no-print relative border-t border-slate-200 bg-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
            Resumes, interview practice, and hiring — brought together in one professional workspace.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <p className="kicker mb-4">{column.title}</p>
            <ul className="space-y-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 transition hover:text-slate-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Job Matcher
      </div>
    </footer>
  );
}
