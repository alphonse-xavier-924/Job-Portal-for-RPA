import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./applications.css";

const Applications = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const token = localStorage.getItem("userToken");
      const candidateId = jwtDecode(token).candidate.id;

      try {
        const response = await fetch(
          `http://52.15.87.230:4000/api/job-applications/candidate/${candidateId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setAppliedJobs(data);
      } catch (error) {
      }
    };

    fetchAppliedJobs();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="applications-container">
      <h2>My Applications</h2>
      <div className="applications-list">
        {appliedJobs.map((application) => (
          <div key={application._id} className="application-card">
            <h3>{application.jobId.jobTitle}</h3>
            <p>
              <strong>Company:</strong> {application.companyId.companyName}
            </p>
            <p>
              <strong>Status:</strong> {application.status}
            </p>
            <p>
              <strong>Applied on:</strong> {formatDate(application.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Applications;
