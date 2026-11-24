"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Menu, UserRound } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { activeItem } from "@/lib/navigation";
import { initials } from "@/lib/client";

export default function Topbar({ onMenu }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const current = activeItem(user?.role, pathname);
  const profileHref = user?.role === "recruiter" ? "/recruiter/profile" : "/profile";

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (event.key === "Escape" || (event.type === "mousedown" && !menuRef.current?.contains(event.target))) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <header className="no-print sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-10">
      <button type="button" onClick={onMenu} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden" aria-label="Open menu">
        <Menu size={20} />
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-base font-semibold text-slate-900">
          {current?.label || "Workspace"}
        </p>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1 pr-3 text-sm text-slate-700 transition hover:border-brand/40"
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-brand to-accent text-[11px] font-bold text-white">
            {initials(user?.fullName)}
          </span>
          <span className="hidden max-w-[10rem] truncate sm:block">{user?.fullName}</span>
          <ChevronDown size={14} className="text-slate-500" />
        </button>

        {open && (
          <div role="menu" className="card absolute right-0 mt-2 w-56 overflow-hidden p-1.5 animate-fade-up">
            <div className="px-3 py-2">
              <p className="truncate text-sm font-semibold text-slate-900">{user?.fullName}</p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
            <div className="divider my-1" />
            <Link role="menuitem" href={profileHref} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              <UserRound size={16} /> {user?.role === "recruiter" ? "Company profile" : "My profile"}
            </Link>
            <button role="menuitem" type="button" onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-700 hover:bg-danger/10">
              <LogOut size={16} /> Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
