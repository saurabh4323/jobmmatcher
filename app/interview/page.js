"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpenText, PlayCircle, Search, Sparkles, X } from "lucide-react";
import { TOPICS, TOPIC_CATEGORIES, topicsForSkills } from "@/lib/topics";
import { useProfile } from "@/lib/profile";
import { PageHeader } from "@/components/ui";

export default function InterviewPrepPage() {
  const { profile } = useProfile();
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(TOPICS[0].slug);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    if (!video) return undefined;
    const onKey = (event) => event.key === "Escape" && setVideo(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [video]);

  const suggested = new Set(topicsForSkills(profile.skills).map((topic) => topic.slug));
  const visible = TOPICS.filter(
    (topic) => (category === "All" || topic.category === category) && topic.name.toLowerCase().includes(query.trim().toLowerCase())
  ).sort((a, b) => Number(suggested.has(b.slug)) - Number(suggested.has(a.slug)));
  const current = TOPICS.find((topic) => topic.slug === selected) || TOPICS[0];

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        kicker="Interview prep"
        title="Practice by topic"
        description="Learn the concept, then step into a camera-on mock interview with fresh AI questions and feedback on every answer."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-wrap gap-2">
              {["All", ...TOPIC_CATEGORIES].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                    category === item ? "border-brand/50 bg-brand/10 text-slate-900" : "border-slate-200 text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <label className="relative sm:ml-auto sm:w-60">
              <span className="sr-only">Search topics</span>
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search topics…" className="input py-2 pl-9" />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((topic) => {
              const active = topic.slug === current.slug;
              return (
                <button
                  key={topic.slug}
                  type="button"
                  onClick={() => setSelected(topic.slug)}
                  aria-pressed={active}
                  className={`card group flex items-center justify-between gap-3 p-4 text-left transition ${
                    active ? "!border-brand/60 shadow-soft" : "hover:border-slate-300"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{topic.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{topic.category}</p>
                  </div>
                  {suggested.has(topic.slug) ? (
                    <span className="chip shrink-0 !text-[10px]"><Sparkles size={10} /> Your skill</span>
                  ) : (
                    <ArrowRight size={16} className={`shrink-0 transition ${active ? "text-brand" : "text-slate-400 group-hover:translate-x-0.5"}`} />
                  )}
                </button>
              );
            })}
            {!visible.length && <p className="col-span-full py-10 text-center text-sm text-slate-500">No topics match “{query}”.</p>}
          </div>
        </div>

        <aside className="neon-border card h-fit rounded-3xl p-6 lg:sticky lg:top-24">
          <p className="kicker mb-2">{current.category}</p>
          <h2 className="text-2xl font-bold">{current.name}</h2>

          <div className="mt-6 space-y-3">
            <button type="button" onClick={() => setVideo(current)} className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-ink-950/60 p-4 text-left transition hover:border-brand/40">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand"><PlayCircle size={20} /></span>
              <span><span className="block text-sm font-semibold text-slate-900">Watch the tutorial</span><span className="text-xs text-slate-500">Video walkthrough</span></span>
            </button>
            <a href={current.docs} target="_blank" rel="noopener noreferrer" className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-ink-950/60 p-4 transition hover:border-info/40">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-info/10 text-info"><BookOpenText size={20} /></span>
              <span><span className="block text-sm font-semibold text-slate-900">Read the docs</span><span className="text-xs text-slate-500">Opens in a new tab</span></span>
            </a>
          </div>

          <div className="mt-6 rounded-2xl border border-accent/25 bg-accent/[0.06] p-5">
            <h3 className="font-semibold">Mock interview</h3>
            <p className="mt-1 text-sm text-slate-500">AI asks questions on {current.name}. Answer out loud or by typing, and get scored feedback.</p>
            <Link href={`/interview/${current.slug}`} className="btn btn-pink mt-4 w-full">
              Start interview <ArrowRight size={16} />
            </Link>
          </div>
        </aside>
      </div>

      {video && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`${video.name} tutorial`} onClick={() => setVideo(null)}>
          <div className="card relative w-full max-w-4xl p-3" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setVideo(null)} className="absolute -right-3 -top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-accent text-ink-950 shadow-soft" aria-label="Close video">
              <X size={18} />
            </button>
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${video.video}?autoplay=1&rel=0`}
                title={`${video.name} tutorial`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
