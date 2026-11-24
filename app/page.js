import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Code2,
  FileText,
  Link2,
  MessagesSquare,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

export const metadata = { title: "Job Matcher — Build, practice, get hired" };

const FEATURES = [
  {
    icon: FileText,
    title: "Resume builder",
    text: "Import a PDF or start fresh, polish it with AI, then export one of four print-ready themes.",
    accent: "text-brand border-brand/30 bg-brand/10",
  },
  {
    icon: MessagesSquare,
    title: "AI mock interviews",
    text: "Camera-on practice with fresh questions per topic, live transcription, and instant AI feedback.",
    accent: "text-accent border-accent/30 bg-accent/10",
  },
  {
    icon: Code2,
    title: "Coding rounds",
    text: "Timed problems in Python, JavaScript, Java or C++, run in the browser and reviewed by AI.",
    accent: "text-info border-info/30 bg-info/10",
  },
  {
    icon: Search,
    title: "Skill-matched jobs",
    text: "Browse roles posted here plus a live remote feed, filtered against the skills on your profile.",
    accent: "text-success border-success/30 bg-success/10",
  },
];

const STEPS = [
  { n: "01", title: "Create your profile", text: "Sign up and import your resume — skills, roles and education fill in automatically." },
  { n: "02", title: "Sharpen your edge", text: "Practice interviews and coding rounds, and follow learning paths built from your skills." },
  { n: "03", title: "Apply with one link", text: "Apply to roles in a click and track every application's status from your dashboard." },
];

const RECRUITER_POINTS = [
  "Publish a role and get a shareable apply link instantly",
  "Review every applicant in one pipeline",
  "Move candidates from applied to offered",
  "Run live coding interviews in the browser",
];

export default function HomePage() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-blue-200/50 blur-[120px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-40 top-40 h-96 w-96 rounded-full bg-emerald-200/40 blur-[120px]" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-16 sm:px-8 lg:pt-24">
          <div className="mx-auto max-w-4xl text-center">
            <span className="chip mb-8 animate-fade-up">
              <Sparkles size={13} /> AI-assisted career platform
            </span>
            <h1 className="animate-fade-up font-display text-[clamp(2.3rem,5.5vw,4rem)] font-extrabold leading-[1.08] tracking-tight [animation-delay:60ms]">
              The smarter way to <span className="text-brand">find work</span>
              <br className="hidden sm:block" /> and <span className="text-accent">hire talent</span>
            </h1>
            <p className="mx-auto mt-7 max-w-2xl animate-fade-up text-lg leading-8 text-slate-500 [animation-delay:120ms]">
              Build a resume that stands out, rehearse with an AI interviewer, and apply to roles that fit your
              skills — or post a job and meet the people ready for it.
            </p>
            <div className="mt-10 flex animate-fade-up flex-wrap justify-center gap-3 [animation-delay:180ms]">
              <Link href="/register" className="btn btn-primary btn-lg">
                I&apos;m looking for work <ArrowRight size={18} />
              </Link>
              <Link href="/register?role=recruiter" className="btn btn-ghost btn-lg">
                <BriefcaseBusiness size={18} /> I&apos;m hiring
              </Link>
            </div>
          </div>

          {/* Product preview */}
          <div className="relative mx-auto mt-20 max-w-5xl animate-fade-up [animation-delay:240ms]">
            <div className="neon-border card overflow-hidden rounded-3xl p-2">
              <div className="rounded-[20px] bg-ink-950/80 p-5 sm:p-8">
                <div className="mb-6 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-danger/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
                  <span className="ml-3 font-mono text-xs text-slate-500">jobmatcher / dashboard</span>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <PreviewCard label="Profile strength" value="Complete" bar={92} color="bg-brand" />
                  <PreviewCard label="Interview practice" value="Arrays · React · SQL" bar={64} color="bg-accent" />
                  <PreviewCard label="Applications" value="Applied → Interviewed" bar={40} color="bg-info" />
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-[1.4fr_1fr]">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <p className="kicker mb-3">Next question</p>
                    <p className="text-sm leading-6 text-slate-700">
                      &ldquo;Explain how you&apos;d detect a cycle in a linked list, and what the time and space trade-offs are.&rdquo;
                    </p>
                    <div className="mt-4 flex gap-2">
                      <span className="chip">Linked lists</span>
                      <span className="chip-muted">10:00 timer</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 font-mono text-xs leading-6 text-slate-500">
                    <p><span className="text-accent">def</span> <span className="text-brand">has_cycle</span>(head):</p>
                    <p className="pl-4">slow = fast = head</p>
                    <p className="pl-4"><span className="text-accent">while</span> fast <span className="text-accent">and</span> fast.next:</p>
                    <p className="pl-8">slow, fast = slow.next, fast.next.next</p>
                    <p className="pl-8"><span className="text-accent">if</span> slow <span className="text-accent">is</span> fast: <span className="text-accent">return</span> <span className="text-success">True</span></p>
                    <p className="pl-4"><span className="text-accent">return</span> <span className="text-success">False</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section id="features" className="relative scroll-mt-20 border-t border-slate-200 py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="kicker mb-4">Features</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything between “applying” and “hired”</h2>
            <p className="mt-4 text-slate-500">One workspace for your resume, interview prep, and job search — no tab juggling.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, text, accent }) => (
              <article key={title} className="card card-hover p-6">
                <span className={`mb-5 grid h-11 w-11 place-items-center rounded-xl border ${accent}`}>
                  <Icon size={20} />
                </span>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how" className="scroll-mt-20 py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-14 max-w-2xl">
            <p className="kicker mb-4">How it works</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Three steps to your next role</h2>
          </div>
          <ol className="grid gap-5 md:grid-cols-3">
            {STEPS.map((step) => (
              <li key={step.n} className="card relative overflow-hidden p-7">
                <span className="font-display text-5xl font-extrabold text-slate-200">{step.n}</span>
                <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{step.text}</p>
                <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-brand/0 via-brand/60 to-accent/0" aria-hidden="true" />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Recruiters ---------- */}
      <section id="recruiters" className="scroll-mt-20 py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="neon-border card grid items-center gap-10 overflow-hidden rounded-3xl p-8 sm:p-12 lg:grid-cols-2">
            <div>
              <p className="kicker mb-4 !text-accent">For recruiters</p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Hire without the spreadsheet</h2>
              <p className="mt-4 text-slate-500">Post a role, share one link, and watch applications land in a pipeline you can actually manage.</p>
              <ul className="mt-7 space-y-3">
                {RECRUITER_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                      <Check size={13} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <Link href="/register?role=recruiter" className="btn btn-pink mt-8">
                Start hiring <ArrowRight size={16} />
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { icon: Link2, title: "Shareable apply link", text: "/jobs/6650…e21 copied", tone: "text-brand" },
                { icon: Users, title: "New applicant", text: "Applied to Frontend Engineer", tone: "text-accent" },
                { icon: BriefcaseBusiness, title: "Status updated", text: "Moved to interviewed", tone: "text-info" },
              ].map(({ icon: Icon, title, text, tone }) => (
                <div key={title} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-ink-950/60 p-4">
                  <span className={`grid h-10 w-10 place-items-center rounded-xl bg-slate-100 ${tone}`}>
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{title}</p>
                    <p className="text-xs text-slate-500">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="pb-28 pt-8">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to take the <span className="text-brand">next step</span>?
          </h2>
          <p className="mt-4 text-slate-500">Free to start. Your first resume takes about five minutes.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register" className="btn btn-primary btn-lg">Create free account <ArrowRight size={18} /></Link>
            <Link href="/login" className="btn btn-ghost btn-lg">Sign in</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function PreviewCard({ label, value, bar, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
      <div className="mt-4 h-1.5 rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${bar}%` }} />
      </div>
    </div>
  );
}
