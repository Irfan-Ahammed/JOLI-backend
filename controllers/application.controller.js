import { Application } from "../models/application.model.js";
import Job from "../models/job.model.js";
import User from "../models/user.model.js";

// Apply for a job
export const applyJob = async (req, res) => {
  try {
    const userId = req.id; // User ID from authentication
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required.",
        success: false
      });
    }

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found."
      });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job."
      });
    }

    // Create new application
    const newApplication = new Application({
      job: jobId,
      applicant: userId,
      status: "Pending"
    });

    await newApplication.save();

    // Update job applications array
    job.applications.push(newApplication._id);
    await job.save();

    // Update user appliedJobs array
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { appliedJobs: jobId } }, // Ensures job isn't duplicated
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Job applied successfully",
      application: newApplication,
      user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to apply for the job.",
      error: error.message
    });
  }
};

// Get all applications for a job
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const applications = await Application.find({ applicant: userId }).populate(
      "applicant", // Corrected field name from "user" to "applicant"
      "name email"
    );
    if (!applications || applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No applications found for this job"
      });
    }
    return res.status(200).json({
      success: true,
      applications
    });
  } catch (error) {
    console.log(error);
  }
};

// Get applications by user
export const getUserApplications = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Find the job and populate applications
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
        select: "fullname email phoneNumber" // Exclude sensitive fields
      }
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false
      });
    }

    // Return only the applications
    return res.status(200).json({
      success: true,
      applications: job.applications
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applicants",
      error: error.message
    });
  }
};

// Update application status (e.g., Accept/Reject)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    // Validate status
    if (!status || !["Pending", "Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    // Find the application by ID and update status
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    application.status = status; // Don't change case
    await application.save();

    res.status(200).json({
      success: true,
      message: "Application status updated",
      application
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update application status",
      error: error.message
    });
  }
};

//user applied jobs profile
export const userAppliedJobsProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    // Fetch the user and populate appliedJobs along with application status
    const user = await User.findById(userId).populate({
      path: "appliedJobs",
      model: "Job",
      populate: {
        path: "applications",
        model: "Application",
        match: { applicant: userId }, // Only fetch applications made by this user
        select: "status" // Include only the status field
      }
    });

    if (!user || !user.appliedJobs.length) {
      return res
        .status(404)
        .json({ success: false, message: "No applied jobs found" });
    }

    res.status(200).json({ success: true, appliedJobs: user.appliedJobs });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

