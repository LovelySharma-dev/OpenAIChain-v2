// CORS middleware
export const corsMiddleware = (req, res, next) => {
  // Allow requests from your frontend domain
  res.header('Access-Control-Allow-Origin', 'https://open-ai-chainkc.vercel.app');
  
  // Allow specified methods
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // Allow specified headers
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Allow credentials
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
};