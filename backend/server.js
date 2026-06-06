import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import moodRoutes from "./routes/moodRoutes.js";
import journalRoutes from './routes/journalRoutes.js';
import stressRoutes from "./routes/stressRoutes.js";
import meditationRoutes from "./routes/meditationRoutes.js";
import gratitudeRoutes from "./routes/gratitudeRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// DB connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/journal",journalRoutes);
app.use("/api/stress", stressRoutes);
app.use("/api/meditation", meditationRoutes);
app.use("/api/gratitude", gratitudeRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("AI Wellness Backend Running");
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
