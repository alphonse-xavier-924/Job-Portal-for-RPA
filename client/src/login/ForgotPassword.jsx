import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./forgotpassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://52.15.87.230:4000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        setMessage(
          "If an account with this email exists, you will receive a password reset link shortly"
        );
        setTimeout(() => {
          navigate("/");
        }, 5000);
      } else {
        setMessage(
          "If an account with this email exists, you will receive a password reset link shortly"
        );
        setTimeout(() => {
          navigate("/");
        }, 5000);
      }
    } catch (error) {
      setMessage("Failed to send password reset link. Please try again.");
    }
  };

  return (
    <div className="forgot-password">
      <h2>Forgot Password</h2>
      <form className="forgotPasswordForm" onSubmit={handleSubmit}>
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
          <button type="submit" className="btn btn-success">
            Send Reset Link
          </button>
        </div>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
