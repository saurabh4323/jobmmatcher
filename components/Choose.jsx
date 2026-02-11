"use client";
import React, { useEffect } from "react";
import { ArrowRight, Building, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
const UserSelectionPage = () => {
  const { data: session, status } = useSession();
  const route = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      route.push("/student/home");
    }
  }, [status]);
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ marginTop: "30px", backgroundColor: "#1c1d31" }}
    >
      <div className="w-full max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            SKILLO
          </h1>
          <p className="text-gray-400 text-lg">
            Select your path to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recruiter Card */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-blue-500 transition-all duration-300 group">
            <div className="flex flex-col items-center text-center h-full">
              <div className="h-20 w-20 bg-blue-900/30 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-900/50 transition-colors">
                <Building size={36} className="text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-3">
                Recruiter
              </h2>
              <p className="text-gray-400 mb-8">
                Connect with top talent and build your dream team
              </p>

              <div className="mt-auto w-full space-y-4">
                <button
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center font-medium hover:bg-blue-500 transition-colors"
                  onClick={() => {
                    route.push("/recruiter/register");
                  }}
                >
                  Log In <ArrowRight size={16} className="ml-2" />
                </button>
                <button
                  className="w-full bg-transparent border border-blue-600 text-blue-400 py-3 px-4 rounded-lg flex items-center justify-center font-medium hover:bg-blue-900/20 transition-colors"
                  onClick={() => {
                    route.push("/recruiter/register");
                  }}
                >
                  Register <ArrowRight size={16} className="ml-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Student Card */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-purple-500 transition-all duration-300 group">
            <div className="flex flex-col items-center text-center h-full">
              <div className="h-20 w-20 bg-purple-900/30 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-900/50 transition-colors">
                <GraduationCap size={36} className="text-purple-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-3">
                Student
              </h2>
              <p className="text-gray-400 mb-8">
                Launch your career with opportunities that match your skills
              </p>

              <div className="mt-auto w-full space-y-4">
                <button
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg flex items-center justify-center font-medium hover:bg-purple-500 transition-colors"
                  onClick={() => {
                    route.push("/register");
                  }}
                >
                  Log In <ArrowRight size={16} className="ml-2" />
                </button>
                <button
                  className="w-full bg-transparent border border-purple-600 text-purple-400 py-3 px-4 rounded-lg flex items-center justify-center font-medium hover:bg-purple-900/20 transition-colors"
                  onClick={() => {
                    route.push("/register");
                  }}
                >
                  Register <ArrowRight size={16} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSelectionPage;
