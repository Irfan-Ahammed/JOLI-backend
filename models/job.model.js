import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    enum: ["Full-Time", "Part-Time", "Contract", "Temporary"],
    default: "Full-Time",
  },
  wage: {
    type: Number,
    required: true, // Hourly or daily wage for the job
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the user who posted the job
    required: true,
  },
  requirements: {
    type: [String], // List of requirements (e.g., "Must have a valid driver's license")
    default: [],
  },
  userFullname: {
    type: String, // Store the fullname of the user who posted the job
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true, // Job posting is active or inactive
  },
  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
  ],
});

const job = mongoose.model("Job", jobSchema);
export default job;
