"use client";
import React, { useState, useEffect } from "react";
import { Linkedin, Lock, Mail, User, ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const AuthPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint =
        activeTab === "login" ? "/api/rec/login" : "/api/rec/register";

      const response = await axios.post(endpoint, {
        fullName: activeTab === "signup" ? e.target.fullName.value : undefined,
        email: e.target.email.value,
        password: e.target.password.value,
      });

      // Store token or handle response

      localStorage.setItem("recid", "aiq");
      localStorage.setItem("recemail", e.target.email.value);
      window.location.href = "/home";
    } catch (error) {
      console.error("Auth error:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-blue-900"
      style={{ marginTop: "80px" }}
    >
      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-sm rounded-xl border border-blue-500/30 shadow-2xl shadow-blue-500/10 p-8">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-600 p-4 rounded-full shadow-lg shadow-blue-600/50">
            <Linkedin className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Skillo Recruiter
        </h1>
        <p className="text-blue-300 text-center mb-8 text-sm">
          {activeTab === "login"
            ? "Welcome back! Log in to continue"
            : "Create an account to get started"}
        </p>

        {/* Tabs */}
        <div className="flex mb-8 bg-slate-700/50 rounded-lg p-1">
          <button
            className={`flex-1 py-2 px-4 text-center rounded-md transition-all duration-200 ${
              activeTab === "login"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-300 hover:text-white"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center rounded-md transition-all duration-200 ${
              activeTab === "signup"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-300 hover:text-white"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Forms */}
        <div className="mt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            {activeTab === "signup" && (
              <div className="group">
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                  <input
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/70 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/70 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/70 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/20 disabled:opacity-50 mt-8"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{activeTab === "login" ? "Login" : "Sign Up"}</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-800/80 text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-400">
          {activeTab === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setActiveTab("signup")}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign up now
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setActiveTab("login")}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Login instead
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
