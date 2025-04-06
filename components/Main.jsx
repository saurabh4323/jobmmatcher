import { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "../components/JobCard";
import {
  Loader2,
  Briefcase,
  FileBadge,
  Filter,
  Bell,
  Check,
} from "lucide-react";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [ourJobs, setOurJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInterestedJobs, setShowInterestedJobs] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // "all", "matched", "ourJobs"
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // Load applied jobs from localStorage on initial render
  useEffect(() => {
    const savedAppliedJobs = localStorage.getItem("appliedJobs");
    if (savedAppliedJobs) {
      setAppliedJobs(JSON.parse(savedAppliedJobs));
    }
  }, []);

  // Fetch both job sources immediately when component mounts
  useEffect(() => {
    const fetchAllJobData = async () => {
      try {
        setLoading(true);

        // First fetch our own jobs
        try {
          const ourJobsResponse = await axios.get("/api/rec/job");
          console.log("Our Jobs Response:", ourJobsResponse.data);
          setOurJobs(ourJobsResponse.data);
          // alert("our jobs fetched successfully");
          console.log("Our Jobs:", ourJobsResponse.data);
        } catch (err) {
          console.error("Error fetching our jobs:", err);
          // Continue with remote jobs even if our jobs fail
        }

        // Then fetch remote jobs
        try {
          // Retrieve skills from local storage
          const skills =
            JSON.parse(localStorage.getItem("profiledata"))?.skills || [];
          console.log("Profile Skills:", skills);

          const remoteResponse = await axios.get("https://remoteok.com/api");
          const allJobs = remoteResponse.data.slice(1, 107);

          // Improved filtering logic
          const filtered = allJobs.filter((job) => {
            const jobTags = job.tags || [];

            // More lenient matching
            const matchingSkills = jobTags.filter((jobTag) =>
              skills.some(
                (userSkill) =>
                  jobTag.toLowerCase().includes(userSkill.toLowerCase()) ||
                  userSkill.toLowerCase().includes(jobTag.toLowerCase())
              )
            );

            return matchingSkills.length > 0;
          });

          setJobs(allJobs);
          setFilteredJobs(filtered);
        } catch (err) {
          console.error("Error fetching remote jobs:", err);
          setError("Failed to load remote jobs. Please try again later.");
        }
      } catch (error) {
        console.error("Error in job fetching process:", error);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllJobData();
  }, []);

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  // Update localStorage whenever appliedJobs changes
  useEffect(() => {
    localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));
  }, [appliedJobs]);

  // Function to handle applying for a job
  const handleApply = (jobId) => {
    if (!appliedJobs.includes(jobId)) {
      setAppliedJobs([...appliedJobs, jobId]);
      showNotificationAlert(`Application submitted successfully!`);
    }
  };

  // Function to handle applying for all jobs at once
  const applyToAllJobs = () => {
    const allJobIds = ourJobs.map((job) => job._id);
    setAppliedJobs(allJobIds);
    showNotificationAlert(
      `Applied to all ${ourJobs.length} jobs successfully!`
    );
  };

  // Function to show notification
  const showNotificationAlert = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Loader2
            className="mx-auto mb-4 animate-spin text-blue-500"
            size={48}
          />
          <p className="text-gray-400">Loading job opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center bg-gray-800 p-6 rounded-lg max-w-md">
          <div className="text-red-400 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 py-12 px-4"
      style={{ marginTop: "80px" }}
    >
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-24 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center z-50 max-w-xs">
          <Check className="mr-2 h-5 w-5" />
          <span>{notificationMessage}</span>
        </div>
      )}

      <div className="container mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Job Explorer</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover remote opportunities that match your skills and experience
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-10">
          <div className="bg-gray-800 p-1 rounded-lg flex">
            <button
              className={`px-6 py-3 rounded-md flex items-center transition ${
                activeTab === "all"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
              onClick={() => switchTab("all")}
            >
              <Briefcase className="mr-2 h-5 w-5" />
              All Jobs
              <span className="ml-2 bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                {jobs.length}
              </span>
            </button>

            <button
              className={`px-6 py-3 rounded-md flex items-center transition ${
                activeTab === "matched"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
              onClick={() => switchTab("matched")}
            >
              <Filter className="mr-2 h-5 w-5" />
              Matching Skills
              <span className="ml-2 bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                {filteredJobs.length}
              </span>
            </button>

            <button
              className={`px-6 py-3 rounded-md flex items-center transition ${
                activeTab === "ourJobs"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
              onClick={() => switchTab("ourJobs")}
            >
              <FileBadge className="mr-2 h-5 w-5" />
              Our Listings
              <span className="ml-2 bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                {ourJobs.length}
              </span>
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-8">
          {activeTab === "all" && (
            <>
              <h2 className="text-2xl font-semibold text-white mb-6">
                Browse All Remote Jobs
              </h2>
              {jobs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  No remote jobs available at the moment.
                </div>
              )}
            </>
          )}

          {activeTab === "matched" && (
            <>
              <h2 className="text-2xl font-semibold text-white mb-6">
                Jobs Matching Your Skills{" "}
                <span className="text-blue-400">({filteredJobs.length})</span>
              </h2>
              {filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-xl mb-4 text-gray-300">
                    No matching jobs found.
                  </p>
                  <p className="text-gray-400">
                    Try updating your skills profile or broadening your search
                    criteria.
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === "ourJobs" && (
            <div className="our-jobs-container p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  Our Job Listings ({ourJobs.length})
                </h2>

                <button
                  onClick={applyToAllJobs}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
                >
                  <Check className="mr-2 h-5 w-5" />
                  Apply to All Jobs
                </button>
              </div>

              {ourJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ourJobs.map((job, index) => (
                    <div
                      key={index}
                      className="job-card border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow bg-gray-800 text-gray-200"
                    >
                      <h3 className="text-lg font-semibold text-blue-400 truncate">
                        {job.title}
                      </h3>

                      <div className="job-details mt-2 space-y-1 text-sm">
                        <div className="flex items-center">
                          <span className="font-medium w-24 text-gray-400">
                            Company:
                          </span>{" "}
                          {job.name}
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-24 text-gray-400">
                            Location:
                          </span>{" "}
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-24 text-gray-400">
                            Experience:
                          </span>{" "}
                          {job.experience}
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-24 text-gray-400">
                            Type:
                          </span>{" "}
                          {job.jobType}
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-24 text-gray-400">
                            Salary:
                          </span>{" "}
                          ₹{job.salary}
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium w-24 text-gray-400">
                            Deadline:
                          </span>{" "}
                          {new Date(
                            job.applicationDeadline
                          ).toLocaleDateString()}
                        </div>
                      </div>

                      <p className="job-description mt-3 mb-3 text-gray-400 line-clamp-2 h-12">
                        {job.description}
                      </p>

                      <button
                        onClick={() => handleApply(job._id)}
                        className={`w-full mt-2 px-4 py-2 rounded transition-colors flex items-center justify-center ${
                          appliedJobs.includes(job._id)
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        {appliedJobs.includes(job._id) ? (
                          <>
                            <Check className="mr-2 h-5 w-5" />
                            Applied
                          </>
                        ) : (
                          "Apply Now"
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state p-8 text-center text-gray-500">
                  No internal job listings available at the moment.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
