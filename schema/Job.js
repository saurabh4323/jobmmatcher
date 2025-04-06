import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
  },

  name: {
    type: String,
  },
  location: {
    type: String,
  },
  description: {
    type: String,
  },
  skills: {
    type: [String],
  },
  experience: {
    type: String,
  },
  jobType: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract"],
    default: "Full-time",
  },
  salary: {
    type: String,
  },
  applicationDeadline: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const job = mongoose.models.job || mongoose.model("job", JobSchema);
export default job;
