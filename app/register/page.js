"use client";
import React, { useState } from "react";
import { Linkedin, Lock, Mail, User } from "lucide-react";
import axios from "axios";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

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
      const endpoint = activeTab === "login" ? "/api/login" : "/api/register";

      const response = await axios.post(endpoint, {
        fullName: activeTab === "signup" ? e.target.fullName.value : undefined,
        email: e.target.email.value,
        password: e.target.password.value,
      });

      // Store token or handle response
      localStorage.setItem("tokenid", "aiq");
      window.location.href = "/";
    } catch (error) {
      console.error("Auth error:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 rounded-lg border border-blue-500/20 p-6">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <Linkedin className="h-12 w-12 text-blue-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          CareerLens
        </h1>

        {/* Tabs */}
        <div className="flex mb-6">
          <button
            className={`flex-1 p-3 text-center ${
              activeTab === "login"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400 border-b-2 border-transparent"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 p-3 text-center ${
              activeTab === "signup"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400 border-b-2 border-transparent"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Forms */}
        <div className="mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading
                ? "Loading..."
                : activeTab === "login"
                ? "Login"
                : "Sign Up"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          {activeTab === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setActiveTab("signup")}
                className="text-blue-500 hover:text-blue-400"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setActiveTab("login")}
                className="text-blue-500 hover:text-blue-400"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
