const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobsSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Companies",
      required: true,
    },
    jobTitle: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    yrsofExperience: {
      type: String,
      required: true,
    },
    salaryStart: {
      type: String,
      required: true,
    },
    salaryEnd: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    roleType: {
      type: String,
      required: true,
      enum: ["Full Time", "Part Time", "Contract", "Intern"],
    },
    jobLocation: {
      type: String,
      required: true,
      enum: ["Remote", "Onsite", "Hybrid"],
    },
    veteran: {
      type: Boolean,
      required: false,
    },
    disabilities: {
      type: Boolean,
      required: false,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
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

module.exports = mongoose.model("Jobs", JobsSchema);
