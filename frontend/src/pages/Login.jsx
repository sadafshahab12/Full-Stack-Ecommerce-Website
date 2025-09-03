import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/login`,
        form
      );
      localStorage.setItem("token", res.data.token);
      alert("Login Successfull!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 w-64 m-auto mt-10"
    >
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
