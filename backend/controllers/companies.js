require("module-alias/register");
const Companies = require("@models/Companies");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Responder = require("@service/responder");
const multer = require("multer");
const upload = multer();

module.exports = {
  async signup(req, res) {
    try {
      const { companyName, companyEmail, password } = req.body;
      const existingCompany = await Companies.findOne({ companyEmail });

      if (existingCompany) {
        return Responder.respondWithError(req, res, "Company already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newCompany = new Companies({
        companyName,
        companyEmail,
        password: hashedPassword,
      });

      await newCompany.save();

      const payload = {
        company: {
          id: newCompany.id,
        },
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
      });

      Responder.respondWithSuccess(req, res, "Signup successful", { token });
    } catch (err) {
      console.log("Error in company signup", err);
      Responder.respondWithError(req, res, "Server Error");
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const company = await Companies.findOne({ companyEmail: email }); // Fixed field name

      if (!company) {
        return Responder.respondWithError(req, res, "Invalid credentials");
      }

      const isMatch = await bcrypt.compare(password, company.password);

      if (!isMatch) {
        return Responder.respondWithError(req, res, "Invalid credentials");
      }

      const payload = { company: { id: company.id } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
      });

      Responder.respondWithSuccess(req, res, "Login successful", { token });
    } catch (err) {
      console.log("Error in recruiters login", err);
      Responder.respondWithError(req, res, "Server Error");
    }
  },

  async editProfile(req, res) {
    req.body = JSON.parse(JSON.stringify(req.body));

    try {
      const company = await Companies.findOne({ _id: req.body.companyId });
      console.log("Company found", company);
      console.log("Request body", req.body);
      if (!company) {
        return Responder.respondWithError(req, res, "Company not found");
      }

      // Check if the new contactEmail is already used by another company
      if (
        req.body.contactEmail &&
        req.body.contactEmail !== company.contactEmail
      ) {
        const existingCompany = await Companies.findOne({
          contactEmail: req.body.contactEmail,
        });
        if (existingCompany) {
          return Responder.respondWithError(
            req,
            res,
            "Email already in use by another company"
          );
        }
      }

      // Use `findOneAndUpdate()` to ensure only an update occurs
      const updatedCompany = await Companies.findOneAndUpdate(
        { _id: req.body.companyId },
        {
          $set: {
            location: req.body.location || company.location,
            about: req.body.about || company.about,
            numberOfEmployees:
              req.body.numberOfEmployees || company.numberOfEmployees,
            website: req.body.website || company.website,
            contactPhone: req.body.contactPhone || company.contactPhone,
            contactEmail: req.body.contactEmail || company.contactEmail,
          },
        },
        { new: true } // Return the updated document
      );

      if (!updatedCompany) {
        return Responder.respondWithError(req, res, "Failed to update profile");
      }

      Responder.respondWithSuccess(req, res, "Profile updated successfully");
    } catch (err) {
      console.log("Error in company edit profile", err);
      Responder.respondWithError(req, res, "Server Error");
    }
  },
  async getCompanyById(req, res) {
    const { companyId } = req.params;

    try {
      const company = await Companies.findById(companyId);
      if (!company) {
        return Responder.respondWithError(req, res, "Company not found");
      }
      Responder.respondWithSuccess(
        req,
        res,
        "Company details fetched successfully",
        company
      );
    } catch (err) {
      console.error("Error in companies getCompanyById", err);
      Responder.respondWithError(req, res, "Server Error");
    }
  },
};
