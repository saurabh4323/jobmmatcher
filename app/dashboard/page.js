"use client";
import React, { useEffect, useState } from "react";
import {
  Briefcase,
  GraduationCap,
  Award,
  Code,
  User,
  Rocket,
  Bell,
  ChevronRight,
  MapPin,
  Link,
  Building,
  Calendar,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  const [profileData, setProfileData] = useState([]);
  const [openSections, setOpenSections] = useState({
    experience: true,
    education: true,
    skills: true,
    certifications: true,
  });

  useEffect(() => {
    let retrive;
    if (window !== undefined) {
      retrive = localStorage.getItem("profiledata");
    }
    if (retrive) {
      setProfileData(JSON.parse(retrive));
    } else {
      setProfileData(null);
    }
  }, []);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatDate = (dateObj) => {
    if (!dateObj) return "";
    if (typeof dateObj === "string") return dateObj;

    const { month, year } = dateObj;
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return `${monthNames[month - 1]} ${year}`;
  };

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-400">
        No profile data available
      </div>
    );
  }

  return (
    <>
      {" "}
      <Navbar></Navbar>
      <div className="min-h-screen bg-gray-950 text-gray-100 pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <img
                  src={
                    profileData?.profile_pic_url ||
                    "https://tse2.mm.bing.net/th?id=OIP.7cRYFyLoDEDh4sRtM73vvwHaDg&pid=Api&P=0&h=180"
                  }
                  alt={profileData?.full_name || "Profile Picture"}
                  className="w-24 h-24 rounded-full border-4 border-blue-500/20"
                />
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-900"></div>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {profileData?.full_name || "No Name"}
                </h1>
                <p className="text-xl text-gray-400 mb-4">
                  {profileData?.headline || "No Headline"}
                </p>
                <div className="flex flex-wrap gap-4">
                  {(profileData?.city || profileData?.country) && (
                    <div className="flex items-center text-gray-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      {[profileData?.city, profileData?.country]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  )}
                  {profileData?.connections && (
                    <div className="flex items-center text-gray-400">
                      <User className="w-4 h-4 mr-2" />
                      {profileData.connections} connections
                    </div>
                  )}
                  {profileData?.company && (
                    <div className="flex items-center text-gray-400">
                      <Building className="w-4 h-4 mr-2" />
                      {profileData.company}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Experience Card */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection("experience")}
              className="w-full p-6 flex justify-between items-center hover:bg-gray-800/30 transition-colors"
            >
              <h2 className="flex items-center space-x-2 text-xl font-semibold">
                <Briefcase className="h-6 w-6 text-blue-500" />
                <span>Experience</span>
              </h2>
              {openSections.experience ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>
            {openSections.experience && (
              <div className="p-6 pt-0">
                <div className="space-y-6">
                  {profileData?.experiences?.map((exp, index) => (
                    <div
                      key={index}
                      className="relative pl-6 pb-6 border-l border-gray-800 last:pb-0"
                    >
                      <div className="absolute left-0 top-0 w-2 h-2 -translate-x-1 bg-blue-500 rounded-full"></div>
                      <h3 className="font-semibold text-lg">{exp?.title}</h3>
                      <p className="text-gray-400">{exp?.company}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(exp?.starts_at)} -{" "}
                        {exp?.ends_at ? formatDate(exp.ends_at) : "Present"}
                      </div>
                      {exp?.description && (
                        <p className="mt-2 text-gray-400 text-sm">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Education Card */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection("education")}
              className="w-full p-6 flex justify-between items-center hover:bg-gray-800/30 transition-colors"
            >
              <h2 className="flex items-center space-x-2 text-xl font-semibold">
                <GraduationCap className="h-6 w-6 text-blue-500" />
                <span>Education</span>
              </h2>
              {openSections.education ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>
            {openSections.education && (
              <div className="p-6 pt-0">
                <div className="space-y-6">
                  {profileData?.education?.map((edu, index) => (
                    <div
                      key={index}
                      className="relative pl-6 pb-6 border-l border-gray-800 last:pb-0"
                    >
                      <div className="absolute left-0 top-0 w-2 h-2 -translate-x-1 bg-blue-500 rounded-full"></div>
                      <h3 className="font-semibold text-lg">{edu?.school}</h3>
                      <p className="text-gray-400">{edu?.degree_name}</p>
                      <p className="text-gray-400 text-sm">
                        {edu?.field_of_study}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(edu?.starts_at)} -{" "}
                        {edu?.ends_at ? formatDate(edu.ends_at) : "Present"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Skills Card */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection("skills")}
              className="w-full p-6 flex justify-between items-center hover:bg-gray-800/30 transition-colors"
            >
              <h2 className="flex items-center space-x-2 text-xl font-semibold">
                <Code className="h-6 w-6 text-blue-500" />
                <span>Skills</span>
              </h2>
              {openSections.skills ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>
            {openSections.skills && (
              <div className="p-6 pt-0">
                <div className="flex flex-wrap gap-2">
                  {profileData?.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm border border-blue-500/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Certifications Card */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection("certifications")}
              className="w-full p-6 flex justify-between items-center hover:bg-gray-800/30 transition-colors"
            >
              <h2 className="flex items-center space-x-2 text-xl font-semibold">
                <Award className="h-6 w-6 text-blue-500" />
                <span>Certifications</span>
              </h2>
              {openSections.certifications ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>
            {openSections.certifications && (
              <div className="p-6 pt-0">
                <div className="space-y-4">
                  {profileData?.certifications?.map((cert, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{cert?.name}</h3>
                        <p className="text-gray-400 text-sm">{cert?.issuer}</p>
                        {cert?.url && (
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-500 text-sm mt-1 hover:underline"
                          >
                            <Link className="w-4 h-4 mr-1" />
                            View Certificate
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-4/5 mx-auto bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden mt-6 mb-8 shadow-lg">
          <div className="p-6 pt-4">
            <div className="space-y-6">
              <div className="relative pl-6 border-l border-gray-800">
                <div className="absolute left-[-8px] top-0 w-3 h-3 -translate-x-1 bg-blue-500 rounded-full"></div>
                <p className="text-gray-400 text-lg leading-relaxed">
                  {profileData?.summary || "No summary available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
