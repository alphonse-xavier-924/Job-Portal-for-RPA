import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./joblist.css";

const Joblist = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/jobs/active-jobs"
        );
        const data = await response.json();
        console.log("Fetched jobs:", data);
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    const fetchAppliedJobs = async () => {
      const token = localStorage.getItem("userToken");
      const candidateId = jwtDecode(token).candidate.id;

      try {
        const response = await fetch(
          `http://localhost:4000/api/job-applications/candidate/${candidateId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log("Fetched applied jobs:", data);
        setAppliedJobs(data);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    };

    fetchJobs();
    fetchAppliedJobs();
  }, []);

  const handleApply = async (jobId, companyId) => {
    console.log("Applying to job:", jobId);
    console.log("Decoded companyId:", companyId);

    const token = localStorage.getItem("userToken");
    const candidateId = jwtDecode(token).candidate.id;

    console.log("Decoded candidateId:", candidateId);

    const resume = "path/to/resume.pdf"; // Replace with actual resume path
    const coverLetter = "Cover letter content"; // Replace with actual cover letter content

    try {
      const response = await fetch(
        "http://localhost:4000/api/job-applications/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            candidateId,
            jobId,
            companyId,
            resume,
            coverLetter,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Application submitted successfully:", data);
        setAppliedJobs([...appliedJobs, { jobId }]); // Update applied jobs state
      } else {
        console.error("Failed to submit application:", data);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };

  const hasApplied = (jobId) => {
    return appliedJobs.some((application) => application.jobId === jobId);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="joblist-container">
      <h2>Job Listings</h2>
      <div className="joblist">
        {jobs.map((job) => (
          <div key={job._id} className="job-card">
            <h3>{job.jobTitle}</h3>
            <p>{job.description}</p>
            <p>
              <strong>Required Experience:</strong> {job.yrsofExperience} years
            </p>
            <p>
              <strong>Salary:</strong> ${job.salaryStart} - ${job.salaryEnd}
            </p>
            <p>
              <strong>Location:</strong> {job.jobLocation}
            </p>
            <p>
              <strong>Company:</strong> {job.companyId.companyName}
            </p>
            <p>
              <strong>Required Skills:</strong> {job.skills.join(", ")}
            </p>
            <p>
              <strong>Posted on:</strong> {formatDate(job.createdAt)}
            </p>
            {hasApplied(job._id) ? (
              <button style={{ backgroundColor: "green" }}>
                Already Applied
              </button>
            ) : (
              <button onClick={() => handleApply(job._id, job.companyId)}>
                Apply
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Joblist;
