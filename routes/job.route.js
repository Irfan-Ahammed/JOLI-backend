import express from "express";
import {
  createJob,
  getAdminJobs,
  getAllJobs,
  getJobsById,
  updateJob,
} from "../controllers/job.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, createJob);
router.route("/update/:jobId").put(isAuthenticated, updateJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/getadminjobs/:id").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(isAuthenticated, getJobsById);

export default router;
