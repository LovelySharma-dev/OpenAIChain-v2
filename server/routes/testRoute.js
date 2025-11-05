import express from 'express';
import { corsMiddleware } from '../middleware/cors.js';

const router = express.Router();

// Apply CORS middleware specifically for this route
router.use(corsMiddleware);

// Simple test endpoint
router.get('/test', (req, res) => {
  res.json({
    message: 'API is working',
    cors: 'enabled',
    timestamp: new Date().toISOString()
  });
});

export default router;