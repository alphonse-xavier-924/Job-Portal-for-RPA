require("module-alias/register");
const express = require("express");
const router = express.Router();
const jobsController = require("@controllers/jobs");
const Validation = require("@validation/jobposting");
const Responder = require("@service/responder");
const multer = require("multer");
const upload = multer();

router.post(
  "/post-job",
  Validation.createJob(), // Add validation for creating a job
  Responder.validate.bind(Responder),
  jobsController.createJob.bind(jobsController)
);

router.get("/active-jobs", jobsController.getActiveJobs.bind(jobsController));

router.get("/company/:companyId", jobsController.getJobsByCompany);

router.patch("/toggleStatus/:jobId", jobsController.toggleJobStatus);

module.exports = router;
