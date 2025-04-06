import mongoose from "mongoose";
const applicantSchema = new mongoose.Schema(
  {
    applicantId: {
      type: String,
      ref: "UserProfile",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
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
