import Journal from "../models/Journal.js";
import { InferenceClient

 } from "@huggingface/inference";

const hf = new InferenceClient

(process.env.HF_API_KEY || undefined);

export const addJournal = async (req, res) => {
  try {
    const { text } = req.body;

    // Sentiment Analysis from HuggingFace
    const result = await hf.textClassification({
      model: "distilbert-base-uncased-finetuned-sst-2-english",
      inputs: text,
    });

    const sentiment = result[0].label;

    const entry = await Journal.create({
      userId: req.user,
      text,
      sentiment,
    });

    res.json({
      message: "Journal entry saved",
      entry,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getJournalEntries = async (req, res) => {
  try {
    const entries = await Journal.find({ userId: req.user }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteJournal = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Journal.findOneAndDelete({ _id: id, userId: req.user });
    if (!deleted) return res.status(404).json({ message: "Journal not found" });
    res.json({ message: "Journal deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};