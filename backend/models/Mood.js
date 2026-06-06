import mongoose from "mongoose";

const moodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mood: { type: String, enum: ["happy", "sad", "stressed", "angry", "tired", "neutral"], required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Mood", moodSchema);
