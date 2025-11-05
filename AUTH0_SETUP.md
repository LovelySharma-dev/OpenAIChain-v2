# Auth0 Setup Guide

## Frontend (.env in client folder)

Add these environment variables:

```env
VITE_AUTH0_DOMAIN=dev-xxx.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id-here
VITE_AUTH0_AUDIENCE=https://api.openaichain.com
VITE_API_URL=http://localhost:3000
```

## Backend (.env in server folder)

Add these environment variables:

```env
AUTH0_DOMAIN=dev-xxx.us.auth0.com
AUTH0_AUDIENCE=https://api.openaichain.com
MONGODB_URI=mongodb://localhost:27017/openaichain
NODE_ENV=development
```

## Install Backend Dependencies

```bash
cd server
npm install express-jwt jwks-rsa
```

## Auth0 Configuration

1. Create an Auth0 account at https://auth0.com
2. Create a new Application (Single Page Application)
3. Configure:
   - Allowed Callback URLs: `http://localhost:5173`
   - Allowed Logout URLs: `http://localhost:5173`
   - Allowed Web Origins: `http://localhost:5173`
4. Create an API:
   - Identifier: `https://api.openaichain.com`
   - Signing Algorithm: RS256
5. Copy Domain and Client ID to frontend .env
6. Copy Domain and Audience to backend .env

## Features

- ✅ Auth0 login required for Marketplace, Dashboard, and Wallet pages
- ✅ JWT tokens automatically included in API requests
- ✅ Users linked by Auth0 ID with wallet addresses
- ✅ Protected backend routes verify Auth0 JWTs
- ✅ Development mode allows demo access if Auth0 not configured

