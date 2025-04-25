import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./resetpassword.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {}, [token]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      const response = await fetch(
        `http://52.15.87.230:4000/api/auth/reset-password/${token}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      if (response.ok) {
        setMessage("Password has been reset successfully.");
        setTimeout(() => {
          navigate("/");
        }, 5000);
      } else {
        setMessage("Failed to reset password. Please try again.");
      }
    } catch (error) {
      setMessage("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="reset-password">
      <h2>Reset Password</h2>
      <form className="resetPasswordForm" onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            autoComplete="off"
            placeholder="Enter new password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            autoComplete="off"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
        </div>
        <button type="submit" className="btn btn-success">
          Reset Password
        </button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
