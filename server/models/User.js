import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: false // Not required for existing users
  },
  name: {
    type: String,
    required: false // Optional, can be set during signup
  },
  auth0Id: {
    type: String,
    unique: true,
    sparse: true
  },
  walletAddress: {
    type: String,
    unique: true,
    sparse: true
  },
  tokenBalance: {
    type: Number,
    default: 1000 // Free 1000 OAC on signup
  },
  modelsContributed: {
    type: Number,
    default: 0
  },
  totalRewards: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    enum: ['user', 'developer', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("User", userSchema);
