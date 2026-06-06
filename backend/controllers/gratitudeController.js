import Gratitude from "../models/Gratitude.js";

export const addGratitude = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: "Text is required" });
    }

    await Gratitude.create({
      userId: req.user,
      text: text.trim(),
    });

    res.json({ message: "Gratitude entry saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getGratitudeEntries = async (req, res) => {
  try {
    const entries = await Gratitude.find({ userId: req.user })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteGratitude = async (req, res) => {
  try {
    const entry = await Gratitude.findOne({
      _id: req.params.id,
      userId: req.user,
    });

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    await Gratitude.deleteOne({ _id: req.params.id });
    res.json({ message: "Entry deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

