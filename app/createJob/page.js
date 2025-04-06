// File: src/app/create-job/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CreateJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    skills: "",
    experience: "",
    jobType: "",
    salary: "",
    applicationDeadline: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const jobData = {
        ...formData,
        name: formData.company, // ✅ Fix: rename company to name
        skills: formData.skills.split(",").map((skill) => skill.trim()),
        createdAt: new Date().toISOString(), // ✅ Add createdAt
      };
      delete jobData.company; // Optional: remove company field

      console.log("Sending jobData:", jobData);

      const response = await axios.post("/api/rec/job", jobData);
      console.log(response.data);

      router.push("/jobs");
      router.refresh();
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen  text-white p-6"
      style={{ backgroundColor: "#1c1d31" }}
    >
      <div
        className="max-w-4xl mx-auto  p-8 rounded-2xl shadow-lg"
        style={{ border: "3px solid rgb(255, 255, 255)" }}
      >
        <h1 className="text-3xl font-bold mb-6 text-white">📝 Create Job</h1>

        {error && (
          <div className="bg-red-500 text-white px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title & Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Job Title *"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <InputField
              label="Company Name *"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>

          {/* Location */}
          <InputField
            label="Location *"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          {/* Description */}
          <div>
            <Label htmlFor="description">Job Description *</Label>
            <textarea
              id="description"
              name="description"
              rows={5}
              required
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 text-white px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Skills */}
          <InputField
            label="Required Skills * (comma-separated)"
            id="skills"
            name="skills"
            placeholder="React, Next.js, TypeScript, etc."
            value={formData.skills}
            onChange={handleChange}
            required
          />

          {/* Experience & Job Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              label="Experience Required *"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              options={[
                { value: "", label: "Select experience level" },
                { value: "Entry-level", label: "Entry-level (0-2 years)" },
                { value: "Mid-level", label: "Mid-level (2-5 years)" },
                { value: "Senior", label: "Senior (5+ years)" },
                { value: "Lead", label: "Lead (8+ years)" },
              ]}
              required
            />

            <SelectField
              label="Job Type *"
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              options={[
                { value: "Full-time", label: "Full-time" },
                { value: "Part-time", label: "Part-time" },
                { value: "Contract", label: "Contract" },
                { value: "Freelance", label: "Freelance" },
                { value: "Internship", label: "Internship" },
              ]}
              required
            />
          </div>

          {/* Salary & Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Salary Range"
              id="salary"
              name="salary"
              placeholder="e.g. $60,000 - $80,000"
              value={formData.salary}
              onChange={handleChange}
            />
            <InputField
              label="Application Deadline"
              id="applicationDeadline"
              name="applicationDeadline"
              type="date"
              value={formData.applicationDeadline}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Reusable components for cleaner code:
const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-300">
    {children}
  </label>
);

const InputField = ({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <input
      type={type}
      id={id}
      name={name}
      required={required}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 text-white px-3 py-2 focus:border-blue-500 focus:outline-none"
    />
  </div>
);

const SelectField = ({
  label,
  id,
  name,
  value,
  onChange,
  options,
  required,
}) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <select
      id={id}
      name={name}
      value={value}
      required={required}
      onChange={onChange}
      className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 text-white px-3 py-2 focus:border-blue-500 focus:outline-none"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
