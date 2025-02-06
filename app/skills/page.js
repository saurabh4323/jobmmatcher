"use client";
import React, { useState, useEffect } from "react";

export default function Page() {
  const [Data, setData] = useState([]);

  useEffect(() => {
    const profileData = localStorage.getItem("profiledata");
    if (profileData) {
      setData(JSON.parse(profileData));
    }
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center bg-black">
      <div className="bg-gray-900/80 border border-blue-500/40 shadow-xl shadow-blue-500/20 rounded-xl p-8 w-[90%] md:w-[60%] mx-auto mb-[100px] transition-all duration-300 hover:shadow-blue-500/40">
        <h2 className="text-2xl font-semibold text-blue-400 mb-6 text-center tracking-wide">
          Skills
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {Data?.skills?.map((skill, index) => (
            <span
              key={index}
              className="px-5 py-3 bg-blue-500/20 text-blue-300 rounded-lg text-lg border border-blue-500/50 shadow-md shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 hover:bg-blue-500/30 hover:shadow-blue-500/50"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
