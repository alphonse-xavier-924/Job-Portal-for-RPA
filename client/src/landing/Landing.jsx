import React from "react";
import "./landing.css";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="landing">
      <div className="overlay">
        <h1>Welcome to the OneStop Job Portal</h1>
        <h3>Your Gateway to Top RPA Jobs & Talent!</h3>
        <div className="choice">
          <Link to="/login/professional" className="btn btn-success">
            Job Seeker
          </Link>
          <Link to="/login/recruiter" className="btn btn-success">
            Recruiter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;