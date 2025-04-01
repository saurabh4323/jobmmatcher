"use client";
import { Geist_Mono } from "next/font/google"; // Remove invalid Geist import
import "./globals.css";
import Authprovider from "@/components/AuthProvider";
import React, { useState } from "react";
import Theme from "./Theme";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import CircularLoopBackground from "./Circ";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState("light");

  return (
    <html data-theme={theme} lang="en">
      <Head>
        <title>Skillo</title>
        <meta
          name="description"
          content="Build your resume and get insights."
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <body className={`${geistMono.variable} antialiased`}>
        <Authprovider>
          <Navbar />

          <main>{children}</main>
        </Authprovider>
      </body>
    </html>
  );
}
