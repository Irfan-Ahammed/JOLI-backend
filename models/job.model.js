import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  jobType: {
    type: String,
    enum: ["Full-Time", "Part-Time", "Contract", "Temporary"],
    default: "Full-Time"
  },
  wage: {
    type: Number,
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  requirements: {
    type: [String],
    default: []
  },
  userFullname: {
    type: String,
    required: true
  },
  userImage: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application"
    }
  ]
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
