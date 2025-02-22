import express from "express";
import {
  applyJob,
  getAppliedJobs,
  getUserApplications,
  updateApplicationStatus,
  userAppliedJobsProfile
} from "../controllers/application.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Route for applying to a job (POST request)
router.route("/apply/:id").post(isAuthenticated, applyJob); // Apply to a job using the job ID

// Route for getting all applied jobs (GET request)
router.route("/applied").get(isAuthenticated, getAppliedJobs); // Get jobs a user has applied for

// Route for getting user applications (GET request)
// router.route("/user-applications").get(isAuthenticated, getUserApplications); // Get all applications submitted by the user
router.route("/:id/applicants").get(isAuthenticated, getUserApplications); // Get all applications submitted by the user

// Route for updating the application status (PATCH request)
router.route("/status/:id/update").post(isAuthenticated, updateApplicationStatus); // Update the application status (accept/reject)

router.route("/appliedJobsProfile/:id").get(isAuthenticated, userAppliedJobsProfile);

export default router;
