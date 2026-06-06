import express from "express";
import { logMeditation, getStreak } from "../controllers/meditationController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/log", auth, logMeditation);
router.get("/streak", auth, getStreak);

export default router;

