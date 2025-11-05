import express from "express";
import Reward from "../models/Reward.js";
import User from "../models/User.js";
import { authMiddleware, optionalAuth } from "../utils/authMiddleware.js";

const router = express.Router();

// POST /api/reward - Calculate and distribute token rewards (requires auth)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      userId,
      modelId,
      previousAccuracy = 0,
      newAccuracy,
      contributionType = 'training'
    } = req.body;

    if (!newAccuracy) {
      return res.status(400).json({
        success: false,
        message: "New accuracy is required"
      });
    }

    // Get userId from JWT token if authenticated, otherwise use provided userId
    const effectiveUserId = req.user?.id || userId;

    // Calculate improvement
    const improvement = Math.max(0, newAccuracy - previousAccuracy);
    
    // Calculate reward based on improvement
    // Formula: baseReward + (improvement% * multiplier)
    const baseReward = 10;
    const multiplier = 100;
    const reward = Math.round(baseReward + (improvement * multiplier));

    console.log(`💰 Calculating reward...`);
    console.log(`  Previous Accuracy: ${previousAccuracy}%`);
    console.log(`  New Accuracy: ${newAccuracy}%`);
    console.log(`  Improvement: ${improvement.toFixed(2)}%`);
    console.log(`💰 Reward Calculated: +${reward} Tokens`);

    // Create reward record
    const rewardRecord = {
      amount: reward,
      type: contributionType,
      accuracyImprovement: improvement,
      previousAccuracy,
      newAccuracy,
      description: `Model improvement reward: ${improvement.toFixed(2)}% accuracy gain`,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      createdAt: new Date(),
      claimed: false
    };

    // Support wallet address from request
    const walletAddress = req.body.walletAddress;
    if (walletAddress) {
      rewardRecord.walletAddress = walletAddress.toLowerCase();
    }

    // Only add userId and modelId if they are valid ObjectIds
    if (effectiveUserId && effectiveUserId.match(/^[0-9a-fA-F]{24}$/)) {
      rewardRecord.userId = effectiveUserId;
    }
    if (modelId && modelId.match(/^[0-9a-fA-F]{24}$/)) {
      rewardRecord.modelId = modelId;
    }

    let dbSaveSuccess = false;
    let userBalance = null;

    // Try to save to database only if we have a valid userId
    if (rewardRecord.userId) {
      try {
        const savedReward = await Reward.create(rewardRecord);
        
        // Update user balance if possible
        const user = await User.findById(rewardRecord.userId);
        if (user) {
          user.tokenBalance += reward;
          user.totalRewards += reward;
          user.modelsContributed += 1;
          await user.save();
          userBalance = user.tokenBalance;
          dbSaveSuccess = true;
          console.log(`✅ User balance updated: ${user.tokenBalance} tokens`);
        }
      } catch (dbError) {
        console.log("⚠️  Database save failed:", dbError.message);
      }
    } else {
      console.log("⚠️  No valid userId provided - reward calculated but not persisted");
    }

    res.json({
      success: true,
      message: dbSaveSuccess ? "Reward calculated and persisted" : "Reward calculated (not persisted - database unavailable or missing userId)",
      persisted: dbSaveSuccess,
      reward: {
        amount: reward,
        improvement: parseFloat(improvement.toFixed(2)),
        previousAccuracy,
        newAccuracy,
        transactionHash: rewardRecord.transactionHash,
        type: contributionType,
        timestamp: rewardRecord.createdAt,
        userBalance: userBalance
      }
    });

  } catch (error) {
    console.error("❌ Reward calculation error:", error.message);
    res.status(500).json({
      success: false,
      message: "Reward calculation failed",
      error: error.message
    });
  }
});

// GET /api/reward/history - Get reward history
router.get("/history", optionalAuth, async (req, res) => {
  try {
    const rewards = await Reward.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('userId', 'name email')
      .populate('modelId', 'name');

    res.json({
      success: true,
      count: rewards.length,
      rewards
    });
  } catch (error) {
    res.json({
      success: true,
      count: 0,
      rewards: [],
      message: "Using fallback data"
    });
  }
});

// GET /api/reward/leaderboard - Get top contributors
router.get("/leaderboard", async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ totalRewards: -1 })
      .limit(10)
      .select('name email tokenBalance totalRewards modelsContributed');

    res.json({
      success: true,
      leaderboard: topUsers
    });
  } catch (error) {
    res.json({
      success: true,
      leaderboard: [
        { name: "Alice Chen", tokenBalance: 5420, totalRewards: 3200, modelsContributed: 12 },
        { name: "Bob Smith", tokenBalance: 4230, totalRewards: 2890, modelsContributed: 9 },
        { name: "Carol Davis", tokenBalance: 3850, totalRewards: 2100, modelsContributed: 7 }
      ]
    });
  }
});

// GET /api/reward/wallet/:address - Get wallet balance and transactions
router.get("/wallet/:address", async (req, res) => {
  try {
    const { address } = req.params;
    
    // Find or create user by wallet address
    let user = await User.findOne({ walletAddress: address.toLowerCase() });
    
    if (!user) {
      // Create new user for wallet
      user = await User.create({
        walletAddress: address.toLowerCase(),
        name: `Wallet ${address.slice(0, 6)}...${address.slice(-4)}`,
        email: `${address.toLowerCase()}@wallet.local`,
        tokenBalance: 0,
        totalRewards: 0,
        modelsContributed: 0
      });
    }

    // Get pending rewards (not claimed)
    const pendingRewards = await Reward.find({
      $or: [
        { userId: user._id, claimed: { $ne: true } },
        { walletAddress: address.toLowerCase(), claimed: { $ne: true } }
      ]
    }).sort({ createdAt: -1 });

    const pendingAmount = pendingRewards.reduce((sum, r) => sum + r.amount, 0);

    // Get all transactions for this wallet
    const transactions = await Reward.find({
      $or: [
        { userId: user._id },
        { walletAddress: address.toLowerCase() }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(50);

    res.json({
      success: true,
      wallet: {
        address: user.walletAddress,
        balance: user.tokenBalance || 0,
        pendingRewards: pendingAmount,
        lifetimeEarnings: user.totalRewards || 0,
        modelsContributed: user.modelsContributed || 0
      },
      transactions: transactions.map(tx => ({
        id: tx._id.toString(),
        type: tx.type === 'training' ? 'earn' : tx.type,
        description: tx.description || `Model Training - ${tx.type}`,
        amount: tx.amount > 0 ? `+${tx.amount} OAC` : `${tx.amount} OAC`,
        time: tx.createdAt.toISOString(),
        status: tx.claimed ? 'completed' : 'pending',
        transactionHash: tx.transactionHash
      }))
    });
  } catch (error) {
    console.error("❌ Wallet fetch error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch wallet data",
      error: error.message
    });
  }
});

// POST /api/reward/claim - Claim pending rewards (requires auth)
router.post("/claim", authMiddleware, async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: "Wallet address is required"
      });
    }

    // Find user by wallet address
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found"
      });
    }

    // Get all pending rewards
    const pendingRewards = await Reward.find({
      $or: [
        { userId: user._id, claimed: { $ne: true } },
        { walletAddress: walletAddress.toLowerCase(), claimed: { $ne: true } }
      ]
    });

    if (pendingRewards.length === 0) {
      return res.json({
        success: true,
        message: "No pending rewards to claim",
        claimed: 0,
        newBalance: user.tokenBalance || 0
      });
    }

    const totalAmount = pendingRewards.reduce((sum, r) => sum + r.amount, 0);

    // Update user balance
    user.tokenBalance = (user.tokenBalance || 0) + totalAmount;
    user.totalRewards = (user.totalRewards || 0) + totalAmount;
    await user.save();

    // Mark rewards as claimed
    await Reward.updateMany(
      { _id: { $in: pendingRewards.map(r => r._id) } },
      { $set: { claimed: true, claimedAt: new Date() } }
    );

    res.json({
      success: true,
      message: "Rewards claimed successfully",
      claimed: totalAmount,
      newBalance: user.tokenBalance,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`
    });
  } catch (error) {
    console.error("❌ Claim error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to claim rewards",
      error: error.message
    });
  }
});

// POST /api/reward/airdrop - Airdrop 500 OAC to new wallet
router.post("/airdrop", async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: "Wallet address is required"
      });
    }

    // Check if wallet already exists
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (user) {
      // Check if airdrop already claimed
      const existingAirdrop = await Reward.findOne({
        walletAddress: walletAddress.toLowerCase(),
        type: 'bonus',
        description: 'Welcome Airdrop - 500 OAC'
      });

      if (existingAirdrop) {
        return res.json({
          success: true,
          message: "Airdrop already claimed",
          claimed: false,
          balance: user.tokenBalance || 0
        });
      }
    } else {
      // Create new user
      user = await User.create({
        walletAddress: walletAddress.toLowerCase(),
        name: `Wallet ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        email: `${walletAddress.toLowerCase()}@wallet.local`,
        tokenBalance: 0,
        totalRewards: 0,
        modelsContributed: 0
      });
    }

    // Create airdrop reward
    const airdropReward = await Reward.create({
      userId: user._id,
      walletAddress: walletAddress.toLowerCase(),
      amount: 500,
      type: 'bonus',
      description: 'Welcome Airdrop - 500 OAC',
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      claimed: false
    });

    // Add to user balance immediately
    user.tokenBalance = (user.tokenBalance || 0) + 500;
    user.totalRewards = (user.totalRewards || 0) + 500;
    await user.save();

    res.json({
      success: true,
      message: "Airdrop successful! 500 OAC added to your wallet",
      amount: 500,
      newBalance: user.tokenBalance,
      transactionHash: airdropReward.transactionHash
    });
  } catch (error) {
    console.error("❌ Airdrop error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to process airdrop",
      error: error.message
    });
  }
});

// POST /api/wallet/connect - Register or connect wallet (first connect gives 500 OAC)
router.post("/connect", async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: "Wallet address is required"
      });
    }

    // Find or create user by wallet address
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    let isNewWallet = false;
    
    if (!user) {
      // Create new user for wallet
      isNewWallet = true;
      user = await User.create({
        walletAddress: walletAddress.toLowerCase(),
        name: `Wallet ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        email: `${walletAddress.toLowerCase()}@wallet.local`,
        tokenBalance: 500, // Give 500 OAC for testing
        totalRewards: 500,
        modelsContributed: 0
      });

      // Create welcome airdrop reward
      await Reward.create({
        userId: user._id,
        walletAddress: walletAddress.toLowerCase(),
        amount: 500,
        type: 'bonus',
        description: 'Welcome Airdrop - 500 OAC',
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        claimed: true // Already added to balance
      });

      console.log(`✅ New wallet registered: ${walletAddress} with 500 OAC`);
    }

    // Get wallet data
    const pendingRewards = await Reward.find({
      $or: [
        { userId: user._id, claimed: { $ne: true } },
        { walletAddress: walletAddress.toLowerCase(), claimed: { $ne: true } }
      ]
    }).sort({ createdAt: -1 });

    const pendingAmount = pendingRewards.reduce((sum, r) => sum + r.amount, 0);

    res.json({
      success: true,
      message: isNewWallet 
        ? "Wallet connected! Welcome bonus of 500 OAC added to your wallet."
        : "Wallet connected successfully",
      isNewWallet,
      wallet: {
        address: user.walletAddress,
        balance: user.tokenBalance || 0,
        pendingRewards: pendingAmount,
        lifetimeEarnings: user.totalRewards || 0,
        modelsContributed: user.modelsContributed || 0
      }
    });
  } catch (error) {
    console.error("❌ Wallet connect error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to connect wallet",
      error: error.message
    });
  }
});

export default router;
