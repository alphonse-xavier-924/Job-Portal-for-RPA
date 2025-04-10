const { body, param, validationResult } = require("express-validator");

exports.createJobApplication = () => [
  body("candidateId").notEmpty().withMessage("Candidate ID is required"),
  body("jobId").notEmpty().withMessage("Job ID is required"),
  body("companyId").notEmpty().withMessage("Company ID is required"),
];

exports.validateCandidateId = () => [
  param("candidateId").notEmpty().withMessage("Candidate ID is required"),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
