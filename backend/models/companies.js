const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");

const CompanySchema = new Schema(
  {
    companyName: {
      type: String,
      trim: true,
      required: true,
    },
    companyEmail: {
      type: String,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
      lowercase: true,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: { type: String },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    about: {
      type: String,
      required: true,
      trim: true,
    },
    numberOfEmployees: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
      required: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
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

CompanySchema.post("save", async function (doc, next) {
  try {
    await User.create({
      email: doc.companyEmail,
      password: doc.password,
      role: "recruiter",
    });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Companies", CompanySchema);
