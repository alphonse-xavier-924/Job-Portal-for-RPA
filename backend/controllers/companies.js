require("module-alias/register");
const Companies = require("@models/Companies");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Responder = require("@service/responder");
const multer = require("multer");
const upload = multer();
const { uploadToBucket } = require("@config/aws-sdk");
const LOGO_FOLDER = "logos/";
const { appendDateToFileName } = require("@service/commonFunc");

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
      Responder.respondWithError(req, res, "Server Error");
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const company = await Companies.findOne({ companyEmail: email });

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
      Responder.respondWithError(req, res, "Server Error");
    }
  },

  async editProfile(req, res) {
    req.body = JSON.parse(JSON.stringify(req.body));

    try {
      const company = await Companies.findOne({ _id: req.body.companyId });


      if (!company) {
        return Responder.respondWithError(req, res, "Company not found");
      }

      if (req.file) {
        let imgUploadRes = await uploadToBucket(
          req,
          `${LOGO_FOLDER}${appendDateToFileName(
            req.file.originalname.split(".m")[0]
          )}`
        );

        if (!imgUploadRes.status) {
          return Responder.respondWithError(req, res, imgUploadRes.file);
        }

        company.logo = imgUploadRes.file.Location;
      }

      company.location = req.body.location || company.location;
      company.about = req.body.about || company.about;
      company.numberOfEmployees =
        req.body.numberOfEmployees || company.numberOfEmployees;
      company.website = req.body.website || company.website;
      company.contactPhone = req.body.contactPhone || company.contactPhone;
      if (req.body.contactEmail != company.contactEmail) {
        company.contactEmail = req.body.contactEmail;
      }

      await company.save();

      Responder.respondWithSuccess(req, res, "Profile updated successfully");
    } catch (err) {
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
      Responder.respondWithError(req, res, "Server Error");
    }
  },
};
