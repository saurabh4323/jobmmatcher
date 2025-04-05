// pages/profile.js
"use client"; // pages/profile.js
import { useState, useEffect } from "react";
import Head from "next/head";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showNotification, setShowNotification] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);

  // Animation effects
  useEffect(() => {
    setTimeout(() => {
      setShowNotification(true);
    }, 1500);

    setTimeout(() => {
      setAnimateScore(true);
    }, 800);
  }, []);

  // Mock user data
  const userData = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    gender: "Non-binary",
    headline: "Senior Full Stack Developer",
    summary:
      "Passionate developer with 5+ years of experience in React, Node.js, and cloud technologies. Looking for remote opportunities in fintech or healthcare.",
    linkedIn: "linkedin.com/in/alexjohnson",
    github: "github.com/alexjohnsondev",
    photo:
      "ht/photo/20241018/young-sexy-girl-in-lingerie-on-the-bed_10973720.jpg!bw700",
    atsScore: 87,
    resumeStrength: 82,
    profileViews: 342,
    saveRate: 78,
    responseRate: 91,
    interviewConversion: 64,
    jobsApplied: 24,
    thisWeekApplied: 5,
    applications: [
      {
        company: "TechCorp",
        position: "Senior Developer",
        status: "Interview",
        date: "2025-03-28",
        logo: "/api/placeholder/40/40",
        salary: "$125K-$150K",
        matchScore: 94,
      },
      {
        company: "DataSys",
        position: "Full Stack Engineer",
        status: "Applied",
        date: "2025-04-01",
        logo: "/api/placeholder/40/40",
        salary: "$110K-$135K",
        matchScore: 89,
      },
      {
        company: "HealthTech",
        position: "Frontend Lead",
        status: "Rejected",
        date: "2025-03-15",
        logo: "/api/placeholder/40/40",
        salary: "$120K-$140K",
        matchScore: 76,
      },
      {
        company: "FinanceApp",
        position: "React Developer",
        status: "Offer",
        date: "2025-03-10",
        logo: "/api/placeholder/40/40",
        salary: "$130K-$155K",
        matchScore: 97,
      },
    ],
    skills: [
      { name: "React", level: 95, endorsements: 42 },
      { name: "Node.js", level: 88, endorsements: 36 },
      { name: "TypeScript", level: 90, endorsements: 29 },
      { name: "AWS", level: 82, endorsements: 23 },
      { name: "MongoDB", level: 79, endorsements: 18 },
      { name: "Docker", level: 85, endorsements: 21 },
    ],
    achievements: [
      {
        icon: "🏆",
        title: "Top 5% Profile",
        description: "Your profile outperforms 95% of job seekers",
      },
      {
        icon: "⚡",
        title: "Fast Responder",
        description: "You respond to recruiters within 2 hours",
      },
      {
        icon: "🎯",
        title: "Perfect Match",
        description: "5 jobs matching your skills are available",
      },
    ],
    certifications: [
      {
        name: "AWS Certified Developer",
        date: "2024",
        issuer: "Amazon Web Services",
        logo: "/api/placeholder/30/30",
      },
      {
        name: "MongoDB Professional",
        date: "2023",
        issuer: "MongoDB University",
        logo: "/api/placeholder/30/30",
      },
    ],
    salary: { min: 120000, max: 150000, currency: "USD" },
    interviews: [
      {
        company: "TechCorp",
        position: "Senior Developer",
        date: "2025-04-10",
        status: "Scheduled",
        type: "Technical",
        duration: 60,
      },
      {
        company: "CloudNine",
        position: "Lead Developer",
        date: "2025-04-15",
        status: "Preparation",
        type: "Behavioral",
        duration: 45,
      },
    ],
    jobRecommendations: [
      {
        title: "Lead Developer",
        company: "Innovation Tech",
        location: "Remote",
        matchScore: 94,
        salary: "$140K-$160K",
        postedDays: 2,
        logo: "/api/placeholder/40/40",
      },
      {
        title: "Senior Frontend Engineer",
        company: "WebPros",
        location: "San Francisco (Hybrid)",
        matchScore: 91,
        salary: "$130K-$150K",
        postedDays: 1,
        logo: "/api/placeholder/40/40",
      },
      {
        title: "Full Stack Lead",
        company: "DataFlow",
        location: "Remote",
        matchScore: 89,
        salary: "$125K-$145K",
        postedDays: 3,
        logo: "/api/placeholder/40/40",
      },
    ],
    analytics: {
      profileGrowth: [28, 32, 45, 52, 61, 85],
      applicationResults: {
        offers: 15,
        interviews: 25,
        rejected: 20,
        pending: 40,
      },
      skillsGap: { frontEnd: 5, backEnd: 10, cloud: 15, ai: 25, security: 20 },
    },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-800";
      case "Interview":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Offer":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Head>
        <title>{userData.name} | JobFinder Profile</title>
        <meta
          name="description"
          content="Advanced job search profile dashboard"
        />
      </Head>

      <div
        className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50"
        style={{ marginTop: "100px" }}
      >
        {/* Header */}
        <header className="bg-white shadow-lg sticky top-0 z-10 border-b border-indigo-100">
          <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white font-bold text-xl p-2 rounded-lg mr-3 shadow-md">
                  JF
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center">
                  My Profile
                  <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                    LIVE
                  </span>
                </h1>
              </div>
              <div className="flex space-x-3">
                <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center text-sm transition-colors">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Preview
                </button>
                <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center text-sm transition-colors shadow-md">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex mt-4 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`pb-3 px-4 text-sm font-medium ${activeTab === "dashboard" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("applications")}
                className={`pb-3 px-4 text-sm font-medium ${activeTab === "applications" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                Applications
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Notification */}
          {showNotification && (
            <div className="fixed top-20 right-4 bg-white rounded-lg shadow-xl border border-green-100 p-4 animate-fade-in-right max-w-sm z-50">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">
                    Great news! 3 new jobs match your profile
                  </p>
                  <div className="mt-1">
                    <button
                      onClick={() => setShowNotification(false)}
                      className="text-xs text-indigo-600 hover:text-indigo-500"
                    >
                      View jobs
                    </button>
                  </div>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      onClick={() => setShowNotification(false)}
                      className="inline-flex rounded-md p-1.5 text-gray-500 hover:bg-gray-100 focus:outline-none"
                    >
                      <span className="sr-only">Dismiss</span>
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "dashboard" && (
            <div className="grid grid-cols-12 gap-6">
              {/* Personal Info Card */}
              <div className="col-span-12 lg:col-span-4">
                <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-indigo-50">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-center relative">
                    <span className="absolute top-2 right-2 bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                      Top Candidate
                    </span>
                    <img
                      src={userData.photo}
                      alt="Profile"
                      className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-xl object-cover"
                    />
                    <h2 className="mt-4 text-xl font-bold text-white">
                      {userData.name}
                    </h2>
                    <p className="text-indigo-100">{userData.headline}</p>
                    <div className="flex justify-center mt-2 space-x-2">
                      <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                        Open to Work
                      </span>
                      <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                        Remote Preferred
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-indigo-500 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-gray-700">{userData.email}</span>
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-indigo-500 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="text-gray-700">{userData.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-indigo-500 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        <a
                          href={`https://${userData.linkedIn}`}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          {userData.linkedIn}
                        </a>
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-indigo-500 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                          />
                        </svg>
                        <a
                          href={`https://${userData.github}`}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          {userData.github}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Dashboard Content */}
              <div className="col-span-12 lg:col-span-8">
                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white shadow-md rounded-xl p-4 border border-indigo-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">Profile Views</p>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        +24%
                      </span>
                    </div>
                    <p className="text-2xl font-bold mt-1">
                      {userData.profileViews}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
                  </div>
                  <div className="bg-white shadow-md rounded-xl p-4 border border-indigo-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">Applications</p>
                      <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                        Total
                      </span>
                    </div>
                    <p className="text-2xl font-bold mt-1">
                      {userData.jobsApplied}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {userData.thisWeekApplied} this week
                    </p>
                  </div>
                  <div className="bg-white shadow-md rounded-xl p-4 border border-indigo-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">Response Rate</p>
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                        Excellent
                      </span>
                    </div>
                    <p className="text-2xl font-bold mt-1">
                      {userData.responseRate}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Industry avg: 72%
                    </p>
                  </div>
                  <div className="bg-white shadow-md rounded-xl p-4 border border-indigo-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">Interview Rate</p>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        Above Avg
                      </span>
                    </div>
                    <p className="text-2xl font-bold mt-1">
                      {userData.interviewConversion}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Industry avg: 45%
                    </p>
                  </div>
                </div>

                {/* Resume Performance Card */}
                <div className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-indigo-50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Resume Performance
                    </h3>
                    <button className="text-sm text-indigo-600 flex items-center hover:text-indigo-800">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      Upload New
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-6">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            ATS Compatibility Score
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            {userData.atsScore}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`bg-green-600 h-2.5 rounded-full transition-all duration-1000 ease-out ${animateScore ? "w-5/6" : "w-0"}`}
                            style={{ width: `${userData.atsScore}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Poor</span>
                          <span>Excellent</span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            Resume Strength
                          </span>
                          <span className="text-sm font-medium text-blue-600">
                            {userData.resumeStrength}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out ${animateScore ? "w-4/5" : "w-0"}`}
                            style={{ width: `${userData.resumeStrength}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Weak</span>
                          <span>Strong</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "applications" && (
            <div className="bg-white shadow-lg rounded-xl p-6 border border-indigo-50">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Your Applications
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                        Company
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                        Position
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                        Salary
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                        Match
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                        Status
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                        Applied
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {userData.applications.map((application, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <img
                              src={application.logo}
                              alt={application.company}
                              className="w-8 h-8 mr-3 rounded-full"
                            />
                            <span className="font-medium text-gray-900">
                              {application.company}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {application.position}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {application.salary}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${application.matchScore}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-700">
                              {application.matchScore}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getStatusColor(application.status)}`}
                          >
                            {application.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {application.date}
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
