import Stress from "../models/Stress.js";

const scoreStress = (responses = []) => {
  const score = responses.reduce((sum, item) => sum + Number(item.value || 0), 0);

  let level = "low";
  let suggestion =
    "Nice work keeping stress low. Continue short walks, steady sleep, and light breathing breaks.";

  if (score >= 12 && score < 18) {
    level = "moderate";
    suggestion =
      "Stress is noticeable. Try a 5-minute box-breath, set one clear priority, and take a short break away from screens.";
  } else if (score >= 18) {
    level = "high";
    suggestion =
      "Stress is high. Pause for slow breathing, step outside if possible, and consider a brief body scan. If this persists, reach out to someone you trust.";
  }

  return { score, level, suggestion };
};

export const submitStress = async (req, res) => {
  try {
    const { responses } = req.body;
    if (!Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({ message: "Responses are required" });
    }

    const { score, level, suggestion } = scoreStress(responses);

    const entry = await Stress.create({
      userId: req.user,
      responses,
      score,
      level,
      suggestion,
    });

    res.json({ entry, score, level, suggestion });
  } catch (err) {
    console.error("Stress submit error:", err);
    res.status(500).json({ message: "Unable to submit stress survey" });
  }
};

export const getStressHistory = async (req, res) => {
  try {
    const items = await Stress.find({ userId: req.user })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(items);
  } catch (err) {
    console.error("Stress fetch error:", err);
    res.status(500).json({ message: "Unable to fetch stress history" });
  }
};

