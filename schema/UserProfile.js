import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    headline: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    github: {
      type: String,
      trim: true,
    },
    linkedIn: {
      type: String,
      trim: true,
    },
    openToWork: {
      type: Boolean,
      default: true,
    },
    preferredWork: {
      type: String,
      enum: ["Remote", "On-site", "Hybrid"],
      default: "Remote",
    },
  },
  { timestamps: true }
);

const UserProfile =
  mongoose.models.UserProfile ||
  mongoose.model("UserProfile", userProfileSchema);

export default UserProfile;
