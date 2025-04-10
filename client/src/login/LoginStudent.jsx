import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { Link } from "react-router-dom";

const LoginStudent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Handle email change and validate email format
  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    // Simple email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailValue)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailError && email && password) {
      try {
        const response = await fetch(
          "http://localhost:4000/api/candidates/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Login response data:", data); // Log the response data
          setMessage("Login successful.");
          // Save user session (e.g., token) in localStorage or cookies
          const token = data.message.token; // Access the token correctly
          localStorage.setItem("userToken", token);
          localStorage.setItem("userRole", "candidate"); // Set the role
          localStorage.setItem("keepLoggedIn", JSON.stringify(true)); // Set the keepLoggedIn flag
          console.log("Token stored in localStorage:", token); // Log the token
          // Navigate to profile page
          navigate("/home");
          window.location.reload();
        } else {
          const errorData = await response.json();
          setMessage(
            `Failed to login. ${errorData.message || "Please try again."}`
          );
        }
      } catch (error) {
        console.error("Error during login:", error);
        setMessage("Failed to login. Please try again.");
      }
    }
  };

  return (
    <div className="signup">
      <h2>Login</h2>
      <form className="signupForm" onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            autoComplete="off"
            placeholder="Enter your Email"
            value={email}
            onChange={handleEmailChange}
          />
          {emailError && <p className="error">{emailError}</p>}
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            autoComplete="off"
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
          />
          <button
            type="submit"
            className="btn btn-success"
            disabled={!email || !password || emailError}
          >
            Login
          </button>
        </div>
        {message && <p className="message">{message}</p>}
        <div className="login">
          <p>Don't have an account?</p>
          <Link to="/signup/professional" className="btn btn-primary">
            Sign Up
          </Link>
        </div>
        <div className="login">
          <p>Forgot your password?</p>
          <Link to="/forgot-password" className="btn btn-primary">
            Reset Password
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginStudent;
