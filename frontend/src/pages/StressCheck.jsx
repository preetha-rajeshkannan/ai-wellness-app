import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const questions = [
  "How well did you sleep last night?",
  "How demanding has work/study felt today?",
  "How irritable or on-edge do you feel?",
  "How much tension are you holding in your body?",
  "How supported or connected do you feel?",
  "How worried are you about tasks or deadlines?",
];

const StressCheck = () => {
  const [responses, setResponses] = useState(
    questions.map((q) => ({ question: q, value: 3 }))
  );
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [meditation, setMeditation] = useState({ streak: 0, lastDate: null });
  const [gratitude, setGratitude] = useState("");
  const [gratitudeEntries, setGratitudeEntries] = useState([]);
  const [sleepGoal, setSleepGoal] = useState(8);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const { theme } = useTheme();

  const updateResponse = (idx, value) => {
    setResponses((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, value: Number(value) } : item))
    );
  };

  const submit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/stress/submit",
        { responses },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult({
        score: res.data.score,
        level: res.data.level,
        suggestion: res.data.suggestion,
      });
      fetchHistory();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stress/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchMeditationStreak();
    fetchLatestGratitude();
  }, []);

  const fetchMeditationStreak = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/meditation/streak", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeditation({
        streak: res.data.streak,
        lastDate: res.data.lastDate ? new Date(res.data.lastDate).toDateString() : null,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const logMeditation = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/meditation/log",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update streak immediately from response
      const streakRes = await axios.get("http://localhost:5000/api/meditation/streak", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeditation({
        streak: streakRes.data.streak,
        lastDate: streakRes.data.lastDate ? new Date(streakRes.data.lastDate).toDateString() : null,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLatestGratitude = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/gratitude/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Get last 3 days of entries
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      threeDaysAgo.setHours(0, 0, 0, 0);
      
      const recentEntries = res.data.filter(entry => {
        const entryDate = new Date(entry.createdAt);
        return entryDate >= threeDaysAgo;
      });
      
      setGratitudeEntries(recentEntries);
      
      // Set today's entry in textarea if exists
      if (res.data.length > 0) {
        const today = new Date().toDateString();
        const latest = res.data[0];
        const latestDate = new Date(latest.createdAt).toDateString();
        if (latestDate === today) {
          setGratitude(latest.text);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveGratitude = async () => {
    if (!gratitude || gratitude.trim().length === 0) return;
    try {
      await axios.post(
        "http://localhost:5000/api/gratitude/add",
        { text: gratitude },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh entries after saving
      fetchLatestGratitude();
    } catch (err) {
      console.error(err);
    }
  };

  const chartData = {
    labels: history.slice().reverse().map((item) =>
      new Date(item.createdAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Stress score",
        data: history.slice().reverse().map((item) => item.score),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, labels: { color: theme === "dark" ? "#e2e8f0" : "#0f172a" } },
    },
    scales: {
      x: {
        ticks: { color: theme === "dark" ? "#e2e8f0" : "#1f2937" },
        grid: { color: theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" },
      },
      y: {
        ticks: { color: theme === "dark" ? "#e2e8f0" : "#1f2937" },
        grid: { color: theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" },
      },
    },
  };

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
      <div className="mx-auto max-w-6xl px-3 py-5 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className={`${cardClass} backdrop-blur border rounded-xl shadow p-4 space-y-3`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Stress level check</h1>
                <p className="text-sm text-gray-600">
                  Quick daily quiz: rate each item 1 (low) to 5 (high). We’ll score it and suggest a next step.
                </p>
              </div>
              <span className="text-xs text-gray-500">Takes ~30s</span>
            </div>

            <div className="space-y-3">
              {responses.map((item, idx) => (
                <div
                  key={item.question}
                  className={`rounded-lg p-3 shadow-sm border ${subCardClass}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-gray-800">{item.question}</p>
                    <span className="text-xs text-gray-500">1 = low, 5 = high</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={item.value}
                    onChange={(e) => updateResponse(idx, e.target.value)}
                    className="w-full mt-2 accent-blue-600"
                  />
                  <div className="text-right text-sm font-semibold text-blue-700">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={submit}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow shadow-blue-200 hover:bg-blue-700 transition disabled:opacity-60 text-sm"
              >
                {loading ? "Scoring..." : "Calculate stress"}
              </button>
            </div>

            {result && (
              <div className={`rounded-xl border p-3.5 shadow-sm space-y-2 ${subCardClass}`}>
                <p className="text-sm text-gray-700">
                  Score: <span className="font-semibold">{result.score}</span> — Level:{" "}
                  <span className="font-semibold capitalize">{result.level}</span>
                </p>
                <p className="text-sm text-gray-800">{result.suggestion}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className={`${cardClass} backdrop-blur border rounded-xl shadow p-4 space-y-3`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Meditation streak</h2>
                <p className="text-sm text-gray-600">Keep your mindful minutes going.</p>
              </div>
              <button
                onClick={logMeditation}
                className="text-xs px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Log today
              </button>
            </div>
            <div className={`rounded-lg border p-3 ${subCardClass}`}>
              <p className="text-sm font-semibold text-gray-900">
                Current streak: <span className="text-blue-600">{meditation.streak} days</span>
              </p>
              <p className="text-xs text-gray-600">Last logged: {meditation.lastDate || "—"}</p>
              <p className="text-xs text-gray-500 mt-2">
                Tip: even 5 minutes counts—stack it after your stress check.
              </p>
            </div>
          </div>

          <div className={`${cardClass} backdrop-blur border rounded-xl shadow p-4 space-y-3`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Gratitude journaling</h2>
                <p className="text-sm text-gray-600">Capture one good thing today.</p>
              </div>
              <span className="text-xs text-gray-500">Daily</span>
            </div>
            <textarea
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="I appreciate..."
              className={`w-full h-20 p-2.5 rounded-lg border text-sm ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
            <div className="flex justify-end">
              <button
                onClick={saveGratitude}
                disabled={!gratitude || gratitude.trim().length === 0}
                className="text-xs px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
              >
                Save
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Tip: keep it short; a sentence or two is enough to shift mood.
            </p>
            
            {gratitudeEntries.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Recent entries (last 3 days)</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {gratitudeEntries.map((entry) => (
                    <div
                      key={entry._id}
                      className={`rounded-lg p-2.5 border text-sm ${subCardClass}`}
                    >
                      <p className="text-xs text-gray-500 mb-1">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </p>
                      <p className={`text-sm ${theme === "dark" ? "text-slate-200" : "text-gray-800"}`}>
                        {entry.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={`${cardClass} backdrop-blur border rounded-xl shadow p-4 space-y-3`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Sleep improvement goal</h2>
                <p className="text-sm text-gray-600">Set tonight’s target hours.</p>
              </div>
              <span className="text-xs text-gray-500">Targeted</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="5"
                max="10"
                step="0.5"
                value={sleepGoal}
                onChange={(e) => setSleepGoal(Number(e.target.value))}
                className="flex-1 accent-blue-600"
              />
              <span className="text-sm font-semibold text-blue-700">{sleepGoal}h</span>
            </div>
            <p className="text-xs text-gray-500">
              Tip: keep a consistent bedtime; dim lights 60 minutes before sleep.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-3 pb-6">
        <div className={`${cardClass} backdrop-blur border rounded-xl shadow p-4 space-y-3`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Stress trends</h2>
              <p className="text-sm text-gray-600">Recent scores over time.</p>
            </div>
            <span className="text-xs text-gray-500">
              Showing last {history.length} entries
            </span>
          </div>
          {history.length === 0 ? (
            <p className="text-sm text-gray-600">No entries yet.</p>
          ) : (
            <div className="h-64">
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StressCheck;

