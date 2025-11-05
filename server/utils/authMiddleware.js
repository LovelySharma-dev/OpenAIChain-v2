import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret_jwt_key_change_in_production";

// Required authentication middleware
export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required. Please log in." 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user in database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Attach user to request
    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      userId: user._id
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token" 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: "Token expired. Please log in again." 
      });
    }
    console.error("Auth middleware error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Authentication error",
      error: error.message 
    });
  }
};

// Optional authentication middleware (for routes that work with or without auth)
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (user) {
          req.user = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            userId: user._id
          };
        }
      } catch (tokenError) {
        // Token invalid, but continue without user
        console.log("Optional auth: token invalid, continuing without auth");
      }
    }
  } catch (error) {
    // Continue without auth
    console.log("Optional auth error:", error);
  }
  
  next();
};
