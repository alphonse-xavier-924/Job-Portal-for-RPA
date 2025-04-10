require("module-alias/register");
const express = require("express");
const router = express.Router();
const companiesController = require("@controllers/companies");
const Validation = require("@validation");
const Responder = require("@service/responder");
const multer = require('multer');
const upload = multer({ dest: 'uploads/',  });

router.post(
  "/signup",
  Validation.companySignup(),
  Responder.validate.bind(Responder),
  companiesController.signup.bind(companiesController)
);

router.post(
  "/editProfile",
  upload.single('file'), // Use multer to parse FormData
  // Validation.companyEditProfile(), // Add validation for editProfile
  // Responder.validate.bind(Responder),
  companiesController.editProfile.bind(companiesController)
);

router.post(
  "/login",
  Validation.login(), // Add validation for login
  Responder.validate.bind(Responder),
  companiesController.login.bind(companiesController)
);

router.get("/:companyId", companiesController.getCompanyById);

module.exports = router;
