import express from "express";
import { addJournal, getJournalEntries, deleteJournal } from "../controllers/journalController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", auth, addJournal);
router.get("/all", auth, getJournalEntries);
router.delete("/:id", auth, deleteJournal);

export default router;
