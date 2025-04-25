const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const JobApplications = new Schema(
  {
    candidateId: {
      type: Schema.Types.ObjectId,

      ref: "Candidates",

      required: true,
    },

    jobId: {
      type: Schema.Types.ObjectId,

      ref: "Jobs",

      required: true,
    },

    companyId: {
      type: Schema.Types.ObjectId,

      ref: "Companies",

      required: true,
    },

    status: {
      type: String,

      required: true,

      enum: ["Pending", "Reviewed", "Shortlisted", "Rejected", "Hired"],
    },

    accepted: {
      type: Boolean,
    },

    resume: {
      type: String,

      required: false,
    },

    coverLetter: {
      type: String,

      required: false,
    },
  },

  {
    timestamps: {
      createdAt: true,

      updatedAt: true,
    },

    toJSON: { virtuals: true },

    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("JobApplications", JobApplications);
