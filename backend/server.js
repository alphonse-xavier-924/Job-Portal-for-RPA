require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const connectDB = require("./config/database");
const candidatesRoutes = require("./routes/candidates");
const companiesRoutes = require("./routes/companies");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const jobApplicationsRoutes = require("./routes/jobApplications");
const path = require("path");

const app = express();
app.use(cors());

app.use(express.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(
  session({
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 14 * 24 * 60 * 60,
    }),
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    cookie: { secure: false, maxAge: 1209600000 },
    resave: true,
    saveUninitialized: true,
    retryWrites: false,
  })
);

connectDB();

app.get("/api", (req, res) => {
  res.json({ message: "No Page found" });
});

app.use("/api/candidates", candidatesRoutes);
app.use("/api/companies", companiesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/job-applications", jobApplicationsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
