"use client";

import { Brain, Code, Database } from "lucide-react";
import React from "react";
import { useState } from "react";

export default function PersonaSelection() {
  const [hoveredPersona, setHoveredPersona] = useState(null);

  return (
    <div className="relative min-h-screen w-full bg-[#1c1d31] overflow-hidden flex items-center justify-center">
      {/* Fountain-like curved lines starting from bottom */}
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 1000 800"
        preserveAspectRatio="none"
      >
        {/* Center point from which all lines originate (at bottom) */}
        <circle cx="500" cy="800" r="4" fill="rgba(255,255,255,0.2)" />

        {/* Lines flowing upward and outward */}
        <path
          d="M520,900 C400,350 200,300 100,250"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
        <path
          d="M510,900 C450,350 400,400 350,250"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />

        {/* Right side curves */}
        <path
          d="M460,900 C600,550 700,400 800,250"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
        <path
          d="M480,900 C550,550 600,400 650,250"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      </svg>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full p-6 z-10">
        {/* Founder Persona */}
        <div
          className="relative p-8 rounded-lg border border-gray-800 transition-all duration-300 hover:border-gray-600"
          onMouseEnter={() => setHoveredPersona("founder")}
          onMouseLeave={() => setHoveredPersona(null)}
        >
          <div
            className="mb-6 flex items-center justify-center w-12 h-12 rounded-full border border-gray-700"
            style={{ backgroundColor: "#1d4ed8" }}
          >
            <Brain></Brain>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 font-sans">
            AI Profile Analysis
          </h2>
          <p className="text-gray-400 mb-6 font-sans">
            Get deep insights into your professional profile with our advanced
            AI analysis
          </p>
          <button
            className="inline-flex   hover:text-green-300 transition-colors font-sans"
            style={{ color: "#1d4ed8" }}
          >
            Explore features for founders
          </button>
        </div>

        {/* Accountant Persona */}
        <div
          className="relative p-8 rounded-lg border border-gray-800 transition-all duration-300 hover:border-gray-600"
          onMouseEnter={() => setHoveredPersona("accountant")}
          onMouseLeave={() => setHoveredPersona(null)}
        >
          <div
            className="mb-6 flex items-center justify-center w-12 h-12 rounded-full border border-gray-700"
            style={{ backgroundColor: "#1d4ed8" }}
          >
            <Database></Database>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 font-serif">
            Smart Job Matching
          </h2>
          <p className="text-gray-400 mb-6 font-serif">
            Match with relevant positions using our intelligent job
            recommendation system
          </p>
          <button
            className="inline-flex   hover:text-green-300 transition-colors font-serif"
            style={{ color: "#1d4ed8" }}
          >
            Explore features for accountants
          </button>
        </div>

        {/* Designer Persona */}
        <div
          className="relative p-8 rounded-lg border border-gray-800 transition-all duration-300 hover:border-gray-600"
          onMouseEnter={() => setHoveredPersona("designer")}
          onMouseLeave={() => setHoveredPersona(null)}
        >
          <div
            className="mb-6 flex items-center justify-center w-12 h-12 rounded-full border border-gray-700"
            style={{ backgroundColor: "#1d4ed8" }}
          >
            <Code></Code>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 font-mono">
            Skill Assessment
          </h2>
          <p className="text-gray-400 mb-6 font-mono">
            Evaluate your technical skills and get personalized learning path
          </p>
          <button
            className="inline-flex  hover:text-green-300 transition-colors font-mono"
            style={{ color: "#1d4ed8" }}
          >
            Explore features for designers
          </button>
        </div>

        {/* Developer Persona */}
        <div
          className="relative p-8 rounded-lg border border-gray-800 transition-all duration-300 hover:border-gray-600"
          onMouseEnter={() => setHoveredPersona("developer")}
          onMouseLeave={() => setHoveredPersona(null)}
        >
          <div
            className="mb-6 flex items-center justify-center w-12 h-12 rounded-full border border-gray-700"
            style={{ backgroundColor: "#1d4ed8" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 font-['Verdana']">
            Resume Builder
          </h2>
          <p className="text-gray-400 mb-6 font-['Verdana']">
            Get resumes that stand out with our AI-powered resume builder.
          </p>
          <button
            className="inline-flex   hover:text-green-300 transition-colors font-['Verdana']"
            style={{ color: "#1d4ed8" }}
          >
            Explore features for developers
          </button>
        </div>
      </div>
    </div>
  );
}
