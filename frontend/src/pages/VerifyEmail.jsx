import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/verify/${token}`
        );
        alert(res.data.message);
        navigate("/login");
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    verify();
  }, [token, navigate]);
  return (
    <div>
      <h2>Verifying your email ....</h2>
    </div>
  );
};

export default VerifyEmail;
