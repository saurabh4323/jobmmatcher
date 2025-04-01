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
  Pencil,
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
    skills = [],
    experiences = [],
    education = [],
    city = "",
    country = "",
    profile_pic_url = "/api/placeholder/200/200",
  } = profileData || {};

  const formatDate = (dateObj) => {
    if (!dateObj) return "Present";
    const { month, year } = dateObj;
    return `${month || ""} ${year || "Present"}`.trim();
  };

  const renderSkills = () => {
    if (!skills || skills.length === 0) return null;
    return (
      <div className=" p-4 rounded-lg">
        <h2
          className="text-xl font-semibold mb-3 flex items-center"
          style={{ color: "white" }}
        >
          <Code className="mr-2 text-blue-600" /> Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 20).map((skill, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderExperiences = () => {
    if (!experiences || experiences.length === 0) return null;
    return (
      <div className="space-y-4">
        <h2
          className="text-xl font-semibold mb-3 flex items-center border-b pb-2"
          style={{ color: "black" }}
        >
          <Briefcase className="mr-2 text-blue-600" /> Professional Experience
        </h2>
        {experiences.slice(0, 2).map((exp, index) => {
          const expId = exp.id || `${exp.company}-${exp.title}`;
          return (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg" style={{ color: "black" }}>
                {exp.title || "Job Title"}
              </h3>
              <p className="text-gray-600 mb-2">
                {exp.company || "Company Name"} | {formatDate(exp.starts_at)} -{" "}
                {formatDate(exp.ends_at)}
              </p>
              <p className="text-gray-700">
                {experienceDescriptions[expId] || "Loading description..."}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  const renderEducation = () => {
    if (!education || education.length === 0) return null;
    return (
      <div className="space-y-4">
        <h2
          className="text-xl font-semibold mb-3 flex items-center border-b pb-2"
          style={{ color: "black" }}
        >
          <GraduationCap className="mr-2 text-blue-600" /> Education
        </h2>
        {education.map((edu, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-sm"
            style={{ color: "black" }}
          >
            <h3 className="font-bold text-lg">
              {edu.degree_name || "Degree"} in{" "}
              {edu.field_of_study || "Field of Study"}
            </h3>
            <p className="text-gray-600">{edu.school || "Institution Name"}</p>
            <p className="text-sm text-gray-500">
              {formatDate(edu.starts_at)} - {formatDate(edu.ends_at)}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className="max-w-4xl mx-auto bg-white shadow-lg  overflow-hidden"
      style={{ border: "0.6px solid rgb(255,255,255,0.4)", marginTop: "1px" }}
    >
      <div
        className="bg-gradient-to-r  text-white p-6"
        style={{ marginTop: "100px", backgroundColor: "#1c1d31" }}
      >
        <div className="flex items-center">
          <img
            src={profile_pic_url}
            alt={full_name}
            className="w-24 h-24 rounded-full object-cover mr-6 border-4 border-white"
          />
          <div>
            <h1 className="text-3xl font-bold">{profileData.full_name}</h1>
            <p>{profileData.headline}</p>
            <div className="flex items-center mt-2 space-x-4">
              {city && country && (
                <div className="flex items-center">
                  <MapPin className="mr-2 w-5 h-5" />
                  <span>
                    {city}, {country}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 ">
        <div className="md:col-span-1 " style={{ backgroundColor: "#1c1d31" }}>
          {renderSkills()}
        </div>

        <div className="md:col-span-2 space-y-6">
          <div>
            <h2
              className="text-xl font-semibold mb-3 flex items-center border-b pb-2"
              style={{ color: "black" }}
            >
              <Star className="mr-2 text-blue-600" /> Professional Summary{" "}
              <Pencil
                onClick={() => {
                  setEditedSummary(summaryText || summary);
                  setIsEditingSummary(true);
                }}
                size={16}
                strokeWidth={1}
                style={{ marginLeft: "50px", cursor: "pointer" }}
              />
            </h2>

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
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700">{summaryText || summary}</p>
            )}
          </div>
          {renderEducation()}
          {renderExperiences()}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalResumeTemplate;
