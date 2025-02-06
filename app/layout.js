"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React, { useState } from "react";
import Theme from "./Theme";
import Head from "next/head";
import Navbar from "@/components/Navbar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
<Head>
  <title>JOb Matcher</title>
  <meta name="description" content="Build yoir resume and get insight." />
  <meta name="robots" content="index, follow" />
</Head>;
export default function RootLayout({ children }) {
  const [theme, setTheme] = useState("light");
  return (
    <html data-theme={theme} lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar></Navbar>
        {children}
      </body>
    </html>
  );
}
