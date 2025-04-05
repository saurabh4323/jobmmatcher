"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./nav.css";
// import useRouter from "next/navigation";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";
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

  return (
    <nav className="navbar" style={{ width: "100%", padding: "10px" }}>
      <div className="navbar-container" style={{ width: "40%" }}>
        <div className="navbar-logo">
          <Link href="/">
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

        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/jobs">Jobs</Link>
          <Link href="/resume">Resume</Link>
          <Link href="/index">Analyze</Link>
          <Link href="/interview">Practice</Link>
        </div>

        <div className="navbar-buttons">
          {status == "authenticated" ? (
            <img
              onClick={() => {
                router.push("/login");
              }}
              src={session.user.image}
              style={{ width: "40px", borderRadius: "20px", cursor: "pointer" }}
            ></img>
          ) : (
            <Link href="/register" className="btn btn-primary">
              Get started for free
            </Link>
          )}
        </div>

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
