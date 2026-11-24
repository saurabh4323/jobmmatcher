import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-20">
      <div className="grid-bg absolute inset-0" aria-hidden="true" />
      <div className="relative text-center">
        <p className="kicker mb-6">Error 404</p>
        <h1 className="font-display text-[clamp(5rem,18vw,11rem)] font-extrabold leading-none tracking-tight">
          <span className="text-brand">4</span>
          <span className="text-accent">0</span>
          <span className="text-brand">4</span>
        </h1>
        <h2 className="mt-6 text-2xl font-semibold">Page not found</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
          The page you’re looking for doesn’t exist or may have been moved. Check the address, or use the links below.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            <ArrowLeft size={16} /> Back home
          </Link>
          <Link href="/dashboard" className="btn btn-ghost">
            <Compass size={16} /> Go to my workspace
          </Link>
        </div>
      </div>
    </section>
  );
}
