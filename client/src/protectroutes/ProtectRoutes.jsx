import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
