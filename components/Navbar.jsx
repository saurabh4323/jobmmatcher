"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Rocket,
  Terminal,
  Brain,
  Briefcase,
  Award,
  ChevronRight,
  Database,
  Code,
  Cpu,
  LineChart,
  Users,
  Zap,
  Search,
  Bell,
  Menu,
  X,
  ExternalLink,
  Info,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      {" "}
      <nav className="fixed w-full bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-2">
              <Rocket className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                JobMatcher
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {["Dashboard", "Jobs", "Skills", "Network"].map((item) => (
                <Link href={`/${item.toLowerCase()}`} key={item}>
                  <button className="px-4 py-2 text-gray-400 hover:text-blue-500 transition-colors relative group">
                    {item}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </button>
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2">
                <span>Get Started</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <button
              className="md:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
