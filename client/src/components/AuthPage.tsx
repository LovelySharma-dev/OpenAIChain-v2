import React from "react";
import { Button } from "./ui/button";
import { useAuth } from "../hooks/useAuth";

// Simplified auth page for hackathon: auth is disabled and users continue as guest.
export function AuthPage() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-950/20 to-black p-6">
      <div className="w-full max-w-md p-8 bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-2xl backdrop-blur-sm text-center">
        <h2 className="text-2xl font-bold text-purple-100 mb-2">Demo Ready — Guest Mode</h2>
        <p className="text-gray-400 mb-6">Authentication is disabled for the hackathon demo. Click below to continue as a guest and train models immediately.</p>

        <Button onClick={() => logout()} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border border-purple-400/30 shadow-lg shadow-purple-500/20">
          Continue as Guest
        </Button>

        <div className="mt-4 text-sm text-gray-400">
          <p>Need a token for demoing user-specific features? Use the dev-fallback:</p>
          <code className="block mt-2 p-2 bg-gray-900 rounded">POST /api/auth/google {'{ "email": "you@example.com", "name": "Demo" }'}</code>
        </div>
      </div>
    </div>
  );
}


