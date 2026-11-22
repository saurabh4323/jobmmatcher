"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  GraduationCap,
  Sparkles,
} from "lucide-react";

const paths = [
  {
    name: "For candidates",
    title: "Build a career that fits you.",
    description:
      "Make your next move with thoughtful tools for your resume, job search, learning, and interview practice.",
    href: "/register?mode=signup",
    loginHref: "/register",
    label: "Create candidate account",
    icon: GraduationCap,
    accent: "candidate",
    features: ["Create a polished resume", "Find roles that fit", "Practice with confidence"],
  },
  {
    name: "For recruiters",
    title: "Meet your next great hire.",
    description:
      "Bring your hiring workflow together, share opportunities, and connect with people ready to grow.",
    href: "/recruiter/register?mode=signup",
    loginHref: "/recruiter/register",
    label: "Create recruiter account",
    icon: BriefcaseBusiness,
    accent: "recruiter",
    features: ["Publish open roles", "Reach motivated talent", "Keep hiring organized"],
  },
];

export default function UserSelectionPage() {
  return (
    <section className="path-page">
      <div className="path-orb path-orb-one" aria-hidden="true" />
      <div className="path-orb path-orb-two" aria-hidden="true" />

      <div className="path-content">
        <div className="path-intro">
          <div className="path-eyebrow">
            <Sparkles size={15} aria-hidden="true" />
            <span>Your next chapter starts here</span>
          </div>
          <h1>
            Find your way to <span>what’s next.</span>
          </h1>
          <p>
            A clearer path to better opportunities, stronger teams, and work that
            moves you forward.
          </p>
        </div>

        <div className="path-grid">
          {paths.map((path) => {
            const Icon = path.icon;
            return (
              <article className={`path-card path-card-${path.accent}`} key={path.name}>
                <div className="path-card-top">
                  <div className="path-icon">
                    <Icon size={23} strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <span className="path-audience">{path.name}</span>
                  <ArrowDownRight className="path-card-arrow" size={20} aria-hidden="true" />
                </div>
                <h2>{path.title}</h2>
                <p className="path-description">{path.description}</p>
                <ul className="path-features">
                  {path.features.map((feature) => (
                    <li key={feature}>
                      <Check size={16} aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="path-actions">
                  <Link className="path-primary" href={path.href}>
                    {path.label}
                    <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                  <Link className="path-login" href={path.loginHref}>
                    Already have an account? <span>Log in</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <p className="path-note">
          One platform for every step of the journey. Choose your path to get
          started.
        </p>
      </div>
    </section>
  );
}
