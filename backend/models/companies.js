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
      trim: true,
    },
    about: {
      type: String,
      trim: true,
    },
    numberOfEmployees: {
      type: String,
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
      lowercase: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
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
    let userExists = await User.findOne({
      email: doc.companyEmail,
    });

    if (!userExists) {

      await User.create({
        email: doc.companyEmail,
        password: doc.password,
        role: "recruiter",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Companies", CompanySchema);
