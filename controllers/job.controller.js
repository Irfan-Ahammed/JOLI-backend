import Job from "../models/job.model.js";
import User from "../models/user.model.js";

// Create a new job
export const createJob = async (req, res) => {
  try {
    const { title, description, requirements, wage, location, jobType } =
      req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !wage ||
      !location ||
      !jobType ||
      !userId
    ) {
      return res.status(400).json({
        message: "Something is missing. Please provide all required fields.",
        success: false
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: Array.isArray(requirements)
        ? requirements
        : requirements.split(","),
      wage: Number(wage),
      location,
      jobType,
      postedBy: userId,
      userFullname: user.fullname,
      userImage:user.dpImage
    });

    // Update user's createdJobs array
    user.createdJobs.push(job._id);
    await user.save();

    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true
    });
  } catch (error) {
    console.error("Error in createJob:", error);
    return res.status(500).json({
      message: "Failed to create job. Please try again later.",
      success: false,
      error: error.message
    });
  }
};
// Update an existing job
export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { title, description, requirements, wage, location, jobType } = req.body;
    const userId = req.id;

    // Check if jobId is provided
    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required.",
        success: false,
      });
    }

    // Find the job by ID
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    // Check if the logged-in user is the one who created the job
    if (job.postedBy.toString() !== userId) {
      return res.status(403).json({
        message: "You are not authorized to update this job.",
        success: false,
      });
    }

    // Update the job fields if provided
    if (title) job.title = title;
    if (description) job.description = description;
    if (requirements) {
      job.requirements = Array.isArray(requirements)
        ? requirements
        : requirements.split(",");
    }
    if (wage) job.wage = Number(wage);
    if (location) job.location = location;
    if (jobType) job.jobType = jobType;

    // Save the updated job
    await job.save();

    return res.status(200).json({
      message: "Job updated successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.error("Error in updateJob:", error);
    return res.status(500).json({
      message: "Failed to update job. Please try again later.",
      success: false,
      error: error.message,
    });
  }
};
// Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } }, // Fixed $option to $options
        { description: { $regex: keyword, $options: "i" } }
      ]
    };

    const jobs = await Job.find(query)
      .populate({
        //The code fetches jobs based on a search query, populates the postedBy field with user details (name and email), and sorts the jobs by the createdAt field in descending order.
        path: "postedBy", // Populate the 'postedBy' field with user details
        select: "name email" // Optionally, specify which fields of the User model to return
      })
      .sort({ createdAt: -1 });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false
      });
    }
    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message
    });
  }
};

// Get job by ID
export const getJobsById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications"
    });
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false
      });
    }
    return res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch job",
      error: error.message
    });
  }
};

// Get jobs by admin ID
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.params.id; // Fetch the adminId from the URL parameters
    const jobs = await Job.find({ postedBy: adminId });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No jobs found for this admin"
      });
    }

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs for the admin",
      error: error.message
    });
  }
};
