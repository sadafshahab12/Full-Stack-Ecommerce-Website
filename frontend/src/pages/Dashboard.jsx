import axios from "axios";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return null;
    }
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessage(res.data.message);
      } catch (error) {
        console.log(error);
        setMessage("Unauthorized. Please Login.");
      }
    };
    fetchData();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <p>{message}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
