require("module-alias/register");
const express = require("express");
const router = express.Router();
const jobApplicationsController = require("../controllers/jobApplications");
const Validation = require("../validations/jobapplications"); // Corrected path
const Responder = require("@service/responder");
const multer = require("multer");
const upload = multer();

router.post(
  "/create",
  upload.none(),
  Validation.createJobApplication(),
  Validation.validate, // Added validation middleware
  jobApplicationsController.createJobApplication.bind(jobApplicationsController)
);

router.get(
  "/candidate/:candidateId",
  Validation.validateCandidateId(),
  Validation.validate,
  jobApplicationsController.getJobsByCandidateId.bind(jobApplicationsController)
);

router.get("/job/:jobId", jobApplicationsController.getApplicationsByJobId);
router.patch(
  "/:applicationId/status",
  jobApplicationsController.updateApplicationStatus
);

router.delete(
  "/candidate/:candidateId/withdraw/:jobId",
  jobApplicationsController.withdrawJobApplication
);

module.exports = router;
