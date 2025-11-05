import React from "react";
import { Button } from "./ui/button";
import { LogIn, LogOut, User, Coins } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface AuthButtonProps {
  onNavigate?: (page: string) => void;
}

export function AuthButton({ onNavigate }: AuthButtonProps) {
  const { isAuthenticated, user, logout } = useAuth();

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-900/20 border border-purple-500/30">
          <User className="h-4 w-4 text-purple-400" />
          <div className="flex flex-col">
            <span className="text-sm text-purple-200 font-medium">{user.name || user.email}</span>
            <div className="flex items-center gap-1 text-xs text-yellow-400">
              <Coins className="h-3 w-3" />
              <span>{user.tokenBalance.toLocaleString()} OAC</span>
            </div>
          </div>
        </div>
        <Button
          onClick={logout}
          variant="outline"
          className="border-purple-500/30 hover:bg-purple-500/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => logout()}
      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border border-purple-400/30 shadow-lg shadow-purple-500/20"
    >
      <LogIn className="h-4 w-4 mr-2" />
      Continue as Guest
    </Button>
  );
}

