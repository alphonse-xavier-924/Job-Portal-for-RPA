const { check, validationResult } = require("express-validator");

module.exports = {
  createJob: () => [
    check("jobTitle").notEmpty().withMessage("Job title is required"),
    check("description").notEmpty().withMessage("Job description is required"),
    check("yrsofExperience")
      .notEmpty()
      .withMessage("Years of experience is required"),
    check("salaryFrom").isNumeric().withMessage("Salary from must be a number"),
    check("salaryTo").isNumeric().withMessage("Salary to must be a number"),
    check("skills").isArray().withMessage("Skills must be an array"),
    check("roleType").notEmpty().withMessage("Role type is required"),
    check("jobLocation").notEmpty().withMessage("Job location is required"),
  ],

  updateJob: () => [
    check("jobTitle")
      .optional()
      .notEmpty()
      .withMessage("Job title is required"),
    check("description")
      .optional()
      .notEmpty()
      .withMessage("Job description is required"),
    check("yrsofExperience")
      .optional()
      .notEmpty()
      .withMessage("Years of experience is required"),
    check("salaryFrom")
      .optional()
      .isNumeric()
      .withMessage("Salary from must be a number"),
    check("salaryTo")
      .optional()
      .isNumeric()
      .withMessage("Salary to must be a number"),
    check("skills").optional().isArray().withMessage("Skills must be an array"),
    check("roleType")
      .optional()
      .notEmpty()
      .withMessage("Role type is required"),
    check("jobLocation")
      .optional()
      .notEmpty()
      .withMessage("Job location is required"),
  ],

  validate: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
};
