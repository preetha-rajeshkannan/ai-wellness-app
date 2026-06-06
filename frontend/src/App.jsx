import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// pages
import AuthLanding from "./pages/AuthLanding";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import StressCheck from "./pages/StressCheck";
import Journal from "./pages/Journal";
import Reports from "./pages/Reports";

// components
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./context/ThemeContext";

function AppShell() {
  const location = useLocation();
  const hideNav = ["/", "/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNav && <Navbar />}
      <div className="p-4"></div>
      <Routes>
        <Route path="/" element={<AuthLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/stress" element={<StressCheck />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppShell />
    </Router>
    </ThemeProvider>
  );
}

export default App;
