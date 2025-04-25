import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";

const LoginRecruiter = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const forbiddenDomains = ["gmail.com", "yahoo.com", "hotmail.com"];

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    // Simple email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailDomain = emailValue.split("@")[1];
    if (!emailPattern.test(emailValue)) {
      setEmailError("Please enter a valid email address.");
    } else if (forbiddenDomains.includes(emailDomain)) {
      setEmailError("Please use a company email address.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailError && email && password) {
      try {
        const response = await fetch(
          "http://52.15.87.230:4000/api/companies/login",
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
          setMessage("Login successful.");
          const token = data.message.token;
          localStorage.setItem("userToken", token);
          localStorage.setItem("userRole", "recruiter");
          localStorage.setItem("keepLoggedIn", JSON.stringify(true));
          navigate("/home");
          window.location.reload();
        } else {
          const errorData = await response.json();
          setMessage(
            `Failed to login. ${errorData.message || "Please try again."}`
          );
        }
      } catch (error) {
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
          <Link to="/signup/recruiter" className="btn btn-primary">
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

export default LoginRecruiter;
