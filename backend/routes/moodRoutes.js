import express from "express";
import { addMood, getMoods, deleteMood } from "../controllers/moodController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", auth, addMood);
router.get("/all", auth, getMoods);
router.delete("/:id", auth, deleteMood);

export default router;
