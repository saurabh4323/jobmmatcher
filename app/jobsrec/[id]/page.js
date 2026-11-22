"use client";

import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        const response = await axios.get(`/api/rec/job/id/${id}`);
        setJob(response.data);
      } catch (requestError) {
        console.error("Error fetching job details:", requestError);
        setError(
          requestError.response?.data?.error ||
            "Unable to load this job. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/jobsrec"
          className="inline-block mb-6 text-blue-400 hover:text-blue-300"
        >
          &larr; Back to jobs
        </Link>

        {loading && <p className="text-gray-400">Loading job details...</p>}

        {!loading && error && (
          <div className="bg-red-900/60 text-red-100 rounded-lg p-5">
            {error}
          </div>
        )}

        {!loading && !error && job && (
          <article className="bg-gray-800 border border-gray-700 rounded-xl p-8">
            <h1 className="text-3xl font-bold text-blue-400">{job.title}</h1>
            <p className="mt-2 text-xl text-gray-300">{job.name}</p>

            <div className="mt-6 grid gap-3 text-gray-300">
              {job.location && <p><strong>Location:</strong> {job.location}</p>}
              {job.jobType && <p><strong>Job type:</strong> {job.jobType}</p>}
              {job.experience && (
                <p><strong>Experience:</strong> {job.experience}</p>
              )}
              {job.salary && <p><strong>Salary:</strong> {job.salary}</p>}
              {job.applicationDeadline && (
                <p>
                  <strong>Application deadline:</strong>{" "}
                  {new Date(job.applicationDeadline).toLocaleDateString()}
                </p>
              )}
            </div>

            {job.description && (
              <section className="mt-8">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="whitespace-pre-wrap text-gray-300">
                  {job.description}
                </p>
              </section>
            )}

            {job.skills?.length > 0 && (
              <section className="mt-8">
                <h2 className="text-xl font-semibold mb-3">Required skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-blue-500/15 px-3 py-1 text-sm text-blue-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </article>
        )}
      </div>
    </main>
  );
}
