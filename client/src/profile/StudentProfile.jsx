import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Select from "react-select";
import "./studentprofile.css";
import { jobTitles } from "./jobTitles";
import useLocationAutocomplete from "./UseLocationAutoComplete";

const rpaTools = [
  "UiPath",
  "Automation Anywhere",
  "Blue Prism",
  "Pega",
  "WorkFusion",
  "Kofax",
  "NICE",
  "Microsoft Power Automate",
  "Kryon",
  "AntWorks",
  "EdgeVerve",
  "HelpSystems",
  "Softomotive",
  "Redwood",
  "AutomationEdge",
];
const rpaToolOptions = rpaTools.map((tool) => ({ value: tool, label: tool }));

const StudentProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [profile, setProfile] = useState({
    currentJobTitle: "",
    jobTitle: "",
    location: "",
    about: "",
    experience: [],
    education: [],
    certifications: "",
    links: { github: "", medium: "", other: "" },
    rpaSkills: [],
    otherSkills: [],
    resume: null,
  });
  const [errors, setErrors] = useState({});
  const [locationQuery, setLocationQuery] = useState("");
  const locationSuggestions = useLocationAutocomplete(locationQuery);
  const [jobTitleQuery, setJobTitleQuery] = useState("");
  const filteredJobTitles = jobTitles.filter((title) =>
    title.toLowerCase().includes(jobTitleQuery.toLowerCase())
  );
  const [originalProfile, setOriginalProfile] = useState(profile);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("userToken");
    const candidateId = jwtDecode(token)?.candidate?.id;

    if (!candidateId) {
      return;
    }

    try {
      const response = await fetch(
        `http://52.15.87.230:4000/api/candidates/${candidateId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      const data = await response.json();

      const profileData = data?.message || {};

      const normalized = {
        ...profileData,
        jobTitle: profileData.currentJobTitle || "",
        currentJobTitle: profileData.currentJobTitle || "",
        certifications: profileData.certifications || "",
        resume: profileData.resume || null,
        experience: Array.isArray(profileData.experience)
          ? profileData.experience.map((exp) => ({
              ...exp,
              startDate: exp.startDate
                ? new Date(exp.startDate).toISOString().split("T")[0]
                : "",
              endDate: exp.endDate
                ? new Date(exp.endDate).toISOString().split("T")[0]
                : "",
            }))
          : [],
        education: Array.isArray(profileData.education)
          ? profileData.education
          : [],
        links: profileData.links
          ? {
              github: profileData.links.github || "",
              medium: profileData.links.medium || "",
              other: profileData.links.other || "",
            }
          : { github: "", medium: "", other: "" },
        rpaSkills: Array.isArray(profileData.rpaSkills)
          ? profileData.rpaSkills
          : [],
        otherSkills: Array.isArray(profileData.otherSkills)
          ? profileData.otherSkills
          : [],
        createdAt: profileData.createdAt || "",
        updatedAt: profileData.updatedAt || "",
      };

      setProfile(normalized);
      setOriginalProfile(normalized);
    } catch (error) {}
  };

  const handleGenerateAbout = async () => {
    setIsGenerating(true); // Indicate that generation is in progress
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_HF_API_KEY}`,
          },
          body: JSON.stringify({
            inputs: `Generate professional summary for an RPA developer profile with these details: ${profile.about}`,
            parameters: {
              max_new_tokens: 150,
              temperature: 0.7,
            },
          }),
        }
      );

      const data = await response.json();
      const generatedText =
        data[0]?.generated_text || "Failed to generate text.";
      setProfile((prev) => ({ ...prev, about: generatedText }));
    } catch (error) {
      alert("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false); // Reset the generating state
    }
  };

  const handleEditClick = () => {
    setOriginalProfile(profile);
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setProfile(originalProfile);
    setIsEditing(false);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { value } = e.target;
    setLocationQuery(value);
    setProfile((prev) => ({ ...prev, location: value }));
  };

  const handleLocationSelect = (location) => {
    setProfile((prev) => ({ ...prev, location: location.display_name }));
    setLocationQuery("");
  };

  const handleJobTitleChange = (e) => {
    const { value } = e.target;
    setJobTitleQuery(value);
    setProfile((prev) => ({ ...prev, jobTitle: value }));
  };

  const handleJobTitleSelect = (title) => {
    setProfile((prev) => ({ ...prev, jobTitle: title }));
    setJobTitleQuery("");
  };

  const handleLinksChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      links: {
        ...(prev.links || { github: "", medium: "", other: "" }),
        [name]: value,
      },
    }));
  };

  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...profile.experience];
    updated[index][name] = value;
    setProfile((prev) => ({ ...prev, experience: updated }));
  };

  const handleAddExperience = () => {
    setProfile((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: "", startDate: "", endDate: "", role: "", description: "" },
      ],
    }));
  };

  const handleRemoveExperience = (index) => {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...profile.education];
    updated[index][name] = value;
    setProfile((prev) => ({ ...prev, education: updated }));
  };

  const handleAddEducation = () => {
    setProfile((prev) => ({
      ...prev,
      education: [...prev.education, { school: "", degree: "", grade: "" }],
    }));
  };

  const handleRemoveEducation = (index) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleRPASkillChange = (selected) => {
    setProfile((prev) => ({
      ...prev,
      rpaSkills: selected ? selected.map((o) => o.value) : [],
    }));
  };

  const handleAddOtherSkill = () => {
    setProfile((prev) => ({ ...prev, otherSkills: [...prev.otherSkills, ""] }));
  };

  const handleOtherSkillChange = (index, e) => {
    const updated = [...profile.otherSkills];
    updated[index] = e.target.value;
    setProfile((prev) => ({ ...prev, otherSkills: updated }));
  };

  const handleRemoveOtherSkill = (index) => {
    setProfile((prev) => ({
      ...prev,
      otherSkills: prev.otherSkills.filter((_, i) => i !== index),
    }));
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    file && /\.(pdf|doc|docx)$/i.test(file.name)
      ? setProfile((prev) => ({ ...prev, resume: file }))
      : alert("Invalid file type");
  };

  const validate = () => {
    const newErrors = {};
    (profile.experience || []).forEach((exp, i) => {
      if (!exp.company) newErrors[`experience-${i}-company`] = "Required";
      if (!exp.role) newErrors[`experience-${i}-role`] = "Required";
    });
    (profile.education || []).forEach((edu, i) => {
      if (!edu.school) newErrors[`education-${i}-school`] = "Required";
      if (!edu.degree) newErrors[`education-${i}-degree`] = "Required";
      if (!edu.grade) newErrors[`education-${i}-grade`] = "Required";
    });
    (profile.otherSkills || []).forEach((skill, i) => {
      if (skill.length < 3) newErrors[`otherSkills-${i}`] = "Too short";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      const formData = new FormData();
      formData.append("file", profile.resume);
      formData.append(
        "candidateId",
        jwtDecode(localStorage.getItem("userToken")).candidate.id
      );
      formData.append("currentJobTitle", profile.jobTitle);
      formData.append("location", profile.location);
      formData.append("about", profile.about);
      formData.append("certifications", profile.certifications);
      formData.append("links[github]", profile.links.github);
      formData.append("links[medium]", profile.links.medium);
      formData.append("links[other]", profile.links.other);
      profile.experience.forEach((exp, i) => {
        Object.entries(exp).forEach(([key, val]) =>
          formData.append(`experience[${i}][${key}]`, val)
        );
      });
      profile.education.forEach((edu, i) => {
        Object.entries(edu).forEach(([key, val]) =>
          formData.append(`education[${i}][${key}]`, val)
        );
      });
      profile.rpaSkills.forEach((skill, i) =>
        formData.append(`rpaSkills[${i}]`, skill)
      );
      profile.otherSkills.forEach((skill, i) =>
        formData.append(`otherSkills[${i}]`, skill)
      );
      const response = await fetch(
        "http://52.15.87.230:4000/api/candidates/editProfile",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          body: formData,
        }
      );
      if (response.ok) {
        const updated = await response.json();
        setProfile(updated);
        setOriginalProfile(updated);
        setIsEditing(false);
        fetchProfile();
      } else console.error("Save failed:", await response.json());
    } catch (error) {}
  };

  return (
    <div className="student-profile">
      <div className="profile-header">
        <h2>My Profile</h2>
        <button
          className="edit-button"
          onClick={handleEditClick}
          disabled={isEditing}
        >
          <i className="bi bi-pen"></i> Edit
        </button>
      </div>

      <div className="profile-section">
        <label>Job Title:</label>
        {isEditing ? (
          <div>
            <input
              type="text"
              name="jobTitle"
              placeholder="Student, Automation Intern..."
              value={profile.jobTitle}
              onChange={handleJobTitleChange}
            />
            {jobTitleQuery && (
              <ul className="job-title-suggestions">
                {filteredJobTitles.map((t, i) => (
                  <li key={i} onClick={() => handleJobTitleSelect(t)}>
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <p>{profile.currentJobTitle}</p>
        )}
      </div>

      <div className="profile-section">
        <label>Location:</label>
        {isEditing ? (
          <div>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleLocationChange}
            />
            {locationSuggestions.length > 0 && (
              <ul className="location-suggestions">
                {locationSuggestions.map((s, i) => (
                  <li key={i} onClick={() => handleLocationSelect(s)}>
                    {s.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <p>{profile.location}</p>
        )}
      </div>

      <div className="profile-section">
        <label>About:</label>
        {isEditing ? (
          <div>
            <textarea
              name="about"
              value={profile.about}
              placeholder="Tell us about yourself...(If you'd like help generating content, please enter a two sentences about yourself and click on the 'Click Generate' button below)"
              onChange={handleChange}
              maxLength="2600"
            />
            <div className="item-actions">
              <button
                type="button"
                className="generate-button"
                onClick={handleGenerateAbout}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Click Generate"}
              </button>
            </div>
          </div>
        ) : (
          <p>{profile.about}</p>
        )}
      </div>

      <div className="profile-section">
        <label>Resume:</label>
        {isEditing && (
          <>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
            />
            {errors.resume && <p className="error">{errors.resume}</p>}
          </>

        )}
        <div className="resume-spacing"></div>
        {profile.resume && (
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="view-resume-link"
          >
            Download Resume
          </a>
        )}

        {/* <button
          className="edit-button"
          onClick={(e)=> {  }}
        >
          <i className="bi bi-file-earmark-pdf"></i> View Resume 
        </button> */}
      </div>

      <div className="profile-section">
        <label>Experience:</label>
        {isEditing ? (
          <>
            {(profile.experience || []).map((exp, i) => (
              <div key={i} className="experience-item">
                <input
                  type="text"
                  name="company"
                  placeholder="Company*"
                  value={exp.company}
                  onChange={(e) => handleExperienceChange(i, e)}
                />
                {errors[`experience-${i}-company`] && (
                  <p className="error">{errors[`experience-${i}-company`]}</p>
                )}
                <input
                  type="date"
                  name="startDate"
                  value={exp.startDate}
                  onChange={(e) => handleExperienceChange(i, e)}
                />
                <input
                  type="date"
                  name="endDate"
                  value={exp.endDate}
                  onChange={(e) => handleExperienceChange(i, e)}
                />
                <input
                  type="text"
                  name="role"
                  placeholder="Role*"
                  value={exp.role}
                  onChange={(e) => handleExperienceChange(i, e)}
                />
                {errors[`experience-${i}-role`] && (
                  <p className="error">{errors[`experience-${i}-role`]}</p>
                )}
                <textarea
                  name="description"
                  placeholder="Description"
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(i, e)}
                />
                <div className="item-actions">
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(i)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="item-actions">
              <button
                type="button"
                className="add-button"
                onClick={handleAddExperience}
              >
                <i className="bi bi-plus-circle"></i> Add Experience
              </button>
            </div>
          </>
        ) : (
          (profile.experience || []).map((exp, i) => (
            <div key={i}>
              <p>Company: {exp.company}</p>
              <p>Start: {exp.startDate}</p>
              <p>End: {exp.endDate}</p>
              <p>Role: {exp.role}</p>
              <p>Description: {exp.description}</p>
            </div>
          ))
        )}
      </div>

      <div className="profile-section">
        <label>Education:</label>
        {isEditing ? (
          <>
            {(profile.education || []).map((edu, i) => (
              <div key={i} className="education-item">
                <input
                  type="text"
                  name="school"
                  placeholder="School*"
                  value={edu.school}
                  onChange={(e) => handleEducationChange(i, e)}
                />
                {errors[`education-${i}-school`] && (
                  <p className="error">{errors[`education-${i}-school`]}</p>
                )}
                <input
                  type="text"
                  name="degree"
                  placeholder="Degree*"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(i, e)}
                />
                {errors[`education-${i}-degree`] && (
                  <p className="error">{errors[`education-${i}-degree`]}</p>
                )}
                <input
                  type="text"
                  name="grade"
                  placeholder="Grade"
                  value={edu.grade}
                  onChange={(e) => handleEducationChange(i, e)}
                />
                {errors[`education-${i}-grade`] && (
                  <p className="error">{errors[`education-${i}-grade`]}</p>
                )}
                <div className="item-actions">
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(i)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="item-actions">
              <button
                type="button"
                className="add-button"
                onClick={handleAddEducation}
              >
                <i className="bi bi-plus-circle"></i> Add Education
              </button>
            </div>
          </>
        ) : (
          (profile.education || []).map((edu, i) => (
            <div key={i}>
              <p>School: {edu.school}</p>
              <p>Degree: {edu.degree}</p>
              <p>Grade: {edu.grade}</p>
            </div>
          ))
        )}
      </div>

      <div className="profile-section">
        <label>Certifications:</label>
        {isEditing ? (
          <textarea
            name="certifications"
            value={profile.certifications}
            onChange={handleChange}
          />
        ) : (
          <a

            href={profile.certifications}
            target="_blank"
            rel="noopener noreferrer"
            className="view-resume-link"

          >
            {profile.certifications}
          </a>
        )}
      </div>

      <div className="profile-section">
        <label>Links:</label>
        {isEditing ? (
          <>
            <input
              type="text"
              name="github"
              placeholder="GitHub"
              value={profile.links.github}
              onChange={handleLinksChange}
            />
            <input
              type="text"
              name="medium"
              placeholder="Medium"
              value={profile.links.medium}
              onChange={handleLinksChange}
            />
            <input
              type="text"
              name="other"
              placeholder="Other"
              value={profile.links.other}
              onChange={handleLinksChange}
            />
          </>
        ) : (
          <div>
            <p>
              GitHub:
              {/* {profile.links?.github || ""} */}
              {profile.links?.github && (
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-resume-link"
                >
                  {" "}
                  {profile.links.github}
                </a>
              )}
            </p>
            <p>
              Medium:
              {profile.links?.medium && (
                <a
                  href={profile.links.medium}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-resume-link"
                >
                  {" "}
                  {profile.links.medium}
                </a>
              )}
            </p>
            <p>
              Other:
              {profile.links?.other && (
                <a
                  href={profile.links.other}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-resume-link"
                >
                  {" "}
                  {profile.links.other}
                </a>
              )}

            </p>
          </div>
        )}
      </div>

      <div className="profile-section">
        <label>RPA Skills:</label>
        {isEditing ? (
          <Select
            isMulti
            options={rpaToolOptions}
            value={rpaToolOptions.filter((o) =>
              profile.rpaSkills.includes(o.value)
            )}
            onChange={handleRPASkillChange}
          />
        ) : (
          <ul>
            {(profile.rpaSkills || []).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="profile-section">
        <label>Other Skills:</label>
        {isEditing ? (
          <>
            {(profile.otherSkills || []).map((s, i) => (
              <div key={i} className="other-skill-item">
                <input
                  type="text"
                  value={s}
                  onChange={(e) => handleOtherSkillChange(i, e)}
                />
                <div className="item-actions">
                  <button
                    type="button"
                    onClick={() => handleRemoveOtherSkill(i)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="item-actions">
              <button
                type="button"
                className="add-button"
                onClick={handleAddOtherSkill}
              >
                <i className="bi bi-plus-circle"></i> Add Skill
              </button>
            </div>
          </>
        ) : (
          <ul>
            {(profile.otherSkills || []).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        )}
      </div>

      {isEditing && (
        <div className="button-row">
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-button" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
export default StudentProfile;
