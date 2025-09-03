import axios from "axios";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  useEffect(() => {
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
  }, []);
  return (
    <div>
    

    </div>
  );
};

export default Dashboard;
