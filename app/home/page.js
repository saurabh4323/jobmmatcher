// pages/recruiter/dashboard.js
"use client";
import React, { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useState } from "react";
export default function RecruiterDashboard() {
  const [data, setData] = useState([]);
  const [length, setLength] = useState([]);
  let len = 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = localStorage.getItem("recemail");
        const response = await axios.get(`/api/rec/find/${email}`);
        setData(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching recruiter data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const leng = async () => {
      if (!data[0]?.fullName) return;

      try {
        const response = await axios.get(`/api/rec/job/${data[0].fullName}`);
        setLength(response.data.data.length);
        console.log(response.data.data.length);
        // alert(response.data.data.length);
      } catch (err) {
        console.error("Error fetching length:", err);
      }
    };

    leng();
  }, [data]); // ✅ this runs ONLY when `data` updates

  const company = {
    name: data[0]?.fullName || "null",
    logo: "https://robohash.org/123",
    industry: "Technology",
    joinedDate: "April 2025",
    completionPercentage: 70,
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Head>
        <title>Skillo | Recruiter Dashboard</title>
        <meta
          name="description"
          content="Recruiter dashboard for posting jobs and finding talent"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="bg-gray-800 shadow rounded-lg mb-8 border border-gray-700">
            <div className="px-6 py-8 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-6 md:mb-0">
                <div className="mr-6 flex-shrink-0">
                  <div className="relative h-20 w-20 rounded overflow-hidden bg-gray-700 flex items-center justify-center">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={`${company.name} logo`}
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    ) : (
                      <div className="text-3xl font-bold text-gray-400">
                        {company.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Welcome, {company.name}!
                  </h2>
                  <p className="text-gray-400">
                    Member since {company.joinedDate}
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center md:space-x-4">
                <Link
                  href="/createJob"
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md flex items-center justify-center transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Create New Job
                </Link>
              </div>
            </div>
          </div>

          {/* Profile Completion */}
          <div className="bg-gray-800 shadow rounded-lg mb-8 border border-gray-700">
            <div className="px-6 py-5 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">
                Complete Your Profile
              </h3>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-center mb-4">
                <div className="flex-1 mr-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-300">
                      {company.completionPercentage}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${company.completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <Link
                  href="/recruiter/company/edit"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  Complete Now
                </Link>
              </div>
              <p className="text-sm text-gray-400">
                Complete your company profile to attract the best candidates.
              </p>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-700">
              <div className="px-6 py-5 border-b border-gray-700">
                <h3 className="text-lg font-medium text-white">Active Jobs</h3>
              </div>
              <div className="px-6 py-5 flex justify-between items-center">
                <div className="text-3xl font-bold text-white">{length}</div>
                <Link
                  href="/recruiter/jobs"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
            </div>

            <div className="bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-700">
              <div className="px-6 py-5 border-b border-gray-700">
                <h3 className="text-lg font-medium text-white">
                  New Applications
                </h3>
              </div>
              <div className="px-6 py-5 flex justify-between items-center">
                <div className="text-3xl font-bold text-white">0</div>
                <Link
                  href="/recruiter/applications"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
            </div>

            <div className="bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-700">
              <div className="px-6 py-5 border-b border-gray-700">
                <h3 className="text-lg font-medium text-white">Talent Pool</h3>
              </div>
              <div className="px-6 py-5 flex justify-between items-center">
                <div className="text-3xl font-bold text-white">0</div>
                <Link
                  href="/recruiter/talent-pool"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  Browse Talent
                </Link>
              </div>
            </div>
          </div>

          {/* Getting Started Guide */}
          <div className="bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-700">
            <div className="px-6 py-5 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">
                Getting Started
              </h3>
            </div>
            <div className="px-6 py-5">
              <ul className="space-y-6">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-900 text-blue-300">
                      1
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-white">
                      Complete your company profile
                    </h4>
                    <p className="mt-1 text-sm text-gray-400">
                      Add your company details, logo, and description to help
                      candidates learn about your organization.
                    </p>
                    <Link
                      href="/recruiter/company/edit"
                      className="mt-2 inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300"
                    >
                      Complete Profile
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-900 text-blue-300">
                      2
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-white">
                      Post your first job
                    </h4>
                    <p className="mt-1 text-sm text-gray-400">
                      Create a detailed job posting to attract qualified
                      candidates for your open positions.
                    </p>
                    <Link
                      href="/recruiter/jobs/create"
                      className="mt-2 inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300"
                    >
                      Create Job
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-900 text-blue-300">
                      3
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-white">
                      Browse talent
                    </h4>
                    <p className="mt-1 text-sm text-gray-400">
                      Search our talent pool for candidates that match your
                      requirements and invite them to apply.
                    </p>
                    <Link
                      href="/recruiter/talent-pool"
                      className="mt-2 inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300"
                    >
                      Browse Talent
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
