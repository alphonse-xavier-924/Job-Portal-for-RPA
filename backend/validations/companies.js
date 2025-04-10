const { check, validationResult } = require("express-validator");

module.exports = {
  companySignup: () => [
    check("companyName").notEmpty().withMessage("Company name is required"),
    check("companyEmail").isEmail().withMessage("Valid email is required"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],

  companyEditProfile: () => [
    check("companyId").notEmpty().withMessage("Company ID is required"),
    check("companyName")
      .optional()
      .isString()
      .isLength({ min: 2 })
      .withMessage("Company name must be at least 2 characters long"),
    check("location")
      .optional()
      .isString()
      .isLength({ min: 2 })
      .withMessage("Location must be at least 2 characters long"),
    check("about").optional().isString().withMessage("About must be a string"),
    check("numberOfEmployees")
      .optional()
      .isString()
      .withMessage("Number of employees must be a string"),
    check("website")
      .optional()
      .isURL()
      .withMessage("Valid website URL is required"),
    check("contactPhone")
      .optional()
      .isMobilePhone()
      .withMessage("Valid contact phone is required"),
    check("contactEmail")
      .isEmail()
      .withMessage("Valid contact email is required"),
  ],

  login: () => [
    check("email").isEmail().withMessage("Valid email is required"),
    check("password").notEmpty().withMessage("Password is required"),
  ],

  validate: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
};
