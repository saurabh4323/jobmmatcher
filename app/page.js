import React from "react";
import "./globals.css";
import UserSelectionPage from "@/components/Choose";

export const metadata = {
  title: "Job Matcher",
  description: "Build your resume and get insights.",
  robots: "index, follow",
};

export default function page() {
  return (
    <div>
      <UserSelectionPage />
    </div>
  );
}
