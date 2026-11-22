"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Palette, Layers, Grid } from "lucide-react";

const templates = [
  { id: "1", name: "Modern Minimal", description: "A clean, professional layout with balanced white space.", icon: Palette },
  { id: "2", name: "Creative Bold", description: "A colorful design with a confident visual style.", icon: Layers },
  { id: "3", name: "Classic Elegant", description: "A traditional format with refined typography.", icon: Grid },
];

export default function ResumeTemplatesPage() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-[#111322] px-5 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-sm font-medium text-blue-300">RESUME BUILDER</p>
        <h1 className="text-4xl font-bold tracking-tight">Choose a design</h1>
        <p className="mt-3 text-slate-300">Your details are saved in this browser. Pick a template to preview your resume.</p>
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {templates.map(({ id, name, description, icon: Icon }) => (
            <button key={id} onClick={() => router.push(`/resume/${id}`)} className="rounded-2xl border border-slate-700 bg-slate-900 p-6 text-left transition hover:border-blue-400">
              <Icon className="mb-5 text-blue-300" size={27} />
              <span className="block text-xl font-semibold">{name}</span>
              <span className="mt-2 block text-sm text-slate-400">{description}</span>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-300">Use this design <ArrowRight size={16} /></span>
            </button>
          ))}
        </div>
        <button onClick={() => router.push("/resume")} className="mt-7 text-sm text-slate-400 hover:text-white">← Back to resume details</button>
      </div>
    </main>
  );
}
