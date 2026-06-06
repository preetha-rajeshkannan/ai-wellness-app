import mongoose from "mongoose";

const stressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  responses: [
    {
      question: { type: String, required: true },
      value: { type: Number, min: 1, max: 5, required: true },
    },
  ],
  score: { type: Number, required: true },
  level: { type: String, enum: ["low", "moderate", "high"], required: true },
  suggestion: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Stress", stressSchema);

