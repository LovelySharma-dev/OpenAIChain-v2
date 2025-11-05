import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/connectDB.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import modelRoutes from "./routes/modelRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import rewardRoutes from "./routes/rewardRoutes.js";
import governanceRoutes from "./routes/governanceRoutes.js";

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    process.env.CLIENT_ORIGIN || "https://open-ai-chainkc.vercel.app",
    "https://open-ai-chainkc-g3g5rigwj-lovely-sharmas-projects-ccab510e.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Explicitly handle preflight for all routes using the same options
// Use a path pattern compatible with express/path-to-regexp
app.options("/*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enhanced debug logging middleware
app.use((req, res, next) => {
  console.log('\n🔍 Incoming Request:');
  console.log(`📍 ${req.method} ${req.url}`);
  console.log('👤 Headers:', {
    origin: req.headers.origin,
    authorization: req.headers.authorization ? 'Present' : 'Missing',
    'content-type': req.headers['content-type']
  });
  console.log('🌍 Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
    HF_API_KEY: process.env.HF_API_KEY ? 'Present' : 'Missing'
  });
  next();
});

// Connect to MongoDB
connectDB();

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "🚀 OpenAIChain Backend API",
    version: "1.0.0",
    endpoints: {
      models: "/api/models",
      train: "/api/train",
      reward: "/api/reward",
      governance: "/api/governance"
    },
    status: "running",
    features: [
      "AI Model Marketplace",
      "Federated Learning",
      "Token Rewards System",
      "DAO Governance"
    ]
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/models", modelRoutes);
app.use("/api", aiRoutes);
app.use("/api/reward", rewardRoutes);
app.use("/api/wallet", rewardRoutes); // Wallet routes also in rewardRoutes
app.use("/api/governance", governanceRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    availableRoutes: [
      "GET /api/models",
      "POST /api/train",
      "POST /api/reward",
      "GET /api/governance"
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;

// When deployed to Vercel as a serverless function, do NOT call `app.listen`.
// Vercel will import this module and use the exported handler directly.
if (!process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log("\n" + "=".repeat(50));
    console.log("🚀 OpenAIChain Backend Server Started");
    console.log("=".repeat(50));
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    console.log("\n📋 Available API Endpoints:");
    console.log("   GET  /api/models       - Fetch AI models from Hugging Face");
    console.log("   POST /api/train        - Train model with TensorFlow.js");
    console.log("   POST /api/reward       - Calculate token rewards");
    console.log("   GET  /api/governance   - Get DAO proposals");
    console.log("   POST /api/governance/vote - Vote on proposals");
    console.log("=".repeat(50) + "\n");
  });
}

// Export the Express app so Vercel's Node builder can use it as a serverless handler.
// The Express `app` is a valid request handler (function), so exporting it works
// with Vercel's expectations for a default export.
export default app;
