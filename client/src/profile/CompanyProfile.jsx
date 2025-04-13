import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import useLocationAutocomplete from "./UseLocationAutoComplete";
import "./companyprofile.css";

const CompanyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    companyId: "",
    companyName: "",
    location: "",
    about: "",
    numberOfEmployees: "",
    website: "",
    logo: null,
    contactEmail: "",
    contactPhone: "",
  });

  const [errors, setErrors] = useState({});
  const [originalProfile, setOriginalProfile] = useState(profile);
  const [locationQuery, setLocationQuery] = useState("");
  const locationSuggestions = useLocationAutocomplete(locationQuery);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("userToken");
      const companyId = jwtDecode(token)?.company?.id;
      console.log("Decoded companyId:", companyId);

      if (!companyId) {
        console.error("Company ID not found in token.");
        return;
      }

      console.log("Decoded companyId:", companyId);

      try {
        const response = await fetch(
          `http://localhost:4000/api/companies/${companyId}`,
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
        console.log("Fetched profile data:", data);

        // Ensure data and message exist
        const profileData = data?.message || {};
        console.log(profileData);

        const normalized = {
          ...profileData,
          companyId: profileData.companyId || "",
          companyName: profileData.companyName || "",
          location: profileData.location || "",
          about: profileData.about || "",
          numberOfEmployees: profileData.numberOfEmployees || "",
          website: profileData.website || "",
          logo: profileData.logo || null,
          contactEmail: profileData.contactEmail || "",
          contactPhone: profileData.contactPhone || "",
        };

        setProfile(normalized);
        setOriginalProfile(normalized);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, []);

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
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        logo: file,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        logo: "",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        logo: "Only PNG and JPEG files are accepted",
      }));
    }
  };

  const handleLocationChange = (e) => {
    const { value } = e.target;
    setLocationQuery(value);
    setProfile((prevProfile) => ({
      ...prevProfile,
      location: value,
    }));
  };

  const handleLocationSelect = (location) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      location: location.display_name,
    }));
    setLocationQuery("");
  };

  const validate = () => {
    const newErrors = {};
    const genericEmailDomains = [
      "gmail.com",
      "hotmail.com",
      "yahoo.com",
      "outlook.com",
    ];

    if (!profile.companyName) {
      newErrors.companyName = "Company Name is required";
    }
    if (!profile.location) {
      newErrors.location = "Location is required";
    }
    if (!profile.about) {
      newErrors.about = "About is required";
    } else if (profile.about.length > 2600) {
      newErrors.about = "About section cannot exceed 2600 characters";
    }
    if (!profile.numberOfEmployees) {
      newErrors.numberOfEmployees = "Number of Employees is required";
    }
    if (!profile.website) {
      newErrors.website = "Website is required";
    } else if (!/^https?:\/\/[^\s$.?#].[^\s]*$/.test(profile.website)) {
      newErrors.website = "Invalid website URL";
    }
    if (!profile.contactEmail) {
      newErrors.contactEmail = "Contact Email is required";
    } else if (
      genericEmailDomains.some((domain) =>
        profile.contactEmail.endsWith(domain)
      )
    ) {
      newErrors.contactEmail = "Please use company email address";
    }
    if (!profile.contactPhone) {
      newErrors.contactPhone = "Contact Phone is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      const formData = new FormData();
      console.log("Form data before appending:", profile);
      formData.append("companyId", profile.id);
      formData.append("location", profile.location);
      formData.append("about", profile.about);
      formData.append("numberOfEmployees", profile.numberOfEmployees);
      formData.append("website", profile.website);
      formData.append("contactEmail", profile.contactEmail);
      formData.append("contactPhone", profile.contactPhone);
      if (profile.logo) {
        formData.append("file", profile.logo);
      }

      // Log formData entries for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await fetch(
        "http://localhost:4000/api/companies/editProfile",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        setIsEditing(false);
        window.alert("Profile updated successfully");
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Failed to update profile:", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="company-profile">
      <div className="profile-header">
        <h2>Company Profile</h2>
        <div className="header-actions">
          {/* {profile.logo && (
            <img
              src={URL.createObjectURL(profile.logo)}
              alt="Company Logo"
              className="company-logo"
            />
          )} */}
          <button
            className="edit-button"
            onClick={handleEditClick}
            disabled={isEditing}
          >
            <i className="bi bi-pen"></i> Edit
          </button>
        </div>
      </div>
      <div className="profile-section">
        <label>Company Name:</label>
        {isEditing ? (
          <div>
            <input
              type="text"
              name="companyName"
              value={profile.companyName}
              onChange={handleChange}
              disabled
            />
            {errors.companyName && (
              <p className="error">{errors.companyName}</p>
            )}
          </div>
        ) : (
          <p>{profile.companyName}</p>
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
              required
            />
            {locationSuggestions.length > 0 && (
              <ul className="location-suggestions">
                {locationSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleLocationSelect(suggestion)}
                  >
                    {suggestion.display_name}
                  </li>
                ))}
              </ul>
            )}
            {errors.location && <p className="error">{errors.location}</p>}
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
              onChange={handleChange}
              maxLength="2600"
              required
            />
            {errors.about && <p className="error">{errors.about}</p>}
          </div>
        ) : (
          <p>{profile.about}</p>
        )}
      </div>
      <div className="profile-section">
        <label>Number of Employees:</label>
        {isEditing ? (
          <div>
            <select
              name="numberOfEmployees"
              value={profile.numberOfEmployees}
              onChange={handleChange}
              required
            >
              <option value="">Select number of employees</option>
              <option value="1-10">1-10</option>
              <option value="10-50">10-50</option>
              <option value="50-200">50-200</option>
              <option value="200-1000">200-1000</option>
              <option value="1000-10k">1000-10k</option>
              <option value="over 10k">Over 10k</option>
            </select>
            {errors.numberOfEmployees && (
              <p className="error">{errors.numberOfEmployees}</p>
            )}
          </div>
        ) : (
          <p>{profile.numberOfEmployees}</p>
        )}
      </div>
      <div className="profile-section">
        <label>Website:</label>
        {isEditing ? (
          <div>
            <input
              type="url"
              name="website"
              value={profile.website}
              onChange={handleChange}
              required
            />
            {errors.website && <p className="error">{errors.website}</p>}
          </div>
        ) : (
          <a
            href={profile.website}
            target="_blank"
            rel="noopener noreferrer"
            className="view-resume-link"
          >
            {" "}{profile.website} 
          </a>
        )}
      </div>
      <div className="profile-section">
        <label>Logo:</label>
        {isEditing ? (
          <div>
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={handleLogoChange}
            />
            <p className="file-info">Accepted file types: PNG, JPEG</p>
            {errors.logo && <p className="error">{errors.logo}</p>}
          </div>
        ) : 
         null
        }
         <img
            src={profile.logo}
            alt="Company Logo"
            className="company-logo"
          />
      </div>
      <div className="profile-section">
        <label>Contact Email:</label>
        {isEditing ? (
          <div>
            <input
              type="email"
              name="contactEmail"
              value={profile.contactEmail}
              onChange={handleChange}
              required
            />
            {errors.contactEmail && (
              <p className="error">{errors.contactEmail}</p>
            )}
          </div>
        ) : (
          <p>{profile.contactEmail}</p>
        )}
      </div>
      <div className="profile-section">
        <label>Contact Phone:</label>
        {isEditing ? (
          <div>
            <input
              type="tel"
              name="contactPhone"
              value={profile.contactPhone}
              onChange={handleChange}
              required
            />
            {errors.contactPhone && (
              <p className="error">{errors.contactPhone}</p>
            )}
          </div>
        ) : (
          <p>{profile.contactPhone}</p>
        )}
      </div>
      {isEditing && (
        <div className="button-group">
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

export default CompanyProfile;
