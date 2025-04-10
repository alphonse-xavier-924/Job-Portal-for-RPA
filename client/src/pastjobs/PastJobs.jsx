import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./pastjobs.css";

const PastJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("userToken");
      const companyId = jwtDecode(token)?.company?.id;

      if (!companyId) {
        setError("Company ID not found in token.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:4000/api/jobs/company/${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch jobs: ${response.statusText}`);
        }

        const data = await response.json();
        setJobs(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const toggleJobStatus = async (jobId) => {
    const token = localStorage.getItem("userToken");

    try {
      const response = await fetch(
        `http://localhost:4000/api/jobs/toggleStatus/${jobId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update job status: ${response.statusText}`);
      }

      const updatedJob = await response.json();
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId
            ? { ...job, isActive: updatedJob.data.isActive }
            : job
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const viewApplications = (jobId) => {
    navigate(`/applications/${jobId}`);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="past-jobs-container">
      <h1>Past Jobs</h1>
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job._id}>
              <h2>{job.jobTitle}</h2>
              <p>{job.description}</p>
              <p>Years of Experience: {job.yrsofExperience}</p>
              <p>
                Salary: {job.salaryStart} - {job.salaryEnd}
              </p>
              <p>Location: {job.jobLocation}</p>
              <p>Role Type: {job.roleType}</p>
              <p>Skills: {job.skills.join(", ")}</p>
              <p>Veteran: {job.veteran ? "Yes" : "No"}</p>
              <p>Disabilities: {job.disabilities ? "Yes" : "No"}</p>
              <button
                className={`toggle-status-btn ${
                  job.isActive ? "active" : "inactive"
                }`}
                onClick={() => toggleJobStatus(job._id)}
              >
                {job.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                className="view-applications-btn"
                onClick={() => viewApplications(job._id)}
              >
                View Applications
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PastJobs;
