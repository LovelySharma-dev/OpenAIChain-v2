import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  walletAddress: {
    type: String,
    index: true
  },
  modelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Model'
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['training', 'contribution', 'governance', 'bonus'],
    default: 'training'
  },
  accuracyImprovement: {
    type: Number,
    default: 0
  },
  previousAccuracy: Number,
  newAccuracy: Number,
  description: String,
  transactionHash: String,
  claimed: {
    type: Boolean,
    default: false
  },
  claimedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Reward", rewardSchema);
