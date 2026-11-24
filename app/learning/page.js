"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BookOpenText, Cpu, MessagesSquare, PlayCircle, Search, Server, Sparkles } from "lucide-react";
import { TOPICS, TOPIC_CATEGORIES, topicsForSkills } from "@/lib/topics";
import { useProfile } from "@/lib/profile";
import { PageHeader } from "@/components/ui";

const COURSES = [
  {
    href: "/learning/scikit-learn",
    title: "Scikit-learn fundamentals",
    text: "Train a classifier, evaluate it, and run real Python in the browser.",
    icon: Cpu,
    tag: "Machine learning",
  },
  {
    href: "/learning/scikit-learn/fastapi-demo",
    title: "Serve a model with FastAPI",
    text: "Call a live prediction API from the UI and see how ML services fit together.",
    icon: Server,
    tag: "MLOps",
  },
];

export default function LearningPage() {
  const { profile } = useProfile();
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const recommended = topicsForSkills(profile.skills);
  const q = query.trim().toLowerCase();
  const visible = TOPICS.filter((topic) => (category === "All" || topic.category === category) && (!q || topic.name.toLowerCase().includes(q)));

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <PageHeader kicker="Learning" title="Level up" description="Hands-on courses and curated paths. Recommendations come from the skills on your profile." />

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Sparkles size={18} className="text-accent" /> Recommended for you</h2>
        {recommended.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recommended.slice(0, 4).map((topic) => <TopicCard key={topic.slug} topic={topic} highlight />)}
          </div>
        ) : (
          <div className="card p-6 text-sm text-slate-500">
            Add skills like Python, React, or Java to your <Link href="/profile" className="font-semibold text-brand">profile</Link> and we&apos;ll suggest matching paths here.
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Interactive courses</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {COURSES.map(({ href, title, text, icon: Icon, tag }) => (
            <Link key={href} href={href} className="neon-border card card-hover group flex items-start gap-5 rounded-3xl p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-brand/30 bg-brand/10 text-brand"><Icon size={22} /></span>
              <div>
                <span className="chip-muted mb-2">{tag}</span>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-slate-500">{text}</p>
                <span className="btn-link mt-3">Open course <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">All learning paths</h2>
          <div className="flex flex-wrap items-center gap-2">
            {["All", ...TOPIC_CATEGORIES].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${category === item ? "border-brand/50 bg-brand/10 text-slate-900" : "border-slate-200 text-slate-500 hover:text-slate-900"}`}
              >
                {item}
              </button>
            ))}
            <label className="relative">
              <span className="sr-only">Search paths</span>
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search…" className="input w-44 py-1.5 pl-8 text-xs" />
            </label>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((topic) => <TopicCard key={topic.slug} topic={topic} />)}
        </div>
        {!visible.length && <p className="py-10 text-center text-sm text-slate-500">No paths match “{query}”.</p>}
      </section>
    </div>
  );
}

function TopicCard({ topic, highlight = false }) {
  return (
    <article className={`card flex flex-col p-5 ${highlight ? "!border-accent/40" : ""}`}>
      <p className="text-xs text-slate-500">{topic.category}</p>
      <h3 className="mt-1 font-semibold text-slate-900">{topic.name}</h3>
      <div className="mt-4 flex flex-1 flex-col justify-end gap-1.5 text-sm">
        <a href={`https://www.youtube.com/watch?v=${topic.video}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-500 hover:text-brand">
          <PlayCircle size={15} /> Video tutorial
        </a>
        <a href={topic.docs} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-500 hover:text-brand">
          <BookOpenText size={15} /> Documentation
        </a>
        <Link href={`/interview/${topic.slug}`} className="flex items-center gap-2 text-slate-500 hover:text-accent">
          <MessagesSquare size={15} /> Mock interview
        </Link>
      </div>
    </article>
  );
}
