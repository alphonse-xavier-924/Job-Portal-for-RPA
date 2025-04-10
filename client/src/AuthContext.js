import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: null,
  });

  useEffect(() => {
    // Check localStorage or cookies for user session
    const token = localStorage.getItem("userToken");
    const role = localStorage.getItem("userRole");
    if (token && role) {
      setAuth({ isAuthenticated: true, role });
    }
  }, []);

  const login = (token, role) => {
    localStorage.setItem("userToken", token);
    localStorage.setItem("userRole", role);
    setAuth({ isAuthenticated: true, role });
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole");
    setAuth({ isAuthenticated: false, role: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
