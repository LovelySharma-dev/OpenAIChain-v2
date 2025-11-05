import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/openaichain",
      {
        serverSelectionTimeoutMS: 5000,
      }
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.log("⚠️  Backend will continue without database connection");
    return null;
  }
};

export default connectDB;
