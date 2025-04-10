const express = require("express");
const router = express.Router();
const candidates = require("./candidates");
const companies = require("./companies");
const forgotPassword = require("./authRoutes");

router.use("/candidates", candidates);
router.use("/companies", companies);
router.use("/forgotpassword", forgotPassword);

module.exports = router;
