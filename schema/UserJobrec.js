import mongoose from "mongoose";

const userSchemarec = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: "Please enter a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Userjobrec =
  mongoose.models.Userjobrec || mongoose.model("Userjobrec", userSchemarec);
export default Userjobrec;
