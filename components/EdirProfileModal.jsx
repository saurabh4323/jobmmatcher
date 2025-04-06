"use client";
import { Cross } from "lucide-react";
import { useState } from "react";

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    full_name: "",
    headline: "",
    email: "",
    phone: "",
    github: "",
    linkedIn: "",
    openToWork: true,
    preferredWork: "Remote",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const jobid = localStorage.setItem("jobid", formData.phone);
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div
      className="min-h-screen  flex items-center justify-center px-6 py-12"
      style={{ marginTop: "540px" }}
    >
      <div
        className="bg-white shadow-xl rounded-3xl w-full max-w-3xl p-10 space-y-8"
        style={{ width: "800px" }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              id="full_name"
              placeholder="John Doe"
              value={formData.full_name}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Headline */}
          <div>
            <label
              htmlFor="headline"
              className="block text-sm font-medium text-gray-700"
            >
              Headline
            </label>
            <input
              type="text"
              name="headline"
              id="headline"
              placeholder="e.g., Frontend Developer"
              value={formData.headline}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder=""
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              placeholder="+1234567890"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label
              htmlFor="linkedIn"
              className="block text-sm font-medium text-gray-700"
            >
              LinkedIn Profile URL
            </label>
            <input
              type="text"
              name="linkedIn"
              id="linkedIn"
              placeholder="https://linkedin.com/in/your-profile"
              value={formData.linkedIn}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* GitHub */}
          <div>
            <label
              htmlFor="github"
              className="block text-sm font-medium text-gray-700"
            >
              GitHub Profile URL
            </label>
            <input
              type="text"
              name="github"
              id="github"
              placeholder="https://github.com/your-profile"
              value={formData.github}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Preferred Work */}
          <div>
            <label
              htmlFor="preferredWork"
              className="block text-sm font-medium text-gray-700"
            >
              Preferred Work Environment
            </label>
            <select
              name="preferredWork"
              id="preferredWork"
              value={formData.preferredWork}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-px active:translate-y-px active:shadow-none focus:outline-none focus:ring focus:ring-purple-300 focus:ring-offset-white focus:ring-offset-bg-white"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
