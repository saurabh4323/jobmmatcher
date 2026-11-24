import {
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  Code2,
  FilePlus2,
  FileText,
  LayoutDashboard,
  MessagesSquare,
  Search,
  UserRound,
  Users,
  Video,
} from "lucide-react";

export const NAV = {
  candidate: [
    {
      section: "Overview",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/jobs", label: "Find jobs", icon: Search },
        { href: "/applications", label: "My applications", icon: ClipboardList },
      ],
    },
    {
      section: "Prepare",
      items: [
        { href: "/resume", label: "Resume builder", icon: FileText },
        { href: "/interview", label: "Interview prep", icon: MessagesSquare },
        { href: "/programming", label: "Coding practice", icon: Code2 },
        { href: "/learning", label: "Learning", icon: BookOpen },
      ],
    },
    {
      section: "Account",
      items: [{ href: "/profile", label: "Profile", icon: UserRound }],
    },
  ],
  recruiter: [
    {
      section: "Hiring",
      items: [
        { href: "/recruiter", label: "Overview", icon: LayoutDashboard, exact: true },
        { href: "/recruiter/jobs", label: "Job posts", icon: BriefcaseBusiness },
        { href: "/recruiter/jobs/new", label: "Post a job", icon: FilePlus2 },
        { href: "/recruiter/candidates", label: "Candidates", icon: Users },
        { href: "/recruiter/interview", label: "Live interview", icon: Video },
      ],
    },
    {
      section: "Account",
      items: [{ href: "/recruiter/profile", label: "Company profile", icon: Building2 }],
    },
  ],
};

/** Finds the most specific nav item that matches the current path. */
export function activeItem(role, pathname) {
  const items = (NAV[role] || []).flatMap((group) => group.items);
  return items
    .filter((item) =>
      item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`)
    )
    .sort((a, b) => b.href.length - a.href.length)[0];
}
