import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Reports = () => {
  const [moodData, setMoodData] = useState([]);
  const [journalData, setJournalData] = useState([]);
  const [videos, setVideos] = useState([]);
  const token = localStorage.getItem("token");
  const { theme } = useTheme();

  // Fetch mood logs
  const fetchMoods = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/mood/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMoodData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch journal entries
  const fetchJournal = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/journal/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJournalData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshVideos = () => {
    // Wider pool of generally embeddable motivation/positivity videos
    const list = [
  "ZXsQAXx_ao0", // Jocko / Just Do It motivation
  "KxGRhd_iWuE", // Why do we fall
  "wONMhVYhOvc", // Best motivational speech compilation (Motiversity)
  "mgmVOuLgFB0", // Rocky motivation
  "UNQhuFL6CWg", // Denzel Washington motivational speech
  "ZOy0YgUDwDg", // Steve Jobs Stanford commencement
  "5U-NKTcTFoA", // Meditation for focus & concentration
  "inpok4MKVLM", // 5-minute guided meditation (Headspace-style)
  "2OEL4P1Rz04", // Short meditation
  "yXlJB1Q0k9k", // Stress relief / calming talk
  "DqS18NpOnHs", // Gratitude mindset
  "IquS7Gd3ZdU", // Quick motivation
];

    const shuffled = [...list].sort(() => 0.5 - Math.random());
    setVideos(shuffled.slice(0, 3));
  };

  useEffect(() => {
    fetchMoods();
    fetchJournal();
    refreshVideos();
  }, []);

  // Prepare Mood Chart (Bar)
  const moodCounts = moodData.reduce((acc, curr) => {
    acc[curr.mood] = (acc[curr.mood] || 0) + 1;
    return acc;
  }, {});

  const moodChartData = {
    labels: Object.keys(moodCounts),
    datasets: [
      {
        label: "Mood Count",
        data: Object.values(moodCounts),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  // Prepare Journal Sentiment Chart (Pie)
  const sentimentCounts = journalData.reduce((acc, curr) => {
    acc[curr.sentiment] = (acc[curr.sentiment] || 0) + 1;
    return acc;
  }, {});

  const journalChartData = {
    labels: Object.keys(sentimentCounts),
    datasets: [
      {
        label: "Journal Sentiment",
        data: Object.values(sentimentCounts),
        backgroundColor: ["#34d399", "#f87171", "#a5b4fc"],
        borderWidth: 1,
        borderColor: "#ffffff",
      },
    ],
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

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <div className="mx-auto max-w-5xl px-3 py-6">
        <div className={`${cardClass} backdrop-blur border rounded-xl shadow p-5 space-y-6`}>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Wellness Insights</h1>
            <p className="text-sm text-gray-600">
              Track how your mood and journal sentiment evolve over time.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className={`rounded-xl p-4 shadow-sm border ${subCardClass}`}>
              <h2 className="text-base font-semibold mb-3">Mood trend</h2>
              {Object.keys(moodCounts).length > 0 ? (
                <div className="h-60">
                  <Bar data={moodChartData} options={chartOptions} />
                </div>
              ) : (
                <p className="text-sm text-gray-600">No moods logged yet.</p>
              )}
            </div>

            <div className={`rounded-xl p-4 shadow-sm border ${subCardClass}`}>
              <h2 className="text-base font-semibold mb-3">Journal sentiment</h2>
              {Object.keys(sentimentCounts).length > 0 ? (
                <div className="h-60">
                  <Pie data={journalChartData} options={chartOptions} />
                </div>
              ) : (
                <p className="text-sm text-gray-600">No journal entries yet.</p>
              )}
            </div>
          </div>

          <div className={`rounded-xl p-4 shadow-sm border ${subCardClass}`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold">Positivity & motivation</h2>
              <button
                onClick={refreshVideos}
                className="text-xs px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Refresh
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {videos.map((id) => (
                <div key={id} className="aspect-video rounded-lg overflow-hidden border border-gray-200">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${id}`}
                    title="Motivation video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
