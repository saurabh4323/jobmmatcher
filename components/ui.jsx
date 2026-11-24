"use client";

import { AlertTriangle, CheckCircle2, Info, Loader2 } from "lucide-react";

export function PageHeader({ kicker, title, description, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {kicker && <p className="kicker mb-3">{kicker}</p>}
        <h1 className="text-3xl font-bold tracking-tight sm:text-[2rem]">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Spinner({ size = 18, className = "" }) {
  return <Loader2 size={size} className={`animate-spin text-brand ${className}`} aria-hidden="true" />;
}

export function LoadingBlock({ label = "Loading…", className = "" }) {
  return (
    <div className={`card flex items-center justify-center gap-3 p-12 text-sm text-slate-500 ${className}`} role="status">
      <Spinner /> {label}
    </div>
  );
}

const ALERT_STYLES = {
  error: { icon: AlertTriangle, className: "border-danger/30 bg-danger/10 text-red-700" },
  success: { icon: CheckCircle2, className: "border-success/30 bg-success/10 text-emerald-700" },
  info: { icon: Info, className: "border-brand/30 bg-brand/10 text-blue-700" },
};

export function Alert({ tone = "error", children, className = "" }) {
  if (!children) return null;
  const { icon: Icon, className: toneClass } = ALERT_STYLES[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${toneClass} ${className}`}>
      <Icon size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="card relative overflow-hidden px-6 py-16 text-center">
      <div className="grid-bg absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative">
        {Icon && (
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-brand/30 bg-brand/10 text-brand shadow-soft">
            <Icon size={24} />
          </div>
        )}
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>}
        {action && <div className="mt-6 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}

const STAT_ACCENTS = {
  cyan: "text-brand border-brand/30 bg-brand/10",
  pink: "text-accent border-accent/30 bg-accent/10",
  violet: "text-info border-info/30 bg-info/10",
  lime: "text-success border-success/30 bg-success/10",
};

export function StatCard({ icon: Icon, label, value, hint, accent = "cyan" }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
        {Icon && (
          <span className={`grid h-9 w-9 place-items-center rounded-xl border ${STAT_ACCENTS[accent]}`}>
            <Icon size={17} />
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-3xl font-bold text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function Field({ label, hint, id, as = "input", className = "", children, ...props }) {
  const Component = as;
  const fieldId = id || props.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={fieldId} className="label">
          {label}
          {props.required && <span className="text-accent"> *</span>}
        </label>
      )}
      {children || <Component id={fieldId} className="input" {...props} />}
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

const STATUS_STYLES = {
  applied: "border-brand/30 bg-brand/10 text-blue-700",
  interviewed: "border-info/30 bg-info/10 text-sky-700",
  offered: "border-success/30 bg-success/10 text-emerald-700",
  rejected: "border-danger/30 bg-danger/10 text-red-700",
  open: "border-success/30 bg-success/10 text-emerald-700",
  closed: "border-slate-200 bg-slate-100 text-slate-500",
};

export function StatusBadge({ status }) {
  const value = status || "applied";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[value] || STATUS_STYLES.closed}`}>
      {value}
    </span>
  );
}
