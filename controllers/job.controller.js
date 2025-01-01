import Job from "../models/job.model.js";

// Create a new job
export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      jobType,
      wage,
      requirements,
      isActive,
    } = req.body;

    const userId = req.id;

    // Validate required fields
    if (!title || !description || !location || !wage || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const newJob = await Job.create({
      title,
      description,
      location,
      jobType,
      wage: Number(wage),
      postedBy: userId,
      requirements,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: newJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create job",
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
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate({
        //The code fetches jobs based on a search query, populates the postedBy field with user details (name and email), and sorts the jobs by the createdAt field in descending order.
        path: "postedBy", // Populate the 'postedBy' field with user details
        select: "name email", // Optionally, specify which fields of the User model to return
      })
      .sort({ createdAt: -1 });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};

// Get job by ID
export const getJobsById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }
    return res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch job",
      error: error.message,
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
        message: "No jobs found for this admin",
      });
    }

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs for the admin",
      error: error.message,
    });
  }
};
