// pages/profile.js
"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import EditProfileModal from "@/components/EdirProfileModal";
import { Cross } from "lucide-react";
import axios from "axios";
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showNotification, setShowNotification] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [prdata, setprdata] = useState([]);

  useEffect(() => {
    fetchProfileData();
    const phone = localStorage.getItem("jobid");

    const response = axios.get(`/api/profile/${phone}`).then((res) => {
      setprdata(res.data.data);
      console.log(res.data.data);
    });
  }, []);
  console.log("dekh", prdata);

  const fetchProfileData = async () => {
    try {
      // Try to get from local storage first
      let retrievedData;
      if (typeof window !== "undefined") {
        retrievedData = localStorage.getItem("profiledata");
      }

      if (retrievedData) {
        setProfileData(JSON.parse(retrievedData));
      } else {
        // If not in local storage, fetch from API
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);

          // Save to local storage
          if (typeof window !== "undefined") {
            localStorage.setItem("profiledata", JSON.stringify(data));
          }
        } else {
          // If API fails, set default data
          setProfileData(null);
        }
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setProfileData(null);
    }
  };

  // Animation effects
  useEffect(() => {
    setTimeout(() => {
      setShowNotification(true);
    }, 1500);

    setTimeout(() => {
      setAnimateScore(true);
    }, 800);
  }, []);

  // Handle profile update
  const handleProfileUpdate = (updatedData) => {
    const newProfileData = { ...profileData, ...updatedData };
    setProfileData(newProfileData);

    // Update local storage
    if (typeof window !== "undefined") {
      localStorage.setItem("profiledata", JSON.stringify(newProfileData));
    }
  };

  // Mock user data - fallback if no profile data is available
  const userData = {
    name: prdata?.[0]?.full_name || "NO NAME",
    email: prdata?.[0]?.email || "saurabhiitr01@gmail.com",
    phone: prdata?.[0]?.phone || "+91 8810873052",
    gender: "male",
    headline: prdata?.[0]?.headline || "Senior Full Stack Developer",
    summary:
      "Passionate developer with 5+ years of experience in React, Node.js, and cloud technologies. Looking for remote opportunities in fintech or healthcare.",
    linkedIn: prdata?.[0]?.linkedIn || "linkedin.com/in/saurabh2708",
    github: prdata?.[0]?.github || "github.com/saurabh4323",
    photo: "https://robohash.org/123",
    openToWork:
      profileData?.openToWork !== undefined ? profileData.openToWork : true,
    preferredWork: profileData?.preferredWork || "Remote",
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
                <button
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center text-sm transition-colors shadow-md"
                  onClick={() => setIsEditModalOpen(true)}
                >
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
            {isEditModalOpen && (
              <div className=" absolute inset-0 z-50 flex items-center justify-center  bg-opacity-50">
                <Cross
                  color="red"
                  onClick={() => {
                    setIsEditModalOpen(false);
                  }}
                ></Cross>
                <EditProfileModal />
              </div>
            )}

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
                      {userData.openToWork && (
                        <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                          Open to Work
                        </span>
                      )}
                      <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                        {userData.preferredWork} Preferred
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
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Resume Performance
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">ATS Score</span>
                        <span className="text-sm font-medium text-indigo-600">
                          {userData.atsScore}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`bg-indigo-600 h-2.5 rounded-full transition-all duration-1000 ease-out ${
                            animateScore ? "" : "w-0"
                          }`}
                          style={{
                            width: animateScore
                              ? `${userData.atsScore}%`
                              : "0%",
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Your resume is well-optimized for applicant tracking
                        systems
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          Overall Strength
                        </span>
                        <span className="text-sm font-medium text-indigo-600">
                          {userData.resumeStrength}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`bg-indigo-600 h-2.5 rounded-full transition-all duration-1000 ease-out ${
                            animateScore ? "" : "w-0"
                          }`}
                          style={{
                            width: animateScore
                              ? `${userData.resumeStrength}%`
                              : "0%",
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Good balance of skills, experience, and achievements
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-indigo-50">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Professional Summary
                  </h2>
                  <p className="text-gray-700">{userData.summary}</p>
                </div>

                {/* Recent Applications */}
                <div className="bg-white shadow-lg rounded-xl p-6 border border-indigo-50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Recent Applications
                    </h2>
                    <button
                      onClick={() => setActiveTab("applications")}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      View all
                    </button>
                  </div>
                  <div className="space-y-4">
                    {userData.applications.slice(0, 2).map((app, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <img
                            src={app.logo}
                            alt={app.company}
                            className="w-10 h-10 rounded"
                          />
                        </div>
                        <div className="ml-4 flex-grow">
                          <h3 className="text-sm font-medium text-gray-900">
                            {app.position}
                          </h3>
                          <p className="text-xs text-gray-500">{app.company}</p>
                        </div>
                        <div className="ml-2 text-right">
                          <span
                            className={`inline-flex text-xs px-2 py-0.5 rounded-full ${getStatusColor(
                              app.status
                            )}`}
                          >
                            {app.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {app.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "applications" && (
            <div className="bg-white shadow-lg rounded-xl p-6 border border-indigo-50">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                All Applications
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Company
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Position
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Salary
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Match Score
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date Applied
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userData.applications.slice(0, 1).map((app, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={app.logo}
                                alt={app.company}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {app.company}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {app.position}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {app.salary}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900 mr-2">
                              {app.matchScore}%
                            </span>
                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-indigo-600 h-1.5 rounded-full"
                                style={{ width: `${app.matchScore}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              app.status
                            )}`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {app.date}
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
