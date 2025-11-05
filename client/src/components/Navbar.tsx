import React from "react";
import { Wallet, Zap, Loader2, User } from "lucide-react";
import { Button } from "./ui/button";
import { useWallet } from "../hooks/useWallet";
import { AuthButton } from "./AuthButton";
import { useAuth } from "../hooks/useAuth";

interface NavbarProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export function Navbar({ 
  currentPage = "landing", 
  onNavigate
}: NavbarProps) {
  const { walletAddress, balance, isConnected, isLoading, connectWallet } = useWallet();
  const { isAuthenticated, user } = useAuth();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-purple-500/20 bg-black/40 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigate?.("landing")}
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <Zap className="relative h-8 w-8 text-purple-400" />
            </div>
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
              OpenAIChain
            </span>
          </button>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate?.("marketplace")}
              className={`transition-colors hover:text-purple-400 ${
                currentPage === "marketplace" ? "text-purple-400" : "text-gray-300"
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => onNavigate?.("dashboard")}
              className={`transition-colors hover:text-purple-400 ${
                currentPage === "dashboard" ? "text-purple-400" : "text-gray-300"
              }`}
            >
              Dashboard
            </button>
          </div>

          {/* Auth & Wallet */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-900/20 border border-purple-500/30">
                <User className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-purple-200">{user?.name || user?.email}</span>
              </div>
            )}
            
            {isAuthenticated && isConnected && walletAddress ? (
              <>
                <Button
                  onClick={() => onNavigate?.("wallet")}
                  className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border border-purple-400/30 shadow-lg shadow-purple-500/20"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  <span>{balance.toLocaleString()} OAC</span>
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-500/30 hover:bg-purple-500/10 text-purple-300 font-mono text-sm"
                  onClick={() => onNavigate?.("wallet")}
                >
                  {formatAddress(walletAddress)}
                </Button>
              </>
            ) : isAuthenticated ? (
              <Button
                onClick={connectWallet}
                disabled={isLoading}
                className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border border-purple-400/30 shadow-lg shadow-purple-500/20 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect MetaMask
                  </>
                )}
              </Button>
            ) : null}
            
            <AuthButton onNavigate={onNavigate} />
          </div>
        </div>
      </div>
    </nav>
  );
}

