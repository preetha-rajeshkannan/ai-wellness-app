import express from "express";
import {
  addGratitude,
  getGratitudeEntries,
  deleteGratitude,
} from "../controllers/gratitudeController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", auth, addGratitude);
router.get("/all", auth, getGratitudeEntries);
router.delete("/:id", auth, deleteGratitude);

export default router;

