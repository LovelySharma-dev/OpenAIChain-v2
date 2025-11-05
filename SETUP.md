# OpenAIChain Setup Guide

This guide explains how to run the OpenAIChain app locally with the new custom JWT authentication.

## Prerequisites
- Node.js 18+
- npm 9+
- MongoDB Atlas connection string (or local MongoDB)
- MetaMask (optional, for wallet features)

## 1) Backend Setup (server)
1. Install dependencies:
   ```bash
   cd server
   npm install
   ```
2. Create a `.env` file in `server/`:
   ```ini
   PORT=3000
   MONGO_URI=mongodb+srv://<your_cluster>
   JWT_SECRET=super_secret_key_here
   TOKEN_EXPIRES_IN=3d
   GOOGLE_CLIENT_ID=<your_google_oauth_client_id>
   ```
3. Start the backend:
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:3000`.

## 2) Frontend Setup (client)
1. Install dependencies:
   ```bash
   cd client
   npm install
   ```
2. Create `client/.env`:
   ```ini
   VITE_API_URL=http://localhost:3000
   VITE_GOOGLE_CLIENT_ID=<your_google_oauth_client_id>
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```

## 3) Authentication (JWT)
- Register via Sign Up form (email + password). The server returns a JWT, stored in `localStorage`.
- Login via Login form. The JWT is stored and attached automatically to requests as `Authorization: Bearer <token>`.
- Logout clears the JWT and returns you to the Auth page.

## 4) Protected Features
- Training `/api/train`, rewards `/api/reward`, and governance vote/propose now require a valid JWT.
- The wallet balance in the UI is shown only when authenticated and the wallet is connected.

## 5) Troubleshooting
- If login/signup fails, check browser DevTools → Network to see the exact error message.
- Ensure `VITE_API_URL` matches the backend URL.
- Ensure MongoDB URI and `JWT_SECRET` are set correctly in `server/.env`.


