import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./viewapplications.css";

const ViewApplications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState({});
  const [ jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("userToken");

      try {
        const response = await fetch(
          `http://localhost:4000/api/job-applications/job/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch applications: ${response.statusText}`
          );
        }

        const data = await response.json();
        setApplications(data.applications);
        setJobTitle(data.job.jobTitle);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);

  const updateStatus = async (applicationId, newStatus) => {
    const token = localStorage.getItem("userToken");

    try {
      const response = await fetch(
        `http://localhost:4000/api/job-applications/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.statusText}`);
      }

      const updatedApplication = await response.json();
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application._id === applicationId
            ? { ...application, status: updatedApplication.status }
            : application
        )
      );
      setUpdateMessage((prevMessages) => ({
        ...prevMessages,
        [applicationId]: "Status updated successfully",
      }));
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="applications-container">
      <h1>Applications for : { jobTitle }</h1>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <ul>
          {applications.map((application) => (
            <li key={application._id}>
              <p>
                <strong>Candidate Name:</strong> {application.candidateId.name}
              </p>
              <p>
                <strong>Status:</strong>
                <select
                  value={application.status}
                  onChange={(e) =>
                    setApplications((prevApplications) =>
                      prevApplications.map((app) =>
                        app._id === application._id
                          ? { ...app, status: e.target.value }
                          : app
                      )
                    )
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Hired">Hired</option>
                </select>
                <button
                  onClick={() =>
                    updateStatus(application._id, application.status)
                  }
                >
                  Update
                </button>
              </p>
              {updateMessage[application._id] && (
                <p className="update-message">
                  {updateMessage[application._id]}
                </p>
              )}
              <p>
                <strong>Resume:</strong>{" "}
                <a
                  href={application.candidateId.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download {application.candidateId.name}'s Resume
                </a>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewApplications;
