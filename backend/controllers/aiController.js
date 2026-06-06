import dotenv from "dotenv";
import fetch from "node-fetch";
import Chat from "../models/Chat.js";

dotenv.config();

// Fallback responses if HF fails
const fallbackWellnessReply = (message) => {
  const options = [
    `I hear you saying: "${message}". Try 4-6 deep breaths, unclench your jaw, and notice one thing you can do for yourself right now.`,
    `Thanks for sharing: "${message}". A short pause and slow breathing can help. What small step would feel supportive next?`,
    `"${message}" — I'm here with you. Consider a glass of water, a stretch, and naming one thing you're grateful for.`,
  ];
  return options[Math.floor(Math.random() * options.length)];
};

// ----------------------
// SENTIMENT ANALYSIS
// ----------------------
export const analyzeSentiment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });
    if (!process.env.HF_API_KEY) {
      return res.status(500).json({ message: "HF_API_KEY is not set" });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: text }),
      }
    );

    const data = await response.json();

    if (Array.isArray(data) && data[0]?.label && data[0]?.score) {
      return res.json({ label: data[0].label, score: data[0].score });
    }

    return res.json({ label: "NEUTRAL", score: 0 });
  } catch (err) {
    console.error("Sentiment API error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ----------------------
// WELLNESS CHATBOT
// ----------------------
export const wellnessChatbot = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "Message is required" });

    if (!process.env.HF_API_KEY) {
      return res.json({ reply: fallbackWellnessReply(message) });
    }

    // Use BlenderBot small (chat-friendly & free)
    const model = process.env.HF_CHAT_MODEL || "facebook/blenderbot-400M-distill";

    // Instruction + user message
    const prompt = `You are a friendly and supportive wellness coach.
Respond concisely (max 50 words) with 1 practical suggestion or encouraging thought.

User says: "${message}"
Coach:`;

    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {
          text: prompt,
          conversation: [] // Ensures BlenderBot understands it's a chat
        },
      }),
    });

    const data = await response.json();

    // Default fallback
    let reply = fallbackWellnessReply(message);

    // Handle multiple HF response formats
    if (Array.isArray(data)) {
      if (data[0]?.generated_text) reply = data[0].generated_text.trim();
      else if (data[0]?.generated_texts && data[0].generated_texts[0])
        reply = data[0].generated_texts[0].trim();
    } else if (data.generated_text) {
      reply = data.generated_text.trim();
    } else if (data.generated_texts && data.generated_texts[0]) {
      reply = data.generated_texts[0].trim();
    }

    // Store conversation if user is authenticated
    if (req.user) {
      Chat.create({
        userId: req.user,
        message,
        reply,
      }).catch((err) => console.error("Chat save error:", err.message));
    } else {
      console.warn("Chat not saved: missing req.user (auth token missing/invalid)");
    }

    res.json({ reply });
  } catch (err) {
    console.error("Chatbot API error:", err.message);
    res.status(500).json({ reply: fallbackWellnessReply(req.body.message) });
  }
};

