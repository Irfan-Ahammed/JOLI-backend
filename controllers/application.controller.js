import { Application } from "../models/application.model.js";
import Job from "../models/job.model.js";

// Apply for a job
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    console.log("User ID:", userId); // Log userId to check if it's populated
    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required.",
        success: false,
      });
    }

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required.",
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    const newApplication = new Application({
      job: jobId,
      applicant: userId,
      status: "Pending",
    });

    await newApplication.save();

    if (!job.applications) {
      job.applications = [];
    }

    job.applications.push(newApplication._id);
    await job.save();

    return res.status(201).json({
      success: true,
      message: "You have successfully applied for the job.",
      application: newApplication,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to apply for the job.",
      error: error.message,
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
        message: "No applications found for this job",
      });
    }
    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.log(error);
  }
};

// Get applications by user
export const getUserApplications = async (req, res) => {
  try {
    const userId = req.id; // Assuming user ID is provided via authentication

    // Fetch all applications submitted by the user
    const applications = await Application.find({ applicant: userId }).populate(
      "job", // Corrected to "applicant"
      "title location"
    );

    if (!applications || applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No applications found for this user",
      });
    }

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user applications",
      error: error.message,
    });
  }
};

// Update application status (e.g., Accept/Reject)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    // Validate status
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // Find the application by ID and update status
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Update the status (toLowerCase is corrected)
    application.status = status.toLowerCase();
    await application.save();

    res.status(200).json({
      success: true,
      message: "Application status updated",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update application status",
      error: error.message,
    });
  }
};
