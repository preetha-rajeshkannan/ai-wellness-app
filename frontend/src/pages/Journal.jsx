import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { API_BASE_URL } from "../config";

const sentimentClass = (sentiment) => {
  if (sentiment === "POSITIVE") return "text-emerald-600";
  if (sentiment === "NEGATIVE") return "text-rose-600";
  return "text-slate-600";
};

const Journal = () => {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState([]);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("token");
  const { theme } = useTheme();

  const fetchEntries = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/journal/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/journal/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEntries();
    } catch (err) {
      console.error(err);
    }
  };

  const submitEntry = async () => {
    if (!text || saving) return;
    try {
      setSaving(true);
      await axios.post(
        `${API_BASE_URL}/api/journal/add`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText("");
      fetchEntries();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const bgClass =
    theme === "dark"
      ? "bg-slate-950 text-slate-100"
      : "bg-gradient-to-br from-blue-50 via-white to-emerald-50";
  const cardClass =
    theme === "dark"
      ? "bg-slate-900/80 border-slate-800 text-slate-100"
      : "bg-white/90 border-gray-100";
  const subCardClass =
    theme === "dark"
      ? "bg-slate-900/80 border-slate-800"
      : "bg-gray-50 border-gray-100";

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <div className="mx-auto max-w-4xl px-3 py-6">
        <div className={`${cardClass} backdrop-blur rounded-xl shadow p-5 space-y-5 border`}>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Daily Journal</h1>
            <p className="text-sm text-gray-600">Capture how you feel and track sentiment.</p>
          </div>

          <div className="space-y-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={`w-full h-32 rounded-xl border p-3 text-sm ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-800"
                  : "bg-white border-gray-200 text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              }`}
              placeholder="How are you feeling today?"
            />
            <div className="flex justify-end">
              <button
                onClick={submitEntry}
                disabled={!text || saving}
                className="px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold shadow shadow-emerald-200 hover:bg-emerald-700 transition disabled:opacity-60 text-sm"
              >
                {saving ? "Saving..." : "Save entry"}
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Your entries</h2>
            {entries.length === 0 ? (
              <p className="text-sm text-gray-600">No entries yet.</p>
            ) : (
              <div className="grid gap-2.5 md:grid-cols-2">
                {entries.map((e) => (
                  <div
                    key={e._id}
                    className={`rounded-lg p-3.5 shadow-sm space-y-2 border ${subCardClass}`}
                  >
                    <p className="text-xs text-gray-500">
                      {new Date(e.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{e.text}</p>
                    <p className={`text-sm font-semibold ${sentimentClass(e.sentiment)}`}>
                      Sentiment: {e.sentiment}
                    </p>
                    <div className="text-right">
                      <button
                        onClick={() => deleteEntry(e._id)}
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
  );
};

export default Journal;
