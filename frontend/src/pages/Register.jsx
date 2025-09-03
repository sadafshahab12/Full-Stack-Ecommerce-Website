import React, { useState } from "react";
import axios from "axios";
const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/register`,
        form
      );
      alert("User registered Successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 w-64 m-auto mt-10"
    >
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
