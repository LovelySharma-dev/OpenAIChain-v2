# OpenAIChain Requirements

## Runtime
- Node.js 18+
- npm 9+
- MongoDB (Atlas or local)

## Environment Variables
### server/.env
- PORT (default: 3000)
- MONGO_URI (MongoDB connection string)
- JWT_SECRET (secure random string)
- TOKEN_EXPIRES_IN (e.g., 3d)

### client/.env
- VITE_API_URL (e.g., http://localhost:3000)

## Dependencies
### Server
- express
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- dotenv

### Client
- react, react-dom
- vite
- typescript
- UI deps (Radix, lucide-react, etc.)

## Ports
- Backend: 3000
- Frontend: 5173 (default Vite)

## Notes
- JWT stored in localStorage; Authorization header auto-attached in API helpers.
- Wallet functionality requires MetaMask for best experience.


