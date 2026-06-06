import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/journal", label: "Journal" },
  { to: "/stress", label: "Stress Check" },
  { to: "/reports", label: "Reports" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header
      className={`sticky top-0 z-20 backdrop-blur border-b ${
        theme === "dark"
          ? "bg-slate-900/80 border-slate-800"
          : "bg-white/90 border-gray-200"
      }`}
    >
      <div className="mx-auto max-w-6xl px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-400 text-white font-bold grid place-items-center text-xs">
            AI
          </div>
          <div
            className={`font-semibold text-base ${
              theme === "dark" ? "text-slate-100" : "text-gray-800"
            }`}
          >
            Wellness
          </div>
        </div>

        <nav className="flex items-center gap-3 text-sm">
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-md transition ${
                  active
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : theme === "dark"
                    ? "text-slate-200 hover:text-blue-200 hover:bg-slate-800"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`ml-2 h-8 w-8 rounded-full grid place-items-center transition text-sm ${
              theme === "dark"
                ? "bg-slate-800 text-amber-300 hover:bg-slate-700"
                : "bg-gray-200 text-amber-500 hover:bg-gray-300"
            }`}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button
            onClick={handleLogout}
            className="ml-2 px-3 py-1.5 rounded-md bg-gray-900 text-white hover:bg-gray-700 transition text-sm"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
