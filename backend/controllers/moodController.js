import Mood from "../models/Mood.js";

export const addMood = async (req, res) => {
  try {
    const { mood } = req.body;

    await Mood.create({
      userId: req.user,
      mood,
      date: new Date()
    });

    res.json({ message: "Mood logged successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getMoods = async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.user }).sort({ date: -1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMood = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Mood.findOneAndDelete({ _id: id, userId: req.user });
    if (!deleted) return res.status(404).json({ message: "Mood not found" });
    res.json({ message: "Mood deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};