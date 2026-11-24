import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    company: { type: String, trim: true, default: "" },
    dates: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    school: { type: String, trim: true, default: "" },
    degree: { type: String, trim: true, default: "" },
    year: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

// One profile per candidate account, keyed by the account email.
const userProfileSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    full_name: { type: String, trim: true, default: "" },
    headline: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    country: { type: String, trim: true, default: "" },
    summary: { type: String, trim: true, default: "" },
    skills: { type: [String], default: [] },
    experiences: { type: [experienceSchema], default: [] },
    education: { type: [educationSchema], default: [] },
    github: { type: String, trim: true, default: "" },
    linkedIn: { type: String, trim: true, default: "" },
    website: { type: String, trim: true, default: "" },
    openToWork: { type: Boolean, default: true },
    preferredWork: { type: String, enum: ["Remote", "On-site", "Hybrid"], default: "Remote" },
  },
  { timestamps: true }
);

// Registered under a new model name so the old phone-keyed collection is left untouched.
const CandidateProfile =
  mongoose.models.CandidateProfile || mongoose.model("CandidateProfile", userProfileSchema);

export default CandidateProfile;
