import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

// NOTE: This file provides a minimal Google OAuth token exchange.
// - POST /google { idToken }  -> verifies Google ID token and returns backend JWT + user
// - GET  /me                  -> protected; returns current user based on Authorization: Bearer <token>

// Helper: build user response shape (no password)
function buildUserResponse(user) {
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    tokenBalance: user.tokenBalance,
    totalRewards: user.totalRewards,
    modelsContributed: user.modelsContributed,
    role: user.role,
    walletAddress: user.walletAddress,
  };
}

// Guest response helper (no DB access)
function buildGuestResponse() {
  return {
    id: "guest",
    email: null,
    name: "Guest",
    tokenBalance: 0,
    totalRewards: 0,
    modelsContributed: 0,
    role: "guest",
    walletAddress: null,
  };
}

// --- Removed username/password signup/login to keep auth minimal (Google OAuth only) ---

// (Register/signup removed - auth disabled mode)

// --- Password login removed to keep flow simple. Use Google OAuth on the client. ---

// Get current user profile (protected route)
router.get("/me", async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized" 
      });
    }
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (verifyErr) {
      console.log("[auth] token verify failed:", verifyErr.message);
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Return user data (without password)
    const userData = {
      id: user._id,
      email: user.email,
      name: user.name,
      tokenBalance: user.tokenBalance,
      totalRewards: user.totalRewards,
      modelsContributed: user.modelsContributed,
      role: user.role,
      walletAddress: user.walletAddress
    };

    res.json({ 
      success: true, 
      user: userData 
    });
  } catch (err) {
    console.error("Get user error:", err?.message || err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
});

// /profile -> same as /me
router.get("/profile", async (req, res) => {
  return router.handle(req, res);
});

// Supabase integration removed to keep auth minimal.

// Google ID token exchange -> issue backend JWT
router.post("/google", async (req, res) => {
  try {
    // Development fallback: accept email/name in body if GOOGLE_CLIENT_ID not provided
    const { idToken, email: devEmail, name: devName } = req.body || {};

    let email;
    let profileName;

    if (googleClient && idToken) {
      console.log("[auth] verifying Google idToken...");
      const ticket = await googleClient.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
      const payload = ticket.getPayload();
      email = payload?.email;
      profileName = payload?.name;
    } else if (process.env.NODE_ENV !== "production" && devEmail) {
      // Very small dev helper: allow posting { email, name } when not in production
      console.log("[auth] DEV fallback login used for:", devEmail);
      email = devEmail;
      profileName = devName;
    } else {
      return res.status(400).json({ success: false, message: "Google auth not configured or missing idToken" });
    }

    if (!email) return res.status(401).json({ success: false, message: "Invalid Google token or missing email" });

    let user = await User.findOne({ email });
    if (!user) {
      console.log("[auth] creating new user for:", email);
      user = await User.create({ email, name: profileName || email.split("@")[0], tokenBalance: 1000 });
    }

    const backendToken = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token: backendToken, user: buildUserResponse(user) });
  } catch (err) {
    console.error("Google exchange error:", err?.message || err);
    res.status(401).json({ success: false, message: err?.message || "Invalid Google token" });
  }
});

export default router;

