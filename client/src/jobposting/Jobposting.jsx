import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./jobposting.css";

const Jobposting = () => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    yearsOfExperience: "",
    salaryFrom: "",
    salaryTo: "",
    skills: [],
    roleType: "Full Time",
    jobLocation: "Hybrid",
    sponsorship: false,
    veteran: false,
    disabilities: false,
  });

  const [skill, setSkill] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSkillChange = (e) => {
    setSkill(e.target.value);
  };

  const addSkill = () => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
      setSkill("");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.jobDescription.length < 500) {
      newErrors.jobDescription =
        "Job description must be at least 500 characters.";
    }
    if (!/^\d+$/.test(formData.salaryFrom)) {
      newErrors.salaryFrom = "Salary must be a number.";
    }
    if (!/^\d+$/.test(formData.salaryTo)) {
      newErrors.salaryTo = "Salary must be a number.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const token = localStorage.getItem("userToken");
        const decodedToken = jwtDecode(token);
        const companyId = decodedToken.company.id;

        const response = await fetch(
          "http://52.15.87.230:4000/api/jobs/post-job",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              companyId: companyId, // Use the captured company ID
              jobTitle: formData.jobTitle,
              description: formData.jobDescription,
              yrsofExperience: formData.yearsOfExperience,
              salaryFrom: formData.salaryFrom,
              salaryTo: formData.salaryTo,
              skills: formData.skills,
              roleType: formData.roleType,
              jobLocation: formData.jobLocation,
              sponsorship: formData.sponsorship,
              veteran: formData.veteran,
              disabilities: formData.disabilities,
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          alert("Failed to post job. Please try again.");
          return;
        }

        const result = await response.json();
        alert("Job posted successfully!");
        navigate("/recruiter/pastjobs"); // Redirect to Jobs History page
      } catch (error) {
        alert("Failed to post job. Please try again.");
      }
    }
  };

  return (
    <div className="jobposting-container">
      <h2>Post a Job</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Job Title:</label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Job Description:</label>
          <textarea
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
          />
          {errors.jobDescription && (
            <div className="error">{errors.jobDescription}</div>
          )}
        </div>
        <div className="form-group">
          <label>Years of Experience:</label>
          <input
            type="text"
            name="yearsOfExperience"
            value={formData.yearsOfExperience}
            onChange={handleChange}
          />
        </div>
        <div className="form-group salary-range">
          <div>
            <label>Salary From:</label>
            <input
              type="text"
              name="salaryFrom"
              value={formData.salaryFrom}
              onChange={handleChange}
            />
            {errors.salaryFrom && (
              <div className="error">{errors.salaryFrom}</div>
            )}
          </div>
          <div>
            <label>Salary To:</label>
            <input
              type="text"
              name="salaryTo"
              value={formData.salaryTo}
              onChange={handleChange}
            />
            {errors.salaryTo && <div className="error">{errors.salaryTo}</div>}
          </div>
        </div>
        <div className="form-group skills-input">
          <input type="text" value={skill} onChange={handleSkillChange} />
          <button type="button" onClick={addSkill}>
            Add Skill
          </button>
        </div>
        <ul className="skills-list">
          {formData.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
        <div className="form-group">
          <label>Role Type:</label>
          <select
            name="roleType"
            value={formData.roleType}
            onChange={handleChange}
          >
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Contract">Contract</option>
            <option value="Intern">Intern</option>
          </select>
        </div>
        <div className="form-group">
          <label>Job Location:</label>
          <select
            name="jobLocation"
            value={formData.jobLocation}
            onChange={handleChange}
          >
            <option value="Remote">Remote</option>
            <option value="Onsite">Onsite</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
        <div className="form-group checkbox-group">
          <div className="checkbox-item">
            <input
              type="checkbox"
              name="veteran"
              checked={formData.veteran}
              onChange={handleChange}
            />
            <label>Are you a veteran?</label>
          </div>

          <div className="checkbox-item">
            <input
              type="checkbox"
              name="disabilities"
              checked={formData.disabilities}
              onChange={handleChange}
            />
            <label>Do you have any disabilities?</label>
          </div>
        </div>
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
};

export default Jobposting;
