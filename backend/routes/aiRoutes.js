import express from "express";
import { analyzeSentiment } from "../controllers/aiController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Sentiment for journal entries
router.post("/sentiment", auth, analyzeSentiment);

export default router;
