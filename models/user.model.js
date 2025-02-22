import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    bio: {
      type: String
    },
    location: {
      type: String,
      required: true,
      default: "Unknown" // Default value for location
    }
  },
  dpImage: {
    type: String,
    default: ""
  },
  appliedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job"
    }
  ],
  createdJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job"
    }
  ]
});

const User = mongoose.model("User", userSchema);

export default User;
