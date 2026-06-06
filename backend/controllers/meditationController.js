import Meditation from "../models/Meditation.js";

export const logMeditation = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if already logged today
    const existing = await Meditation.findOne({
      userId: req.user,
      date: { $gte: today, $lt: tomorrow },
    });

    if (existing) {
      return res.json({ message: "Already logged today", streak: await calculateStreak(req.user) });
    }

    await Meditation.create({
      userId: req.user,
      date: new Date(),
    });

    const streak = await calculateStreak(req.user);
    res.json({ message: "Meditation logged", streak });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStreak = async (req, res) => {
  try {
    const streak = await calculateStreak(req.user);
    const lastEntry = await Meditation.findOne({ userId: req.user }).sort({ date: -1 });
    res.json({ streak, lastDate: lastEntry?.date || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async function calculateStreak(userId) {
  const entries = await Meditation.find({ userId }).sort({ date: -1 });
  if (entries.length === 0) return 0;

  let streak = 0;
  let expectedDate = new Date();
  expectedDate.setHours(0, 0, 0, 0);

  for (const entry of entries) {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((expectedDate - entryDate) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0 || daysDiff === 1) {
      streak++;
      expectedDate = new Date(entryDate);
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

