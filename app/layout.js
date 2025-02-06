"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React, { useState } from "react";
import Theme from "./Theme";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState("light");
  return (
    <html data-theme={theme} lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <Theme setTheme={setTheme} /> */}
        {children}
      </body>
    </html>
  );
}
