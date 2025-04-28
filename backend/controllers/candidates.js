require("module-alias/register");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Candidates = require("@models/Candidates");
const Responder = require("@service/responder");
const { uploadToBucket } = require("@config/aws-sdk");
const RESUME_FOLDER = "resumes/";
const { appendDateToFileName } = require("@service/commonFunc");

module.exports = {
  async signup(req, res) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const candidate = new Candidates({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      await candidate.save();

      Responder.respondWithSuccess(req, res, "Candidate created successfully");
    } catch (err) {
      Responder.respondWithError(req, res, "Server Error");
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const candidate = await Candidates.findOne({ email });

      if (!candidate) {
        return Responder.respondWithError(req, res, "Invalid credentials");
      }

      const isMatch = await bcrypt.compare(password, candidate.password);

      if (!isMatch) {
        return Responder.respondWithError(req, res, "Invalid credentials");
      }

      const payload = {
        candidate: {
          id: candidate.id,
        },
      };

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
      let candidate = await Candidates.findOne({ _id: req.body.candidateId });
      if (!candidate) {
        return Responder.respondWithError(req, res, "Candidate not found");
      }

      if (req.file) {
        const key = `${RESUME_FOLDER}${appendDateToFileName(
          req.file.originalname.split(".")[0]
        )}`;
        const imgUploadRes = await uploadToBucket(req, key);

        if (!imgUploadRes.status) {
          return Responder.respondWithError(req, res, imgUploadRes.file);
        }
        candidate.resume = {
          key: imgUploadRes.file.Location,
          uploadedAt: new Date(),
        };
      }

      candidate.currentJobTitle = req.body.currentJobTitle;
      candidate.location = req.body.location;
      candidate.about = req.body.about;
      candidate.experience = req.body.experience || [];
      candidate.education = req.body.education || [];
      candidate.rpaSkills = req.body.rpaSkills || [];
      candidate.otherSkills = req.body.otherSkills || [];
      candidate.githubLink = req.body.githubLink || "";
      candidate.mediumLink = req.body.mediumLink || "";
      candidate.otherLink = req.body.otherLink || "";
      candidate.certifications = req.body.certifications || "";
      candidate.links = req.body.links || {};
      await candidate.save();

      Responder.respondWithSuccess(req, res, "Candidate updated successfully");
    } catch (err) {
      Responder.respondWithError(req, res, "Server Error");
    }
  },

  async getCandidateById(req, res) {
    const { candidateId } = req.params;

    try {
      const candidate = await Candidates.findById(candidateId);
      if (!candidate) {
        return Responder.respondWithError(req, res, "Candidate not found");
      }
      Responder.respondWithSuccess(
        req,
        res,
        "Candidate details fetched successfully",
        candidate
      );
    } catch (err) {
      Responder.respondWithError(req, res, "Server Error");
    }
  },
};
