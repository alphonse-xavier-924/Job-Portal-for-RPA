const Jobs = require("../models/jobs");

exports.createJob = async (req, res) => {
  try {
    const {
      companyId,
      jobTitle,
      description,
      yrsofExperience,
      salaryFrom,
      salaryTo,
      skills,
      roleType,
      jobLocation,
      veteran,
      disabilities,
    } = req.body;

    if (Number(salaryFrom) > Number(salaryTo)) {
      return res
        .status(400)
        .json({ error: "Salary start value cannot exceed salary end value." });
    }

    const newJob = new Jobs({
      companyId,
      jobTitle,
      description,
      yrsofExperience,
      salaryStart: salaryFrom,
      salaryEnd: salaryTo,
      skills,
      roleType,
      jobLocation,
      veteran,
      disabilities,
    });

    await newJob.save();
    res.status(201).json({ message: "Job posted successfully", data: newJob });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getActiveJobs = async (req, res) => {
  try {
    const activeJobs = await Jobs.find({ isActive: true }).populate(
      "companyId",
      "companyName"
    );
    res.status(200).json(activeJobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getJobsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const jobs = await Jobs.find({ companyId });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Jobs.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    job.isActive = !job.isActive;
    await job.save();

    res
      .status(200)
      .json({ message: "Job status updated successfully", data: job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
