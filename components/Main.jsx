import { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "../components/JobCard";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInterestedJobs, setShowInterestedJobs] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Retrieve skills from local storage
        const skills =
          JSON.parse(localStorage.getItem("profiledata"))?.skills || [];
        console.log("Profile Skills:", skills);

        const response = await axios.get("https://remoteok.com/api");
        const allJobs = response.data.slice(1, 107);

        // Improved filtering logic
        const filtered = allJobs.filter((job) => {
          const jobTags = job.tags || [];
          console.log(`Job Tags for ${job.position}:`, jobTags);

          // More lenient matching
          const matchingSkills = jobTags.filter((jobTag) =>
            skills.some(
              (userSkill) =>
                jobTag.toLowerCase().includes(userSkill.toLowerCase()) ||
                userSkill.toLowerCase().includes(jobTag.toLowerCase())
            )
          );

          console.log(`Matching Skills for ${job.position}:`, matchingSkills);
          return matchingSkills.length > 0;
        });

        setJobs(allJobs);
        setFilteredJobs(filtered);
        console.log("Total Filtered Jobs:", filtered.length);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleShowInterest = () => {
    setShowInterestedJobs(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Loader2
            className="mx-auto mb-4 animate-spin text-blue-500"
            size={48}
          />
          <p className="text-gray-400">Loading job listings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="container mx-auto mt-10">
        <div className="text-center mb-6">
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-lg"
            onClick={handleShowInterest}
          >
            Show My Interest
          </button>
        </div>

        {showInterestedJobs ? (
          <>
            {filteredJobs.length > 0 ? (
              <>
                <h2 className="text-2xl text-blue-300 mb-6 text-center">
                  {filteredJobs.length} Jobs Matching Your Skills
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500">
                <p className="text-xl mb-4">No matching jobs found.</p>
                <p className="text-gray-400">
                  Try updating your skills profile or broadening your search.
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {jobs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                No jobs available at the moment.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
