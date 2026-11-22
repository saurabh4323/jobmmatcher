"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./nav.css";
import { ChevronDown, LogOut, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  useEffect(() => {
    const login = localStorage.getItem("tokenid");
    if (login) {
      setShow(true);
    }
  }, []);

  const userImage = "https://robohash.org/123";

  const signOut = () => {
    localStorage.removeItem("tokenid");
    localStorage.removeItem("jobid");
    setAccountMenuOpen(false);
    setShow(false);
    router.replace("/");
  };

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link href={show ? "/dashboard" : "/"} aria-label="Job Matcher home">
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
              <span className="logo-text">Job Matcher</span>
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <Link onClick={() => setMenuOpen(false)} href="/dashboard">Dashboard</Link>
          <Link onClick={() => setMenuOpen(false)} href="/learning">Learning</Link>
          <Link onClick={() => setMenuOpen(false)} href="/jobs">Jobs</Link>
          <Link onClick={() => setMenuOpen(false)} href="/resume">Resume</Link>
          <Link onClick={() => setMenuOpen(false)} href="/interview">Practice</Link>
        </div>

        {/* Buttons/User */}
        <div className="navbar-buttons">
          {show ? (
            <div className="account-menu-wrap">
              <button
                type="button"
                className="account-menu-trigger"
                aria-label="Open account menu"
                aria-haspopup="menu"
                aria-expanded={accountMenuOpen}
                onClick={() => setAccountMenuOpen((open) => !open)}
              >
                <img src={userImage} alt="" />
                <ChevronDown size={15} aria-hidden="true" />
              </button>
              {accountMenuOpen && (
                <div className="account-menu" role="menu" aria-label="Account menu">
                  <button type="button" role="menuitem" onClick={signOut}>
                    <LogOut size={16} aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/choose" className="btn btn-primary">
              Get started for free
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="navbar-mobile-toggle"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
