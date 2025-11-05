// Simple test script to check HF API connectivity
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function testHFConnection() {
  try {
    const response = await axios.get("https://huggingface.co/api/models", {
      params: {
        limit: 1,
        sort: "downloads",
        direction: -1,
        filter: "text-generation"
      },
      headers: {
        'Authorization': `Bearer ${process.env.HF_API_KEY}`
      }
    });
    
    console.log("✅ HF API Connection successful!");
    console.log("First model:", response.data[0]?.id);
  } catch (error) {
    console.error("❌ HF API Error:", error.response?.data || error.message);
    console.log("HF_API_KEY present:", !!process.env.HF_API_KEY);
  }
}

testHFConnection();