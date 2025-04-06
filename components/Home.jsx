"use client";
import React, { useState } from "react";
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
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";

const JobPlatform = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setdata] = useState([]);
  const api_endpoint = "https://nubela.co/proxycurl/api/v2/linkedin";
  const linkedin_profile_url = linkedinUrl;
  const api_key = "kl_ojowsbUDnKlGYvV6AyQ";
  // components/LinkedIn.jsx
  const router = useRouter();
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
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* <Navbar></Navbar> */}

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800/50 rounded-full mb-8">
            <Zap className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-blue-500">
              Powered by Advanced AI
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-8">
            Accelerate Your Tech Career
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            Use insights to land your dream tech job. Analyze your profile,
            track applications, and get personalized recommendations.
          </p>

          <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="Enter your LinkedIn URL"
                className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all transform hover:scale-105 flex items-center space-x-2"
                disabled={isAnalyzing}
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
      </div>

      <div className="py-20 px-4 bg-gray-900/50">
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
                key={index}
                className="group relative p-8 bg-gray-800/50 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />

                <div className="relative">
                  <div className="flex justify-between items-start">
                    <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                      <feature.icon className="h-6 w-6 text-blue-500" />
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
      </div>

      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "95%", label: "Success Rate", icon: LineChart },
              { number: "50K+", label: "Profiles Analyzed", icon: Users },
              { number: "200+", label: "Partner Companies", icon: Briefcase },
              { number: "24/7", label: "AI Support", icon: Cpu },
            ].map((stat, index) => (
              <div
                key={index}
                className="p-6 bg-gray-800/30 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all group"
              >
                <stat.icon className="h-8 w-8 text-blue-500 mb-4" />
                <div className="text-3xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl border border-blue-800/50">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-gray-400 mb-8">
              Join thousands of tech professionals who have already transformed
              their careers with our AI-powered platform.
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
  );
};

export default JobPlatform;
