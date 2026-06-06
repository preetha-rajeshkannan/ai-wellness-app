import express from "express";
import { submitStress, getStressHistory } from "../controllers/stressController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/submit", auth, submitStress);
router.get("/history", auth, getStressHistory);

export default router;

