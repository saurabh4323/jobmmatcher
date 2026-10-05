"use client";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Navbarrec from "./recruiter/Navbar/Page";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [show, setshow] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const login = localStorage.getItem("recid");
    if (login) {
      setshow(true);
    }
  }, []);

  return (
    <html data-theme={theme} lang="en">
      <Head>
        <title>Job Matcher</title>
        <meta
          name="description"
          content="Build your resume and get insights."
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <body className={`${geistMono.variable} antialiased`}>
        {show ? <Navbarrec /> : <Navbar />}
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
