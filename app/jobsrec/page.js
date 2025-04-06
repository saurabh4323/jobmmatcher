"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [recruiterData, setRecruiterData] = useState(null);

  useEffect(() => {
    const fetchRecruiterData = async () => {
      try {
        const email = localStorage.getItem("recemail");
        if (!email) return;

        const response = await axios.get(`/api/rec/find/${email}`);
        setRecruiterData(response.data?.data?.[0] || null);
      } catch (error) {
        console.error("Error fetching recruiter data:", error);
      }
    };

    fetchRecruiterData();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        if (searchTerm) {
          const response = await axios.get(`/api/rec/job/${searchTerm}`);
          setJobs(response.data.data || []);
          console.log(
            `Found ${response.data.data.length} jobs for "${searchTerm}"`
          );
        } else if (recruiterData?.fullName) {
          const response = await axios.get(
            `/api/rec/job/${recruiterData.fullName}`
          );
          setJobs(response.data.data || []);
          console.log(
            `Found ${response.data.data.length} jobs for recruiter ${recruiterData.fullName}`
          );
        } else {
          console.log("Waiting for recruiter data...");
          setJobs([]);
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (recruiterData || searchTerm) {
      fetchJobs();
    }
  }, [recruiterData, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 py-6 px-4 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-blue-400">Job Board</h1>
          {recruiterData && (
            <p className="text-gray-300 mt-1">
              Welcome, {recruiterData.fullName}
            </p>
          )}

          <form onSubmit={handleSearch} className="mt-4 flex">
            <input
              type="text"
              placeholder="Search for jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-l-md bg-gray-700 border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-r-md font-medium transition-colors duration-200"
            >
              Search
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-4">
        {error && (
          <div className="bg-red-900 text-white p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-300">
              Found {jobs.length} job{jobs.length !== 1 ? "s" : ""}
              {searchTerm && ` for "${searchTerm}"`}
            </div>

            {jobs.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-700"
                  >
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-blue-400 mb-2">
                        {job.title || job.fullName}
                      </h2>
                      <p className="text-gray-400 mb-4">
                        {job.name || "Company not specified"}
                      </p>

                      {job.location && (
                        <div className="flex items-center mb-3 text-gray-300">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          {job.location}
                        </div>
                      )}

                      {job.salary && (
                        <div className="flex items-center mb-3 text-gray-300">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          {job.salary}
                        </div>
                      )}

                      {job.description && (
                        <p className="text-gray-400 mt-4 line-clamp-3">
                          {job.description}
                        </p>
                      )}
                    </div>

                    <div className="px-6 py-4 bg-gray-850 border-t border-gray-700">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <h3 className="text-xl font-medium mb-2">No jobs found</h3>
                <p className="text-gray-400">
                  Try changing your search criteria or check back later.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default JobListing;
