"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import PublicNavbar from "./PublicNavbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const PUBLIC_ONLY = ["/", "/login", "/register"];

export default function AppShell({ children }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => setDrawerOpen(false), [pathname]);

  // Marketing + auth pages (and anything viewed signed-out) use the public chrome.
  if (!user || PUBLIC_ONLY.includes(pathname)) {
    return (
      <div className="flex min-h-screen flex-col">
        <PublicNavbar />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:pl-64">
      <Sidebar role={user.role} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="flex min-h-screen flex-col">
        <Topbar onMenu={() => setDrawerOpen(true)} />
        <main id="main" className="print-reset flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
