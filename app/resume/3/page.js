"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Mail,
  Linkedin,
  Star,
  Award,
  Heart,
  Code,
  BookOpen,
  Globe,
  Cpu,
  Film,
  Calendar,
} from "lucide-react";

const ModernResumeTemplate = () => {
  const [profileData, setProfileData] = useState({});
  const [summaryText, setSummaryText] = useState("");
  const [experienceDescriptions, setExperienceDescriptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [dataAvailable, setDataAvailable] = useState(true);

  useEffect(() => {
    const storedProfileData = localStorage.getItem("profiledata");

    if (storedProfileData) {
      try {
        const parsedData = JSON.parse(storedProfileData);
        setProfileData(parsedData);
        setDataAvailable(true);
      } catch (error) {
        console.error("Error parsing profile data:", error);
        setDataAvailable(false);
      }
    } else {
      setDataAvailable(false);
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
    } catch (error) {
      console.error("Error fetching summary:", error);
      setSummaryText(summaryText || "No summary available");
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

        descriptions[exp.id || ` ${exp.company}-${exp.title}`] =
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
    achievements = [],
    certifications = [],
    passions = [],
    languages = [],
    contact = {
      email: "example@email.com",
      linkedin: "linkedin.com/in/username",
      location: "City, Country",
    },
    city = "",
    country = "",
    profile_pic_url = "/api/placeholder/200/200",
  } = profileData || {};

  const formatDate = (dateObj) => {
    if (!dateObj) return "Present";
    const { month, year } = dateObj;
    return `${month || ""} / ${year || "Present"}`.trim();
  };

  const renderSkills = () => {
    if (!skills || skills.length === 0)
      return (
        <div className="p-4 space-y-3">
          <h2 className="text-xl font-bold text-white mb-4">SKILLS</h2>
          <p className="text-gray-300 text-sm">No skills available</p>
        </div>
      );

    return (
      <div className="p-4 space-y-3">
        <h2 className="text-xl font-bold text-white mb-4">SKILLS</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span key={index} className="text-white text-sm">
              {skill}
              {index < skills.length - 1 ? " • " : ""}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderAchievements = () => {
    if (!achievements || achievements.length === 0)
      return (
        <div className="p-4 space-y-3">
          <h2 className="text-xl font-bold text-white mb-4">ACHIEVEMENTS</h2>
          <p className="text-gray-300 text-sm">No achievements available</p>
        </div>
      );

    return (
      <div className="p-4 space-y-3">
        <h2 className="text-xl font-bold text-white mb-4">ACHIEVEMENTS</h2>
        {achievements.map((achievement, index) => (
          <div key={index} className="mb-3">
            <div className="flex items-start">
              {index === 0 && (
                <MapPin className="w-5 h-5 text-white mr-2 mt-1" />
              )}
              {index === 1 && (
                <Award className="w-5 h-5 text-white mr-2 mt-1" />
              )}
              {index === 2 && (
                <Heart className="w-5 h-5 text-white mr-2 mt-1" />
              )}
              {index === 3 && <Star className="w-5 h-5 text-white mr-2 mt-1" />}
              <div>
                <h3 className="font-semibold text-white">
                  {achievement.title}
                </h3>
                <p className="text-gray-300 text-sm">
                  {achievement.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCertifications = () => {
    if (!certifications || certifications.length === 0)
      return (
        <div className="p-4 space-y-3">
          <h2 className="text-xl font-bold text-white mb-4">CERTIFICATION</h2>
          <p className="text-gray-300 text-sm">No certifications available</p>
        </div>
      );

    return (
      <div className="p-4 space-y-3">
        <h2 className="text-xl font-bold text-white mb-4">CERTIFICATION</h2>
        {certifications.map((cert, index) => (
          <div key={index} className="mb-3">
            <h3 className="font-semibold text-white">{cert.name}</h3>
            <p className="text-gray-300 text-sm">{cert.description}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderPassions = () => {
    if (!passions || passions.length === 0)
      return (
        <div className="p-4 space-y-3">
          <h2 className="text-xl font-bold text-white mb-4">PASSIONS</h2>
          <p className="text-gray-300 text-sm">No passions available</p>
        </div>
      );

    return (
      <div className="p-4 space-y-3">
        <h2 className="text-xl font-bold text-white mb-4">PASSIONS</h2>
        {passions.map((passion, index) => (
          <div key={index} className="mb-3">
            <div className="flex items-start">
              {index === 0 && (
                <Globe className="w-5 h-5 text-white mr-2 mt-1" />
              )}
              {index === 1 && <Film className="w-5 h-5 text-white mr-2 mt-1" />}
              <div>
                <h3 className="font-semibold text-white">{passion.title}</h3>
                <p className="text-gray-300 text-sm">{passion.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderExperiences = () => {
    if (!experiences || experiences.length === 0)
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold border-b border-gray-200 pb-2">
            EXPERIENCE
          </h2>
          <p className="text-gray-600">No experience data available</p>
        </div>
      );

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold border-b border-gray-200 pb-2">
          EXPERIENCE
        </h2>
        {experiences.map((exp, index) => {
          const expId = exp.id || `${exp.company}-${exp.title}`;
          return (
            <div key={index} className="mb-5">
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">{exp.title}</h3>
                <span className="text-gray-600">
                  {formatDate(exp.starts_at)} - {formatDate(exp.ends_at)}
                </span>
              </div>
              <div className="flex justify-between">
                <p className="text-green-500 font-medium">{exp.company}</p>
                <p className="text-gray-600">{exp.location}</p>
              </div>
              {exp.bullet_points ? (
                <ul className="list-disc pl-5 mt-2 text-gray-700 space-y-1">
                  {exp.bullet_points.map((point, pointIndex) => (
                    <li key={pointIndex}>{point}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-gray-700">
                  {experienceDescriptions[expId] || "Loading description..."}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderEducation = () => {
    if (!education || education.length === 0)
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b border-gray-200 pb-2">
            EDUCATION
          </h2>
          <p className="text-gray-600">No education data available</p>
        </div>
      );

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b border-gray-200 pb-2">
          EDUCATION
        </h2>
        {education.map((edu, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-semibold">
                {edu.degree_name} in {edu.field_of_study}
              </h3>
              <span className="text-gray-600">
                {formatDate(edu.starts_at)} - {formatDate(edu.ends_at)}
              </span>
            </div>
            <div className="flex justify-between">
              <p className="text-green-500 font-medium">{edu.school}</p>
              <p className="text-gray-600">{edu.location}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderLanguages = () => {
    if (!languages || languages.length === 0)
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b border-gray-200 pb-2">
            LANGUAGES
          </h2>
          <p className="text-gray-600">No language data available</p>
        </div>
      );

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b border-gray-200 pb-2">
          LANGUAGES
        </h2>
        <div className="flex flex-col space-y-3">
          {languages.map((lang, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="font-medium">{lang.name}</span>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full ${
                      i < lang.level ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                ))}
              </div>
              <span className="text-gray-600 text-sm">{lang.proficiency}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderNoDataMessage = () => {
    return (
      <div className="w-full p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Name Not Available</h2>
        <p className="text-gray-600 mb-6">No summary provided.</p>
        <p className="text-gray-500">
          Please provide your LinkedIn URL or resume data to generate your
          resume.
        </p>
      </div>
    );
  };

  if (!dataAvailable && !isLoading) {
    return (
      <div className="max-w-6xl mx-auto bg-white shadow-lg">
        {renderNoDataMessage()}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg">
      {/* Header Section */}
      <div className="p-8 flex flex-col">
        <h1 className="text-4xl font-bold tracking-tight">{full_name}</h1>
        <p className="text-green-500 mt-1">{headline}</p>

        <div className="flex items-center mt-3 space-x-6 text-gray-600">
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-1" />
            <span>{contact?.email || "example@email.com"}</span>
          </div>
          <div className="flex items-center">
            <Linkedin className="w-4 h-4 mr-1" />
            <span>{contact?.linkedin || "linkedin.com/in/username"}</span>
          </div>
          {(city || country) && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>
                {[city, country].filter(Boolean).join(", ") ||
                  contact?.location}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row">
        {/* Left Column (White Background) */}
        <div className="md:w-8/12 p-8 space-y-8">
          {/* Summary Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold border-b border-gray-200 pb-2">
              SUMMARY
            </h2>
            <p className="mt-3 text-gray-700">{summaryText || summary}</p>
          </div>

          {/* Experience Section */}
          {renderExperiences()}

          {/* Education Section */}
          {renderEducation()}

          {/* Languages Section */}
          {renderLanguages()}

          {/* Powered by Section */}
          <div className="mt-8 flex justify-between items-center text-gray-500">
            <div className="flex items-center">
              <span className="mr-2">Powered by</span>
              <span className="font-medium">Enhancv</span>
            </div>
            <span>www.enhancv.com</span>
          </div>
        </div>

        {/* Right Column (Teal Background) */}
        <div className="md:w-4/12 bg-teal-700 text-white">
          {/* Profile Image */}
          <div className="flex justify-center py-6">
            <img
              src={profile_pic_url}
              alt={full_name}
              className="w-40 h-40 rounded-md object-cover border-4 border-white"
            />
          </div>

          {/* Achievements Section */}
          {renderAchievements()}

          {/* Skills Section */}
          {renderSkills()}

          {/* Certifications Section */}
          {renderCertifications()}

          {/* Passions Section */}
          {renderPassions()}
        </div>
      </div>
    </div>
  );
};

export default ModernResumeTemplate;
