require("module-alias/register");
const express = require("express");
const router = express.Router();
const companiesController = require("@controllers/companies");
const Validation = require("@validation");
const Responder = require("@service/responder");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post(
  "/signup",
  Validation.companySignup(),
  Responder.validate.bind(Responder),
  companiesController.signup.bind(companiesController)
);

router.post(
  "/editProfile",
  upload.single("file"),
  // Validation.companyEditProfile(),
  // Responder.validate.bind(Responder),
  companiesController.editProfile.bind(companiesController)
);

router.post(
  "/login",
  Validation.login(),
  Responder.validate.bind(Responder),
  companiesController.login.bind(companiesController)
);

router.get("/:companyId", companiesController.getCompanyById);

module.exports = router;
