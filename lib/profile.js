"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client";

export const EMPTY_PROFILE = {
  full_name: "",
  headline: "",
  email: "",
  phone: "",
  city: "",
  country: "",
  summary: "",
  skills: [],
  experiences: [],
  education: [],
  github: "",
  linkedIn: "",
  website: "",
  openToWork: true,
  preferredWork: "Remote",
};

/** Loads and saves the signed-in candidate's profile. */
export function useProfile() {
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api("/api/profile");
      setProfile({ ...EMPTY_PROFILE, ...data.profile });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(async (next) => {
    const data = await api("/api/profile", { method: "PUT", body: next });
    const saved = { ...EMPTY_PROFILE, ...data.profile };
    setProfile(saved);
    return saved;
  }, []);

  return { profile, setProfile, loading, error, save, reload: load };
}

/** Profile completeness as a percentage plus the list of missing items. */
export function completeness(profile = {}) {
  const checks = [
    ["Name", Boolean(profile.full_name)],
    ["Headline", Boolean(profile.headline)],
    ["Location", Boolean(profile.city || profile.country)],
    ["Summary", (profile.summary || "").length >= 40],
    ["3+ skills", (profile.skills || []).length >= 3],
    ["Experience", (profile.experiences || []).length > 0],
    ["Education", (profile.education || []).length > 0],
    ["Phone", Boolean(profile.phone)],
    ["A public link", Boolean(profile.linkedIn || profile.github || profile.website)],
  ];
  const done = checks.filter(([, ok]) => ok).length;
  return {
    percent: Math.round((done / checks.length) * 100),
    missing: checks.filter(([, ok]) => !ok).map(([label]) => label),
  };
}

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9+#]/g, "");

/** Skills on the profile that also appear in a job's skills/tags. */
export function matchSkills(profileSkills = [], jobSkills = []) {
  const mine = profileSkills.map(normalize).filter(Boolean);
  return jobSkills.filter((skill) => {
    const theirs = normalize(skill);
    return theirs && mine.some((own) => own === theirs || (own.length > 2 && theirs.includes(own)) || (theirs.length > 2 && own.includes(theirs)));
  });
}

export const ensureUrl = (value) => (!value ? "" : /^https?:\/\//i.test(value) ? value : `https://${value}`);
