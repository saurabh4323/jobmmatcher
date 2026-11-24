import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import AppShell from "@/components/layout/AppShell";
import { getSession, publicUser } from "@/lib/auth";

// Fonts load from Google Fonts at runtime. (next/font/google in Next 15.1 crashes at build
// time when Google returns font URLs without a file extension, which happens on Vercel.)
const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap";

export const metadata = {
  title: { default: "Job Matcher — Build, practice, get hired", template: "%s · Job Matcher" },
  description: "Build a standout resume, practice interviews with AI, and connect with recruiters.",
  robots: "index, follow",
};

export const viewport = { themeColor: "#ffffff" };

export default async function RootLayout({ children }) {
  const user = publicUser(await getSession());

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href={FONTS_URL} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <AuthProvider initialUser={user}>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
