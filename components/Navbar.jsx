"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./nav.css";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const login = localStorage.getItem("tokenid");
    if (login) {
      setShow(true);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      setShow(true);
    }
  }, [status]);

  const userImage = session?.user?.image || "https://robohash.org/123";

  return (
    <nav className="navbar" style={{ width: "100%", padding: "10px" }}>
      <div className="navbar-container" style={{ width: "40%" }}>
        {/* Logo */}
        <div className="navbar-logo">
          <Link href="/student/home">
            <div className="logo-container">
              <div className="logo-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <span className="logo-text">Skillo</span>
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/jobs">Jobs</Link>
          <Link href="/resume">Resume</Link>
          <Link href="/interview">Practice</Link>
          <Link href="/profile">Profile</Link>
        </div>

        {/* Buttons/User */}
        <div className="navbar-buttons">
          {status === "authenticated" || show ? (
            <img
              onClick={() => router.push("/login")}
              src={userImage}
              alt="User Avatar"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "20px",
                cursor: "pointer",
              }}
            />
          ) : (
            <Link href="/choose" className="btn btn-primary">
              Get started for free
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div
          className="navbar-mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
      </div>
    </nav>
  );
}
