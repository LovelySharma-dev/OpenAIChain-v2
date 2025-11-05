import mongoose from "mongoose";

const modelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  modelId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['text-generation', 'image-classification', 'object-detection', 'sentiment-analysis', 'translation', 'other'],
    default: 'other'
  },
  accuracy: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  tags: [String],
  huggingFaceUrl: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  trainingSessions: {
    type: Number,
    default: 0
  },
  lastTrainedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Model", modelSchema);
