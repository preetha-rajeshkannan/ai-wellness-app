import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, { name, email, password });
      alert("Registered successfully");
      navigate("/");
    } catch (err) {
      alert(err.response.data.message || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-2xl mb-4">Register</h1>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 mb-3 border rounded"/>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 mb-3 border rounded"/>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 mb-3 border rounded"/>
        <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">Register</button>
      </form>
    </div>
  );
};

export default Register;
