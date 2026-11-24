"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { NAV, activeItem } from "@/lib/navigation";
import { initials } from "@/lib/client";
import Logo from "./Logo";

export default function Sidebar({ role, open, onClose }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const current = activeItem(role, pathname);
  const groups = NAV[role] || [];

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`no-print fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`no-print fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Sidebar"
      >

        <div className="flex h-16 items-center justify-between px-5">
          <Logo href={role === "recruiter" ? "/recruiter" : "/dashboard"} />
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:text-slate-900 lg:hidden" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <div className="mx-5 mb-4 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
          <p className="text-xs font-semibold text-brand">{role === "recruiter" ? "Recruiter workspace" : "Candidate workspace"}</p>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
          {groups.map((group) => (
            <div key={group.section}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{group.section}</p>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = current?.href === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                          active
                            ? "bg-blue-50 text-brand font-semibold"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-brand " aria-hidden="true" />
                        )}
                        <Icon size={18} className={active ? "text-brand" : "text-slate-500 group-hover:text-brand"} aria-hidden="true" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-3">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-accent text-xs font-bold text-white">
              {initials(user?.fullName)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{user?.fullName}</p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
            <button type="button" onClick={logout} className="rounded-lg p-2 text-slate-500 transition hover:bg-danger/10 hover:text-danger" aria-label="Sign out" title="Sign out">
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
