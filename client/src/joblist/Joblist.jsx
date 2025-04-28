import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./joblist.css";

const Joblist = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [coverLetters, setCoverLetters] = useState({});
  const handleCoverLetterChange = (e, jobId) => {
    const file = e.target.files[0];

    setCoverLetters((prev) => ({ ...prev, [jobId]: file }));
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          "http://52.15.87.230:4000/api/jobs/active-jobs"
        );
        const data = await response.json();
        setJobs(data);
      } catch (error) {}
    };

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
      } catch (error) {}
    };

    fetchJobs();
    fetchAppliedJobs();
  }, []);

  const handleApply = async (jobId, companyId) => {
    if (hasApplied(jobId)) {
      return;
    }

    const token = localStorage.getItem("userToken");
    const candidateId = jwtDecode(token).candidate.id;

    const coverLetterFile = coverLetters[jobId];

    const formData = new FormData();

    formData.append("candidateId", candidateId);

    formData.append("jobId", jobId);

    formData.append("companyId", companyId._id);

    formData.append("resume", "path/to/resume.pdf");

    if (coverLetterFile) {
      formData.append("file", coverLetterFile);
    }

    setAppliedJobs((prev) => [...prev, { jobId: { _id: jobId } }]);

    try {
      const response = await fetch(
        "http://52.15.87.230:4000/api/job-applications/create",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

  //     // Revert the optimistic update if an error occurs
  //     setAppliedJobs((prevAppliedJobs) =>
  //       prevAppliedJobs.filter((application) => application.jobId._id !== jobId)
  //     );
  //   }
  // };

  const handleApply = async (jobId, companyId) => {
    if (hasApplied(jobId)) return;
    console.log("companyId:", companyId);
  
    const token = localStorage.getItem("userToken");
    const candidateId = jwtDecode(token).candidate.id;
    const coverLetterFile = coverLetters[jobId];
  
    const formData = new FormData();
    formData.append("candidateId", candidateId);
    formData.append("jobId", jobId);
    formData.append("companyId", companyId._id);
    formData.append("resume", "path/to/resume.pdf"); // Replace with actual resume logic
    if (coverLetterFile) {
      formData.append("file", coverLetterFile);
    }
  
    setAppliedJobs((prev) => [...prev, { jobId: { _id: jobId } }]);
  
    try {
      const response = await fetch("http://localhost:4000/api/job-applications/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      const data = await response.json();
      if (response.ok) {
      } else {
        setAppliedJobs((prevAppliedJobs) =>
          prevAppliedJobs.filter(
            (application) => application.jobId._id !== jobId
          )
        );
      }
    } catch (error) {
      setAppliedJobs((prevAppliedJobs) =>
        prevAppliedJobs.filter((application) => application.jobId._id !== jobId)
      );
    }
  };

  const handleWithdraw = async (jobId) => {
    const token = localStorage.getItem("userToken");
    const candidateId = jwtDecode(token).candidate.id;

    try {
      const response = await fetch(
        `http://52.15.87.230:4000/api/job-applications/candidate/${candidateId}/withdraw/${jobId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setAppliedJobs((prevAppliedJobs) =>
          prevAppliedJobs.filter(
            (application) => application.jobId._id !== jobId
          )
        );
      } else {
        const data = await response.json();
      }
    } catch (error) {}
  };

  const hasApplied = (jobId) => {
    return appliedJobs.some((application) => application.jobId._id === jobId);
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
              <div>
                <button style={{ backgroundColor: "green" }}>
                  Already Applied
                </button>
                <button
                  style={{ backgroundColor: "red", marginLeft: "10px" }}
                  onClick={() => handleWithdraw(job._id)}
                >
                  Withdraw
                </button>
              </div>
            ) : (
              <div>
                <p>
                  <strong>Upload Cover Leter: </strong>

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleCoverLetterChange(e, job._id)}
                  />
                </p>
                <button onClick={() => handleApply(job._id, job.companyId)}>
                  Apply
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Joblist;
