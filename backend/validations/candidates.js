const { body, param, validationResult } = require("express-validator");
const ValidationRule = require("@service/validation/index");

module.exports = {
  signup() {
    return [
      ValidationRule.isEmail("email"),
      ValidationRule.isStringWithMinLen("name", 2),
      ValidationRule.isPassword("password"),
    ];
  },

  editProfile() {
    return [
      ValidationRule.requiredObjectId("candidateId"),
      ValidationRule.isStringWithMinLen("currentJobTitle", 2),
      ValidationRule.isStringWithMinLen("location", 2),
      ValidationRule.isStringOptional("about"),
      ValidationRule.requiredArray("experience"),
      ValidationRule.requiredArray("education"),
      ValidationRule.requiredArrayofString("rpaSkills"),
      ValidationRule.requiredArrayofString("otherSkills"),
      ValidationRule.isStringOptional("githubLink"),
      ValidationRule.isStringOptional("mediumLink"),
      ValidationRule.isStringOptional("otherLink"),
    ];
  },

  login() {
    return [
      ValidationRule.isEmail("email"),
      ValidationRule.isStringWithMinLen("password", 8),
    ];
  },

  validateCandidateId() {
    return [
      param("candidateId").notEmpty().withMessage("Candidate ID is required"),
    ];
  },

  validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
};
