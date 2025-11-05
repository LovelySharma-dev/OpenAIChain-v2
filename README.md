# OpenAIChain — Hackathon Setup

Overview
- Demo-ready guest-mode auth. Training and rewards work without sign-in.
- Backend: Node/Express + MongoDB. Frontend: Vite + React + TypeScript.

Requirements
- Node.js >= 18 (you have v22)
- npm
- MongoDB Atlas URI
- (optional) HF_API_KEY, GOOGLE_CLIENT_ID for production

Quick local setup (Windows PowerShell)
```powershell
# backend
cd server
cp .env.example .env
# edit server/.env with your values
npm install
npm run dev

# frontend
cd ../client
cp .env.example .env
# edit client/.env with VITE_API_URL=http://localhost:3000
npm install
npm run dev
```

Run dev
- Backend: nodemon index.js (npm run dev)
- Frontend: Vite (npm run dev) → http://localhost:5173

Build & single-server serve (optional)
```powershell
# build frontend then serve from backend
cd client
npm run build
# copy build to server/build or configure server to serve client/dist
cd ../server
npm start
```

Deploy (recommended fast path)
- Push repo to GitHub.
- Frontend: Deploy to Vercel — set build cmd `npm run build`, output `dist`, set env var VITE_API_URL to your backend URL.
- Backend: Deploy to Render/Heroku — set start command `npm start` and add server env vars (MONGO_URI, JWT_SECRET, HF_API_KEY, CLIENT_ORIGIN=<frontend url>).

Environment variables (example)
- server/.env (do not commit)
```
# filepath: c:\Users\PC\Desktop\OpenAIChain\server\.env.example
PORT=3000
MONGO_URI=<your_mongo_atlas_uri>
JWT_SECRET=<strong-secret>
HF_API_KEY=<huggingface-key>
GOOGLE_CLIENT_ID=<google-client-id> # optional
CLIENT_ORIGIN=http://localhost:5173
```

- client/.env
```
# filepath: c:\Users\PC\Desktop\OpenAIChain\client\.env.example
VITE_API_URL=http://localhost:3000
```

Notes
- Keep guest-mode for hackathon to avoid dealing with OAuth, Supabase, and keys.
- If you must demo user-specific features, use the dev fallback POST /api/auth/google { email, name } to get a JWT.
- Make sure CORS on backend allows CLIENT_ORIGIN and Authorization header.

Demo notes
- The app runs in guest-mode by default for the hackathon: no login is required. Click "Continue as Guest" in the header or on the auth page to start training models instantly.
- To simulate an authenticated user (dev only), run:

```bash
curl -X POST http://localhost:3000/api/auth/google -H "Content-Type: application/json" -d '{"email":"demo@example.com","name":"Demo"}'
```

This returns a backend JWT you can pass in the Authorization header for testing user-specific flows.

Deployment (fast path)
- Frontend: Deploy the `client` folder to Vercel (build command: `npm run build`, output dir: `dist`). Set `VITE_API_URL` in Vercel env to your backend URL.
- Backend: Deploy the `server` folder to Render or Heroku. Set environment variables from `server/.env.example`.

Single-app deploy (optional)
- You can build the frontend and serve it from the backend in production by copying the `client/dist` (or `client/build`) folder into `server/public` and adding a static serve in `server/index.js` (see README in repo).



# OpenAIChain-v2
