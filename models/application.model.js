import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job", // References the Job the user is applying for
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // References the User who is applying for the job
    required: true,
  },
  message: {
    type: String, // Optional message from the applicant to the employer
    trim: true,
  },
    status: {
    type: String,
    enum: ["pending", "accepted", "rejected"], // Allowed values
    default: "pending",
  },
  appliedAt: {
    type: Date,
    default: Date.now, // Timestamp for when the application was made
  },
});

export const Application = mongoose.model("Application", applicationSchema);
