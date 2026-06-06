import mongoose from "mongoose";

const meditationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  duration: { type: Number, default: 0 }, // in minutes
});

export default mongoose.model("Meditation", meditationSchema);


