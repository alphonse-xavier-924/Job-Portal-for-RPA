require("module-alias/register");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Responder = require("@service/responder");
const multer = require("multer");
const Jobs = require("@models/jobs");
const JobApplications = require("@models/jobApplications");
const upload = multer();

const { uploadToBucket } = require("@config/aws-sdk");
const COVERLETTER_FOLDER = "coverletters/";
const { appendDateToFileName } = require("@service/commonFunc");

exports.createJobApplication = async (req, res) => {
  try {
    const { candidateId, jobId, companyId, resume } = req.body;

    if (!candidateId || !jobId || !companyId) {
      return res

        .status(400)

        .json({ error: "Candidate ID, Job ID, and Company ID are required" });
    }

    let application = {
      candidateId,

      jobId,

      companyId,

      status: "Pending",

      resume,
    };

    if (req.file) {
      let imgUploadRes = await uploadToBucket(
        req,
        `${COVERLETTER_FOLDER}${appendDateToFileName(
          req.file.originalname.split(".m")[0]
        )}`
      );

      if (!imgUploadRes.status) {
        return Responder.respondWithError(req, res, imgUploadRes.file);
      }

      application.coverLetter = imgUploadRes.file.Location;
    }

    const newApplication = new JobApplications(application);

    const savedApplication = await newApplication.save();

    res.status(201).json(savedApplication);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Failed to create job application" });
  }
};

exports.getJobsByCandidateId = async (req, res) => {
  const { candidateId } = req.params;

  try {
    const jobApplications = await JobApplications.find({ candidateId })

      .populate("companyId", "companyName")

      .populate("jobId", "jobTitle");

    res.status(200).json(jobApplications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch job applications" });
  }
};

exports.getApplicationsByJobId = async (req, res) => {
  const { jobId } = req.params;

  try {
    const jobApplications = await JobApplications.find({ jobId }).populate(
      "candidateId",
      "name resume"
    );

    const job = await Jobs.findOne({ _id: jobId });

    res.status(200).json({ job, applications: jobApplications });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch job applications" });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;

  const { status } = req.body;

  try {
    const updatedApplication = await JobApplications.findByIdAndUpdate(
      applicationId,

      { status },

      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ error: "Job application not found" });
    }

    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(500).json({ error: "Failed to update job application status" });
  }
};

exports.withdrawJobApplication = async (req, res) => {
  const { candidateId, jobId } = req.params;

  try {
    // Find and delete the job application

    const deletedApplication = await JobApplications.findOneAndDelete({
      candidateId,

      jobId,
    });

    if (!deletedApplication) {
      return res.status(404).json({ error: "Job application not found" });
    }

    res.status(200).json({ message: "Application withdrawn successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to withdraw job application" });
  }
};
