"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, TriangleAlert } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-20">
      <div className="grid-bg absolute inset-0" aria-hidden="true" />
      <div className="card relative max-w-lg p-10 text-center">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl border border-accent/40 bg-accent/10 text-accent shadow-soft">
          <TriangleAlert size={28} />
        </div>
        <p className="kicker mb-3 !text-accent">Unexpected error</p>
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          An unexpected error stopped this page from loading. Try again — if it keeps happening, come back in a moment.
        </p>
        {error?.digest && <p className="mt-3 font-mono text-xs text-slate-400">Ref: {error.digest}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn btn-primary">
            <RotateCcw size={16} /> Try again
          </button>
          <Link href="/" className="btn btn-ghost">Back home</Link>
        </div>
      </div>
    </section>
  );
}
