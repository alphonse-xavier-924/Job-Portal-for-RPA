import React, { useState } from "react";
import "./signup.css";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";

const SignupRecruiter = () => {
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rePasswordError, setRePasswordError] = useState("");
  const [message, setMessage] = useState("");

  const forbiddenDomains = ["gmail.com", "yahoo.com", "hotmail.com"];

  const handleCompanyNameChange = (e) => {
    setCompanyName(e.target.value);
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    const emailDomain = emailValue.split("@")[1];
    if (forbiddenDomains.includes(emailDomain)) {
      setError("Please use a company email address.");
    } else {
      setError("");
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
      return "Password must be at least 8 characters long.";
    } else if (!hasNumber.test(password)) {
      return "Password must contain at least one number.";
    } else if (!hasSpecialChar.test(password)) {
      return "Password must contain at least one special character.";
    } else {
      return "";
    }
  };

  const handlePasswordChange = (e) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);

    if (passwordValue.length > 0) {
      const validationError = validatePassword(passwordValue);
      setPasswordError(validationError);
    } else {
      setPasswordError("");
    }

    if (rePassword.length > 0 && passwordValue !== rePassword) {
      setRePasswordError("Passwords do not match.");
    } else {
      setRePasswordError("");
    }
  };

  const handleRePasswordChange = (e) => {
    const rePasswordValue = e.target.value;
    setRePassword(rePasswordValue);

    if (rePasswordValue !== password) {
      setRePasswordError("Passwords do not match.");
    } else {
      setRePasswordError("");
    }
  };

  const isFormValid = () => {
    return (
      companyName.trim() !== "" &&
      companyEmail.trim() !== "" &&
      password.trim() !== "" &&
      rePassword.trim() !== "" &&
      !error &&
      !passwordError &&
      !rePasswordError
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid()) {
      try {
        const response = await fetch(
          "http://localhost:4000/api/companies/signup",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              companyName,
              companyEmail,
              password,
            }),
          }
        );

        if (response.ok) {
          setMessage("Signup successful.");
        } else if (response.status === 404) {
          setMessage("Signup failed. Endpoint not found.");
        } else {
          const errorData = await response.json();
          setMessage(
            `Signup failed. ${errorData.message || "Please try again."}`
          );
        }
      } catch (error) {
        console.error("Error during signup:", error);
        setMessage("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="signup">
      <h2>Sign Up</h2>
      <form className="signupForm" onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label htmlFor="name">Company Name:</label>
          <input
            type="text"
            id="name"
            autoComplete="off"
            placeholder="Enter your company's name"
            value={companyName}
            onChange={handleCompanyNameChange}
          />
          <label htmlFor="email">Company Email Address:</label>
          <input
            type="email"
            id="email"
            autoComplete="off"
            placeholder="Enter your Email"
            value={companyEmail}
            onChange={handleEmailChange}
          />
          {error && <p className="error">{error}</p>}
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            autoComplete="off"
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
            data-tooltip-id="password-tooltip"
          />
          <Tooltip id="password-tooltip" place="right" effect="solid">
            Password must be at least 8 characters long, contain at least one
            number, and one special character.
          </Tooltip>
          {passwordError && <p className="error">{passwordError}</p>}
          <label htmlFor="re-password">Re-enter your Password:</label>
          <input
            type="password"
            id="re-password"
            autoComplete="off"
            placeholder="Re-enter your password"
            value={rePassword}
            onChange={handleRePasswordChange}
          />
          {rePasswordError && <p className="error">{rePasswordError}</p>}
          <button
            type="submit"
            className="btn btn-success"
            disabled={!isFormValid()} // Disable button if form is invalid
          >
            Sign Up
          </button>
        </div>
        {message && <p className="message">{message}</p>}
        <div className="login">
          <p>Already have an account?</p>
          <Link to="/login/recruiter" className="btn btn-primary">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignupRecruiter;
