import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.css";

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.clear();
    logout();
    window.location.href = "http://52.15.87.230:3000";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          OneStop
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {auth.isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link" to="/home">
                  Home
                </Link>
              </li>
            )}
            {auth.isAuthenticated && auth.role === "candidate" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/professional/jobs">
                    Jobs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/professional/applications">
                    My Applications
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/professional/profile">
                    My Profile
                  </Link>
                </li>
              </>
            )}
            {auth.isAuthenticated && auth.role === "recruiter" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/recruiter/pastjobs">
                    Jobs History
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/recruiter/jobposting">
                    Post Job
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/recruiter/profile">
                    Company Profile
                  </Link>
                </li>
              </>
            )}
            {auth.isAuthenticated ? (
              <li className="nav-item">
                <button className="nav-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
