const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");

const CandidatesSchema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    email: {
      type: String,
      trim: true,
      match: /^\S+@\S+\.\S+$/,
      lowercase: true,
      required: true,
      unique: true,
      index: true,
    },
    password: { type: String, required: true },
    token: String,
    currentJobTitle: { type: String, trim: true },
    location: { type: String, trim: true },
    about: { type: String, trim: true },
    experience: [
      {
        company: { type: String, trim: true, required: true },
        role: { type: String, trim: true, required: true },
        startDate: Date,
        endDate: Date,
        description: { type: String, trim: true },
      },
    ],
    education: [
      {
        school: { type: String, trim: true, required: true },
        degree: { type: String, trim: true, required: true },
        grade: {
          type: String,
          enum: ["A", "B", "C", "D", "E", "F"],
          required: true,
        },
      },
    ],
    resume: { type: String, uploadedAt: Date },
    certifications: { type: String },
    links: {
      github: { type: String, trim: true },
      medium: { type: String, trim: true },
      other: { type: String, trim: true },
    },
    rpaSkills: [String],
    otherSkills: [String],
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CandidatesSchema.post("save", async function (doc, next) {
  try {
    if (!(await User.findOne({ email: doc.email })))
      await User.create({
        email: doc.email,
        password: doc.password,
        role: "candidate",
      });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports =
  mongoose.models.Candidates || mongoose.model("Candidates", CandidatesSchema);
