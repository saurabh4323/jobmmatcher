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

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setdata] = useState([]);
  const api_endpoint = "https://nubela.co/proxycurl/api/v2/linkedin";
  const linkedin_profile_url = linkedinUrl;
  const api_key = "OZ49GF4S4U4pCbB_1Cp0uQ";
  // components/LinkedIn.jsx
  const router = useRouter();

  // Create animated background elements
  const [animatedElements, setAnimatedElements] = useState([]);

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
      style={{ backgroundColor: "#1c1d31" }}
    >
      {/* Animated background elements */}
      {/* <div className="absolute inset-0 overflow-hidden">
        {animatedElements.map((el) => (
          <div
            key={el.id}
            className="absolute rounded-full animate-pulse"
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
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div> */}

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1c1d31] opacity-90 z-0"></div>

      <div className="hero-content relative z-10">
        <div className="top">
          {" "}
          <h1 className="hero-title">Accelerate Your Tech Career</h1>
          <div className="hero-subtitle">
            <span style={{ fontWeight: 500 }}>
              Use insights to land your dream tech job. Analyze your profile,
              track applications
            </span>
            <a
              href="https://stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="stripe-link"
              style={{ fontWeight: 500 }}
            >
              and get personalized recommendations.
            </a>
          </div>
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-8">
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

        {/* <div className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "AI Profile Analysis",
                  description:
                    "Get deep insights into your professional profile with our advanced AI analysis.",
                  width: "400+ data points analyzed",
                },
                {
                  icon: Database,
                  title: "Smart Job Matching",
                  description:
                    "Match with relevant positions using our intelligent job recommendation system.",
                  width: "10,000+ job matches",
                },
                {
                  icon: Code,
                  title: "Skill Assessment",
                  description:
                    "Evaluate your technical skills and get personalized learning paths.",
                  width: "250+ skills tracked",
                },
              ].map((feature, index) => (
                <div
                  style={{ border: "1px solid #1d4ed8" }}
                  key={index}
                  className="group relative p-8 bg-gray-800/50 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-md"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                    style={{ border: "1px solid #1d4ed8" }}
                  />

                  <div className="relative">
                    <div className="flex justify-between items-start">
                      <div
                        className="h-12 w-12 rounded-lg flex items-center justify-center mb-6"
                        style={{ backgroundColor: "#1d4ed8" }}
                      >
                        <feature.icon className="h-6 w-6 text-black-500" />
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-sm text-gray-300 p-2 rounded">
                        {feature.width}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>

                    <button className="mt-6 flex items-center text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Learn more</span>
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}
        <PersonaSelection></PersonaSelection>

        <div className="py-20 px-4">
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
      `}</style>
    </section>
  );
}
