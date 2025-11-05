import express from "express";
import { trainModel, federatedTrain } from "../ai/trainTensor.js";
import Model from "../models/Model.js";
import User from "../models/User.js";
import Reward from "../models/Reward.js";
import { authMiddleware, optionalAuth } from "../utils/authMiddleware.js";

const router = express.Router();

// POST /api/train - Train a model using TensorFlow.js
// Changed to optionalAuth so guest users can train without logging in
router.post("/train", optionalAuth, async (req, res) => {
  try {
    const { modelName, epochs = 10, federated = true, nodes = 3 } = req.body;

    console.log(`🧠 Training request for model: ${modelName || 'default'}`);

    let trainingResult;
    try {
      if (federated) {
        // Federated learning across multiple nodes
        trainingResult = await federatedTrain(nodes);
      } else {
        // Standard centralized training
        trainingResult = await trainModel({ epochs });
      }
    } catch (trainError) {
      console.error("❌ Training execution failed:", trainError);
      return res.status(500).json({ success: false, message: "Training failed", error: process.env.NODE_ENV === 'development' ? String(trainError.stack || trainError) : trainError.message });
    }

    // Update model in database if it exists
    if (modelName) {
      try {
        const model = await Model.findOne({ name: modelName });
        if (model) {
          model.accuracy = trainingResult.accuracy || trainingResult.federatedAccuracy;
          model.trainingSessions += 1;
          model.lastTrainedAt = new Date();
          await model.save();
          console.log(`📝 Updated model ${modelName} in database`);
        }
      } catch (dbError) {
        console.log("⚠️  Database update skipped:", dbError.message);
      }
    }

    // If a user is authenticated (optionalAuth may attach req.user), update user reward.
    let user = null;
    if (req.user && req.user.userId) {
      user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
    }

    // Link wallet if provided (only if user exists)
    const walletAddress = req.body.walletAddress;
    if (walletAddress && user && !user.walletAddress) {
      user.walletAddress = walletAddress.toLowerCase();
      await user.save();
    }
    
    // Calculate and add reward to user balance if training successful
    let rewardAmount = 0;
    if (trainingResult.federatedAccuracy || trainingResult.accuracy) {
      const accuracy = trainingResult.federatedAccuracy || trainingResult.accuracy;
      // Calculate reward based on accuracy (50-500 OAC)
      rewardAmount = Math.round(50 + (accuracy - 85) * 2);
      rewardAmount = Math.max(50, Math.min(500, rewardAmount)); // Between 50-500 OAC
      
      // Update user balance if user exists (guest users won't have a DB user)
      if (user) {
        user.tokenBalance = (user.tokenBalance || 0) + rewardAmount;
        user.totalRewards = (user.totalRewards || 0) + rewardAmount;
        user.modelsContributed = (user.modelsContributed || 0) + 1;
        await user.save();
      }
      
      // Create reward entry for history (if user exists, link it; otherwise create generic record)
      try {
        await Reward.create({
          userId: user ? user._id : null,
          walletAddress: walletAddress?.toLowerCase() || (user ? user.walletAddress : null),
          amount: rewardAmount,
          type: 'training',
          description: `Model Training - ${modelName || 'default'} (Accuracy: ${accuracy.toFixed(2)}%)`,
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          claimed: true,
          claimedAt: new Date()
        });

        if (user) {
          console.log(`💰 Training reward: +${rewardAmount} OAC added to user ${user.email} balance (Total: ${user.tokenBalance} OAC)`);
        } else {
          console.log(`💰 Training reward: +${rewardAmount} OAC generated for guest (wallet: ${walletAddress || 'none'})`);
        }
      } catch (error) {
        console.log("⚠️  Reward history entry skipped:", error.message);
      }
    }

    res.json({
      success: true,
      message: "Training completed successfully",
      data: trainingResult,
      modelName: modelName || 'default',
      federated,
      rewardAmount
    });

  } catch (error) {
    console.error("❌ Training error:", error.message);
    res.status(500).json({
      success: false,
      message: "Training failed",
      error: error.message
    });
  }
});

// GET /api/train/status - Get training status
router.get("/train/status", (req, res) => {
  res.json({
    success: true,
    status: "ready",
    availableModels: [
      "text-generation",
      "sentiment-analysis",
      "image-classification"
    ],
    supportsFederated: true
  });
});

export default router;
