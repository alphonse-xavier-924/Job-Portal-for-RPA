import React, { useEffect, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";
//import { useNavigate } from "react-router-dom";
import "./home.css";
import { AuthContext } from "../AuthContext";

const HomePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("userToken");
      const decodedToken = jwtDecode(token);

      console.log("role", auth.role);

      try {
        let response;
        if (auth.role === "recruiter") {
          const companyId = decodedToken.company.id;
          response = await fetch(
            `http://localhost:4000/api/companies/${companyId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else if (auth.role === "candidate") {
          const candidateId = decodedToken.candidate.id;
          response = await fetch(
            `http://localhost:4000/api/candidates/${candidateId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          setError("Invalid role");
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const result = await response.json();

        if (auth.role === "recruiter") {
          setData(result.message.companyName);
          console.log("result", result.message.companyName);
        } else {
          setData(result.message.name);
          console.log("result", result.message.name);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (auth.role) {
      fetchData();
    }
  }, [auth.role]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="home-container">
      <h1>Welcome to the OneStop Job Portal{data && `, ${data}`}</h1>
    </div>
  );
};

export default HomePage;
