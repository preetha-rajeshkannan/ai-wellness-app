import React, { useState, useRef } from "react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { API_BASE_URL } from "../config";

const starterPrompts = [
  "I feel overwhelmed today",
  "Give me a quick breathing exercise",
  "How can I improve my sleep?",
  "Share a positive affirmation",
];

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef(null);
  const { theme } = useTheme();

  const token = localStorage.getItem("token");

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    });
  };

  const sendMessage = async (text) => {
    const payload = (text ?? message).trim();
    if (!payload || isSending) return;

    setError("");
    setIsSending(true);
    setMessage("");
    setChat((prev) => [...prev, { role: "user", message: payload }]);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/ai/chat`,
        { message: payload },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setChat((prev) => [...prev, { role: "ai", message: res.data.reply }]);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "The chatbot is not available right now. Try again in a moment."
      );
      setChat((prev) => [
        ...prev,
        { role: "ai", message: "Sorry, I couldn't respond right now." },
      ]);
    } finally {
      setIsSending(false);
      scrollToBottom();
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const bgClass =
    theme === "dark"
      ? "bg-slate-950 text-slate-100"
      : "bg-gradient-to-br from-blue-50 via-white to-emerald-50";
  const cardClass =
    theme === "dark"
      ? "bg-slate-900/80 border-slate-800 text-slate-100"
      : "bg-white/90 border-gray-100";
  const chatBg =
    theme === "dark"
      ? "bg-slate-900 border-slate-800"
      : "bg-gray-50 border-gray-100";

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <div className="mx-auto max-w-4xl px-3 py-6">
        <div className={`${cardClass} backdrop-blur rounded-xl shadow border p-5`}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">AI Wellness Guide</h1>
                <p className="text-sm text-gray-600">
                  Chat about how you feel — the AI responds with supportive guidance.
                </p>
              </div>
              {isSending && (
                <div className="flex items-center gap-2 text-blue-600 text-sm">
                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  Thinking...
                </div>
              )}
            </div>

            <div
              ref={listRef}
              className="h-[60vh] overflow-y-auto rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3"
            >
              {chat.length === 0 && (
                <div className="text-center text-gray-500 text-sm">
                  Start with one of the prompts below or type your own message.
                </div>
              )}
              {chat.map((c, i) => (
                <div
                  key={i}
                  className={`flex ${c.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow ${
                      c.role === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
                    }`}
                  >
                    {c.message}
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-xs sm:text-sm px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600 transition"
                  disabled={isSending}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <textarea
                rows={2}
                value={message}
                onKeyDown={handleKey}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 resize-none rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 p-3 text-sm"
                placeholder="Type your message..."
              />
              <button
                onClick={() => sendMessage()}
                disabled={isSending}
                className="h-full px-4 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition disabled:opacity-60"
              >
                {isSending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
