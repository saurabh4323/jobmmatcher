import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema(
  {
    applicantId: { type: String, trim: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    resumeUrl: { type: String, trim: true, default: "" },
    coverLetter: { type: String, trim: true, default: "" },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "job",
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "interviewed", "offered", "rejected"],
      default: "applied",
    },
  },
  { timestamps: true }
);

const JobsApplied =
  mongoose.models.JobsApplied || mongoose.model("JobsApplied", applicantSchema);

export default JobsApplied;
