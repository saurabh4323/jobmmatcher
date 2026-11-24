"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

export default function CopyLinkButton({ jobId, className = "btn btn-ghost btn-sm", label = "Copy apply link" }) {
  const [state, setState] = useState("");

  const copy = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const url = `${window.location.origin}/jobs/${jobId}`;
    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
    } catch {
      window.prompt("Copy this link:", url);
    }
    setTimeout(() => setState(""), 2000);
  };

  return (
    <button type="button" onClick={copy} className={className}>
      {state === "copied" ? <Check size={14} className="text-success" /> : <Link2 size={14} />}
      {state === "copied" ? "Copied!" : label}
    </button>
  );
}
