import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

const moods = [
  { key: "happy", label: "Happy", color: "from-amber-300 to-orange-400" },
  { key: "neutral", label: "Neutral", color: "from-slate-200 to-slate-300" },
  { key: "tired", label: "Tired", color: "from-emerald-200 to-cyan-300" },
  { key: "stressed", label: "Stressed", color: "from-rose-200 to-amber-200" },
  { key: "sad", label: "Sad", color: "from-blue-200 to-indigo-300" },
  { key: "angry", label: "Angry", color: "from-red-300 to-orange-300" },
];

const Dashboard = () => {
  const [selectedMood, setSelectedMood] = useState("");
  const [history, setHistory] = useState([]);
  const [saving, setSaving] = useState(false);
  const { theme } = useTheme();

  const token = localStorage.getItem("token");

  const submitMood = async () => {
    if (!selectedMood || saving) return;
    setSaving(true);
    await axios.post(
      "http://localhost:5000/api/mood/add",
      { mood: selectedMood },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    await fetchHistory();
    setSaving(false);
  };

  const fetchHistory = async () => {
    const res = await axios.get("http://localhost:5000/api/mood/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setHistory(res.data);
  };

  const deleteMood = async (id) => {
    await axios.delete(`http://localhost:5000/api/mood/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchHistory();
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const bgClass =
    theme === "dark"
      ? "bg-slate-950 text-slate-100"
      : "bg-gradient-to-br from-blue-50 via-white to-emerald-50";
  const cardClass =
    theme === "dark"
      ? "bg-slate-900/80 border-slate-800 text-slate-100"
      : "bg-white/90 border-gray-100";
  const listCardClass =
    theme === "dark"
      ? "border-slate-800 bg-slate-900 text-slate-100"
      : "border-gray-100 bg-gray-50";
  const moodTextClass = theme === "dark" ? "text-slate-900 drop-shadow" : "";

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <div className="mx-auto max-w-4xl px-3 py-6">
        <div className={`${cardClass} backdrop-blur rounded-xl shadow p-5 border`}>
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">How are you feeling?</h1>
              <p className="text-sm text-gray-600">
                Select the mood that best matches you right now.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {moods.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setSelectedMood(m.key)}
                  className={`rounded-lg p-3 text-sm font-semibold shadow-sm transition border ${
                    selectedMood === m.key
                      ? "border-blue-400 ring-2 ring-blue-100"
                      : "border-transparent hover:border-gray-200"
                  } bg-gradient-to-br ${m.color} ${moodTextClass}`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div>
              <button
                onClick={submitMood}
                disabled={!selectedMood || saving}
                className="px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold shadow shadow-blue-200 hover:bg-blue-700 transition disabled:opacity-60 text-sm"
              >
                {saving ? "Saving..." : "Log mood"}
              </button>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent moods</h2>
              {history.length === 0 ? (
                <p className="text-sm text-gray-600">No moods logged yet.</p>
              ) : (
                <div className="grid gap-2.5 md:grid-cols-2">
                  {history.map((h) => (
                    <div
                      key={h._id}
                      className={`flex items-center justify-between rounded-lg border px-3 py-2.5 ${listCardClass}`}
                    >
                      <div>
                        <p className="text-sm font-semibold capitalize">{h.mood}</p>
                        <p className="text-xs opacity-75">
                          {new Date(h.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <button
                          onClick={() => deleteMood(h._id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
