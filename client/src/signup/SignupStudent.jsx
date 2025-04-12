import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";

const SignupStudent = () => {
  // State variables
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rePasswordError, setRePasswordError] = useState("");
  const [message, setMessage] = useState("");

  // Navigate hook for navigation
  const navigate = useNavigate();

  // Handle email change
  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
  };

  // Validate password
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

  // Handle password change
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

  // Handle re-entered password change
  const handleRePasswordChange = (e) => {
    const rePasswordValue = e.target.value;
    setRePassword(rePasswordValue);

    if (rePasswordValue !== password) {
      setRePasswordError("Passwords do not match.");
    } else {
      setRePasswordError("");
    }
  };

  // Check if all fields are valid
  const isFormValid = () => {
    return (
      name.trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      rePassword.trim() !== "" &&
      !passwordError &&
      !rePasswordError
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid()) {
      try {
        const response = await fetch(
          "http://localhost:4000/api/candidates/signup",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          setMessage(
            `Failed to sign up. ${errorData.message || "Please try again."}`
          );
        } else {
          const data = await response.json();
          setMessage("Signup successful.");
          // Navigate to login page after 2 seconds
          setTimeout(() => {
            navigate("/login/professional");
          }, 2000);
        }
      } catch (error) {
        console.error("Error during signup:", error);
        setMessage("Failed to sign up. Please try again.");
      } finally {
        // Clear form fields
        setName("");
        setEmail("");
        setPassword("");
        setRePassword("");
      }
    }
  };

  return (
    <div className="signup">
      <h2>Sign Up</h2>
      <form className="signupForm" onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            autoComplete="off"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            autoComplete="off"
            placeholder="Enter your Email"
            value={email}
            onChange={handleEmailChange}
          />
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
          <Link to="/login/professional" className="btn btn-primary">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignupStudent;
