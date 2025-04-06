"use client";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
// import "../styles/globals.css";
import Authprovider from "@/components/AuthProvider";
import React, { useEffect, useState } from "react";
// import Theme from "./Theme";
import Head from "next/head";
import Navbar from "@/components/Navbar";
// import CircularLoopBackground from "./Circ";
import Footer from "@/components/Footer";
import Navbarrec from "./recuiter/Navbar/Page";
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
        <title>Skillo</title>
        <meta
          name="description"
          content="Build your resume and get insights."
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <body className={`${geistMono.variable} antialiased`}>
        <Authprovider>
          {show ? <Navbarrec></Navbarrec> : <Navbar></Navbar>}

          <main>{children}</main>
          <Footer></Footer>
        </Authprovider>
      </body>
    </html>
  );
}
