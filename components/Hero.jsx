"use client";
import React, { useState, useEffect } from "react";
import "./Hero.css";
import Link from "next/link";
import axios from "axios";
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
import { useRouter } from "next/navigation";
import PersonaSelection from "./PersonaSelection";
// import PdfTextExtractor from "./PdfTextExtractor";

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setdata] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const api_endpoint = "https://nubela.co/proxycurl/api/v2/linkedin";
  const linkedin_profile_url = linkedinUrl;
  const api_key = "OZ49GF4S4U4pCbB_1Cp0uQ";
  // components/LinkedIn.jsx
  const router = useRouter();

  // Create animated background elements
  const [animatedElements, setAnimatedElements] = useState([]);

  // Handle scroll events for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Generate random animated elements
    const elements = [];
    for (let i = 0; i < 15; i++) {
      elements.push({
        id: i,
        size: Math.random() * 200 + 50, // 50-250px
        posX: Math.random() * 100, // 0-100%
        posY: Math.random() * 100, // 0-100%
        opacity: Math.random() * 0.2 + 0.05, // 0.05-0.25
        speed: Math.random() * 60 + 20, // 20-80s
        delay: Math.random() * -60, // -60-0s (negative for staggered start)
        color: Math.random() > 0.5 ? "#0ab868" : "#3365FF", // Brand colors
        parallaxSpeed: Math.random() * 0.5 + 0.1, // Different speeds for parallax
      });
    }
    setAnimatedElements(elements);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);

    try {
      // Clean the URL to ensure proper format
      const cleanUrl = linkedinUrl.replace(/^https?:\/\//, "");

      const response = await axios.get(
        `/api/proxycurl/${encodeURIComponent(cleanUrl)}`
      );

      console.log(response.data);
      let saving;
      setdata(response.data);
      if (window != undefined) {
        saving = localStorage.setItem(
          "profiledata",
          JSON.stringify(response.data)
        );
      }
      router.push("/dashboard");
    } catch (error) {
      console.log("Full error object:", error);
      console.log("Response data:", error.response?.data);
      console.error(
        "Error fetching LinkedIn data:",
        error.response?.data?.error || error.message
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section
      className="hero relative overflow-hidden"
      style={{
        backgroundColor: "#1c1d31",
        minHeight: "100vh",
      }}
    >
      {/* Parallax background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {animatedElements.map((el) => (
          <div
            key={el.id}
            className="absolute rounded-full"
            style={{
              width: `${el.size}px`,
              height: `${el.size}px`,
              left: `${el.posX}%`,
              top: `${el.posY}%`,
              opacity: el.opacity,
              backgroundColor: el.color,
              filter: "blur(40px)",
              animation: `float ${el.speed}s infinite linear, pulse 8s infinite ease-in-out`,
              animationDelay: `${el.delay}s`,
              transform: `translate(-50%, -50%) translateY(${scrollY * el.parallaxSpeed}px)`,
              transition: "transform 0.1s ease-out",
              zIndex: 0,
            }}
          />
        ))}
      </div>

      {/* Subtle particle overlay */}
      <div className="parallax-particles absolute inset-0 z-0 opacity-30"></div>

      {/* Gradient overlay for better text readability */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1c1d31] opacity-90 z-0"
        style={{ transform: `translateY(${scrollY * 0.05}px)` }}
      ></div>

      <div
        className="hero-content relative z-10"
        style={{ transform: `translateY(${scrollY * -0.15}px)` }}
      >
        <div className="top transform transition-transform duration-300">
          <h1
            className="hero-title"
            style={{ transform: `translateY(${scrollY * -0.2}px)` }}
          >
            Accelerate Your Tech Career
          </h1>
          <div
            className="hero-subtitle"
            style={{ transform: `translateY(${scrollY * -0.15}px)` }}
          >
            <span style={{ fontWeight: 500 }}>
              Use insights to land your dream tech job. Analyze your profile,
              track applications
            </span>
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="stripe-link"
              style={{ fontWeight: 500 }}
            >
              and get personalized recommendations.
            </a>
          </div>
          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto mb-8"
            style={{ transform: `translateY(${scrollY * -0.1}px)` }}
          >
            <div className="relative">
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="Enter your LinkedIn URL"
                className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm"
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-2 px-4 py-2 hover:bg-blue-700 rounded-lg transition-all transform hover:scale-105 flex items-center space-x-2"
                disabled={isAnalyzing}
                style={{ backgroundColor: "#1d4ed8" }}
              >
                {isAnalyzing ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    <span>Analyze</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* <PdfTextExtractor
          style={{ transform: `translateY(${scrollY * -0.05}px)` }}
        /> */}
        <PersonaSelection
          style={{ transform: `translateY(${scrollY * -0.02}px)` }}
        />

        <div
          className="py-20 px-4"
          style={{ transform: `translateY(${scrollY * -0.01}px)` }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-12 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl border border-blue-800/50 backdrop-blur-md">
              <h2 className="text-4xl font-bold mb-6">
                Ready to Accelerate Your Career?
              </h2>
              <p className="text-gray-400 mb-8">
                Join thousands of tech professionals who have already
                transformed their careers with our AI-powered platform.
              </p>
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto">
                <Award className="h-5 w-5" />
                <span>Start Free Analysis</span>
                <ExternalLink className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add necessary CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateX(0)
              translateY(0);
          }
          25% {
            transform: translate(-50%, -50%) rotate(90deg) translateX(30px)
              translateY(30px);
          }
          50% {
            transform: translate(-50%, -50%) rotate(180deg) translateX(0)
              translateY(60px);
          }
          75% {
            transform: translate(-50%, -50%) rotate(270deg) translateX(-30px)
              translateY(30px);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) translateX(0)
              translateY(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.05;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.2;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        .parallax-particles {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23404' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%23505'%3E%3Ccircle cx='769' cy='229' r='5'/%3E%3Ccircle cx='539' cy='269' r='5'/%3E%3Ccircle cx='603' cy='493' r='5'/%3E%3Ccircle cx='731' cy='737' r='5'/%3E%3Ccircle cx='520' cy='660' r='5'/%3E%3Ccircle cx='309' cy='538' r='5'/%3E%3Ccircle cx='295' cy='764' r='5'/%3E%3Ccircle cx='40' cy='599' r='5'/%3E%3Ccircle cx='102' cy='382' r='5'/%3E%3Ccircle cx='127' cy='80' r='5'/%3E%3Ccircle cx='370' cy='105' r='5'/%3E%3Ccircle cx='578' cy='42' r='5'/%3E%3Ccircle cx='237' cy='261' r='5'/%3E%3Ccircle cx='390' cy='382' r='5'/%3E%3C/g%3E%3C/svg%3E");
        }

        .hero {
          perspective: 1000px;
        }

        .hero-content {
          will-change: transform;
        }

        .hero-title {
          will-change: transform;
          transition: transform 0.2s ease-out;
        }

        .hero-subtitle {
          will-change: transform;
          transition: transform 0.2s ease-out;
        }
      `}</style>
    </section>
  );
}
