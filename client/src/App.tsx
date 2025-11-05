import React, { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { LandingPage } from "./components/LandingPage";
import { MarketplacePage } from "./components/MarketplacePage";
import { DashboardPage } from "./components/DashboardPage";
import { WalletPage } from "./components/WalletPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useWallet } from "./hooks/useWallet";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("landing");
  const { walletAddress } = useWallet();

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onAuthSuccess = () => {
      setCurrentPage("dashboard");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener("auth:success", onAuthSuccess as EventListener);
    return () => {
      window.removeEventListener("auth:success", onAuthSuccess as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500 rounded-full blur-3xl opacity-5 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(168, 85, 247, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      ></div>

      <div className="relative z-10">
        {currentPage !== "landing" && (
          <Navbar
            currentPage={currentPage}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === "landing" && (
          <>
            <Navbar
              currentPage={currentPage}
              onNavigate={handleNavigate}
            />
            <LandingPage onNavigate={handleNavigate} />
          </>
        )}

        {currentPage === "marketplace" && (
          <ProtectedRoute>
            <MarketplacePage onNavigate={handleNavigate} walletAddress={walletAddress} />
          </ProtectedRoute>
        )}

        {currentPage === "dashboard" && (
          <ProtectedRoute>
            <DashboardPage onNavigate={handleNavigate} walletAddress={walletAddress} />
          </ProtectedRoute>
        )}

        {currentPage === "wallet" && (
          <ProtectedRoute>
            <WalletPage onNavigate={handleNavigate} walletAddress={walletAddress} />
          </ProtectedRoute>
        )}
      </div>
    </div>
  );
}
