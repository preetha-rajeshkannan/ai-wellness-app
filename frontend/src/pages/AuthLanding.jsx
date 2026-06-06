import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const AuthLanding = () => {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const isRegister = mode === "register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await axios.post("http://localhost:5000/api/auth/register", {
          name,
          email,
          password,
        });
        setMode("login");
      } else {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password,
        });
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Request failed");
    }
  };

  const bgClass =
    theme === "dark"
      ? "bg-slate-950 text-slate-100"
      : "bg-gradient-to-br from-blue-50 via-white to-emerald-50";
  const cardClass =
    theme === "dark"
      ? "bg-slate-900/80 border-slate-800 text-slate-100"
      : "bg-white/90 border-gray-200 text-gray-800";
  const subCardClass =
    theme === "dark"
      ? "bg-slate-900/80 border-slate-800 text-slate-200"
      : "bg-white/90 border-gray-200 text-gray-700";
  const pillActive =
    "bg-blue-600 text-white shadow shadow-blue-300 disabled:opacity-70";
  const pillIdle =
    theme === "dark"
      ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200";

  return (
    <div className={`min-h-screen ${bgClass} flex items-center justify-center px-4 py-8`}>
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className={`h-9 w-9 rounded-full grid place-items-center transition ${
            theme === "dark"
              ? "bg-slate-800 text-amber-300 hover:bg-slate-700"
              : "bg-white text-amber-500 shadow hover:bg-gray-100"
          }`}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>

      <div className="w-full max-w-5xl grid gap-6 md:grid-cols-2 items-center">
        <div className="space-y-4">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
              theme === "dark" ? "bg-slate-800 text-blue-200" : "bg-blue-50 text-blue-700"
            }`}
          >
            <span>AI Wellness</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Stress · Mood · Journal</span>
          </div>
          <h1 className="text-3xl font-semibold">
            Track stress, moods, and journals in one calming space.
          </h1>
          <p className="text-sm opacity-80">
            Start with a quick login or create an account to log your daily check-ins and get
            insights that feel supportive, not noisy.
          </p>
          <div className={`${subCardClass} rounded-xl border shadow p-4 space-y-2 text-sm`}>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              <p>Daily 1–5 stress sliders with instant suggestions</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <p>Mood tracking and journal sentiment at a glance</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <p>Simple reports to spot trends over time</p>
            </div>
          </div>
        </div>

        <div className={`${cardClass} rounded-xl border shadow-lg p-6 space-y-4`}>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setMode("login")}
                className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
                  mode === "login" ? pillActive : pillIdle
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setMode("register")}
                className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
                  mode === "register" ? pillActive : pillIdle
                }`}
              >
                Register
              </button>
            </div>
            <span className="text-xs opacity-70">
              {isRegister ? "Create an account" : "Welcome back"}
            </span>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            {isRegister && (
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm bg-transparent"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-transparent"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-transparent"
              required
            />
            <button
              type="submit"
              className="w-full p-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-sm shadow shadow-blue-200"
            >
              {isRegister ? "Create account" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthLanding;

