"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Code,
  Star,
  ExternalLink,
  Pencil,
  GitHub,
} from "lucide-react";

const ProfessionalResumeTemplate = () => {
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [summaryText, setSummaryText] = useState("");
  const [experienceDescriptions, setExperienceDescriptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [editedSummary, setEditedSummary] = useState("");

  useEffect(() => {
    const storedProfileData = localStorage.getItem("profiledata");

    if (storedProfileData) {
      try {
        const parsedData = JSON.parse(storedProfileData);
        setProfileData(parsedData);
      } catch (error) {
        console.error("Error parsing profile data:", error);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (profileData?.summary) {
      processSummary(profileData.summary);
    }

    if (profileData?.experiences && profileData.experiences.length > 0) {
      processExperienceDescriptions();
    }
  }, [profileData]);

  const processSummary = async (summaryText) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/gemini", {
        prompt: `Give me in response just a summary of this summary in a good way in 2-3 lines and don't write anything else other than the summary. ${summaryText}`,
      });

      const summarizedText =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No summary available";

      setSummaryText(summarizedText.trim());
      alert("Summary is ready");
    } catch (error) {
      console.error("Error fetching summary:", error);
      alert("Failed to fetch summary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const processExperienceDescriptions = async () => {
    try {
      setIsLoading(true);
      const descriptions = {};

      for (const exp of profileData.experiences) {
        const jobInfo = `${exp.title} at ${exp.company}`;
        const response = await axios.post("/api/gemini", {
          prompt: `Give me in response just a description of this experience in a good way in 3-4 lines and don't write anything else other than the description and give in form of paragraph. Job title: ${exp.title}, Company: ${exp.company}`,
        });

        const processedDescription =
          response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No description available";

        descriptions[exp.id || `${exp.company}-${exp.title}`] =
          processedDescription.trim();
      }

      setExperienceDescriptions(descriptions);
    } catch (error) {
      console.error("Error processing experience descriptions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const {
    full_name = "Name Not Available",
    headline = "Professional Headline",
    summary = "No summary provided.",
    email = "Saurabhiitr01@gmail.com",
    linkedin_url = "",
    github_url = "",
    portfolio_url = "",
    skills = [],
    experiences = [],
    education = [],
    projects = [],
    city = "",
    country = "",
  } = profileData || {};

  const formatDate = (dateObj) => {
    if (!dateObj) return "Present";
    const { month, year } = dateObj;
    return `${month || ""} ${year || "Present"}`.trim();
  };

  const renderSummary = () => {
    return (
      <div className="mb-6">
        <div className="flex items-center">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3 flex-grow text-gray-800">
            Summary
          </h2>
          <Pencil
            onClick={() => {
              setEditedSummary(summaryText || summary);
              setIsEditingSummary(true);
            }}
            size={16}
            strokeWidth={1}
            className="text-gray-600"
            style={{ cursor: "pointer" }}
          />
        </div>

        {isEditingSummary ? (
          <div className="mb-4">
            <textarea
              value={editedSummary}
              onChange={(e) => setEditedSummary(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-gray-700 min-h-20"
              rows={4}
            />
            <div className="flex justify-end mt-2 space-x-2">
              <button
                onClick={() => {
                  setIsEditingSummary(false);
                  setEditedSummary("");
                }}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSummaryText(editedSummary);
                  setIsEditingSummary(false);
                }}
                className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700">{summaryText || summary}</p>
        )}
      </div>
    );
  };

  const renderEducation = () => {
    if (!education || education.length === 0) return null;
    return (
      <div className="mb-6">
        <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3 text-gray-800">
          Education
        </h2>
        {education.map((edu, index) => (
          <div key={index} className="mb-3">
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold text-gray-800">
                  {edu.school || "Institution Name"}
                </h3>
                <p className="text-gray-700">
                  {edu.degree_name || "Degree"}{" "}
                  {edu.field_of_study && `in ${edu.field_of_study}`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-700">{edu.location || ""}</p>
                <p className="text-gray-600">
                  {formatDate(edu.starts_at)} - {formatDate(edu.ends_at)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderExperiences = () => {
    if (!experiences || experiences.length === 0) return null;
    return (
      <div className="mb-6">
        <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3 text-gray-800">
          Experience
        </h2>
        {experiences.slice(0, 2).map((exp, index) => {
          const expId = exp.id || `${exp.company}-${exp.title}`;
          return (
            <div key={index} className="mb-4">
              <div className="flex justify-between">
                <h3 className="font-bold text-gray-800">
                  {exp.company || "Company Name"} | {exp.title || "Job Title"}
                </h3>
                <p className="text-gray-600 text-right">
                  {exp.location ? `${exp.location} | ` : ""}
                  {formatDate(exp.starts_at)} - {formatDate(exp.ends_at)}
                </p>
              </div>
              <p className="text-gray-700 mt-1">
                {experienceDescriptions[expId] || "Loading description..."}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSkills = () => {
    if (!skills || skills.length === 0) return null;

    // Group skills by category if available
    const skillsByCategory = {};
    const flatSkills = skills.map((skill) =>
      typeof skill === "string" ? skill : skill.name
    );

    const categories = [
      "Programming Languages",
      "Libraries / Frameworks",
      "Tools / Platform",
      "Databases",
    ];

    // Create evenly distributed skill groups
    const chunkSize = Math.ceil(flatSkills.length / categories.length);
    categories.forEach((category, index) => {
      const start = index * chunkSize;
      const end = Math.min(start + chunkSize, flatSkills.length);
      skillsByCategory[category] = flatSkills.slice(start, end);
    });

    return (
      <div className="mb-6">
        <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3 text-gray-800">
          Skills
        </h2>
        {Object.entries(skillsByCategory).map(([category, skillList]) => (
          <div key={category} className="mb-2">
            <p className="font-bold text-gray-800">{category}:</p>
            <p className="text-gray-700">{skillList.join(", ")}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderProjects = () => {
    if (!profileData.projects || profileData.projects.length === 0) return null;
    return (
      <div className="mb-6">
        <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3 text-gray-800">
          Projects / Open-source
        </h2>
        {profileData.projects.map((project, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-bold text-gray-800">
                {project.name || "Project Name"}{" "}
                {project.link && (
                  <span>
                    |{" "}
                    <a
                      href={project.link}
                      className="text-gray-600 hover:underline"
                    >
                      Link
                    </a>
                  </span>
                )}
              </h3>
              <p className="text-gray-600 text-right">
                {project.technologies && project.technologies.join(", ")}
              </p>
            </div>
            <ul className="list-disc pl-5 mt-2">
              {project.description ? (
                typeof project.description === "string" ? (
                  project.description.split("\n").map((point, i) => (
                    <li key={i} className="mt-1 text-gray-700">
                      {point}
                    </li>
                  ))
                ) : (
                  <li className="mt-1 text-gray-700">{project.description}</li>
                )
              ) : (
                <li className="mt-1 text-gray-700">
                  Project details will appear here.
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className="max-w-4xl mx-auto bg-white p-8 shadow-sm"
      style={{ marginTop: "100px" }}
    >
      {/* Header Section */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wide mb-2 text-gray-900">
          {full_name}
        </h1>
        <p className="text-sm mb-2 text-gray-700">
          {email} | {profileData.city} {profileData.state}
        </p>
        <div className="flex justify-center space-x-4">
          {linkedin_url && (
            <a
              href={linkedin_url}
              className="text-sm text-gray-600 hover:underline"
            >
              Linkedin
            </a>
          )}
          {github_url && (
            <a
              href={github_url}
              className="text-sm text-gray-600 hover:underline"
            >
              GitHub
            </a>
          )}
          {portfolio_url && (
            <a
              href={portfolio_url}
              className="text-sm text-gray-600 hover:underline"
            >
              Portfolio
            </a>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {renderSummary()}
        {renderSkills()}
        {renderEducation()}
        {renderExperiences()}

        {renderProjects()}
      </div>
    </div>
  );
};

export default ProfessionalResumeTemplate;
