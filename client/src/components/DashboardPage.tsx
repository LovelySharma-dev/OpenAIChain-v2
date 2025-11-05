import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Play, Square, TrendingUp, Users, Zap, Award, Loader2 } from "lucide-react";
import { getWalletData, WalletData } from "../api";

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  walletAddress?: string | null;
}

export function DashboardPage({ onNavigate, walletAddress }: DashboardPageProps) {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingRound, setTrainingRound] = useState(4);
  const [accuracy, setAccuracy] = useState(92.3);
  const [loss, setLoss] = useState(0.087);
  const [progress, setProgress] = useState(65);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionRewards, setSessionRewards] = useState(0);

  useEffect(() => {
    if (walletAddress) {
      loadWalletData();
    } else {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setTrainingRound(r => r + 1);
            setAccuracy(a => Math.min(99.9, a + Math.random() * 2));
            setLoss(l => Math.max(0.001, l - Math.random() * 0.01));
            // Update session rewards
            setSessionRewards(prev => prev + 50);
            return 0;
          }
          return prev + 1;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isTraining]);

  const loadWalletData = async () => {
    if (!walletAddress) return;
    
    setLoading(true);
    try {
      const data = await getWalletData(walletAddress);
      setWalletData(data.wallet);
      
      // Calculate session rewards from recent transactions
      const recentRewards = data.transactions
        .filter(tx => tx.type === 'earn' && tx.status === 'completed')
        .slice(0, 10)
        .reduce((sum, tx) => {
          const amount = parseInt(tx.amount.replace(/[^0-9]/g, '')) || 0;
          return sum + amount;
        }, 0);
      setSessionRewards(recentRewards);
    } catch (error) {
      console.error("Failed to load wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
            Training Dashboard
          </h1>
          <p className="text-gray-400">Monitor your federated learning contributions in real-time</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30 backdrop-blur-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-400/30">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                +2.1%
              </Badge>
            </div>
            <p className="text-sm text-gray-400 mb-1">Model Accuracy</p>
            <p className="text-3xl text-purple-100">{accuracy.toFixed(1)}%</p>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-500/30 backdrop-blur-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-400/30">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                -12%
              </Badge>
            </div>
            <p className="text-sm text-gray-400 mb-1">Training Loss</p>
            <p className="text-3xl text-blue-100">{loss.toFixed(3)}</p>
          </Card>

          <Card className="bg-gradient-to-br from-teal-900/20 to-teal-800/10 border-teal-500/30 backdrop-blur-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-teal-500/20 border border-teal-400/30">
                <Users className="h-6 w-6 text-teal-400" />
              </div>
              <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30">
                Live
              </Badge>
            </div>
            <p className="text-sm text-gray-400 mb-1">Active Contributors</p>
            <p className="text-3xl text-teal-100">847</p>
          </Card>
        </div>

        {/* Main Training Visualization */}
        <Card className="bg-gradient-to-br from-purple-900/10 to-blue-900/10 border-purple-500/30 backdrop-blur-sm p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Neural Network Visualization */}
            <div className="flex-1 relative min-h-[400px] flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Central Hub */}
                <div className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-pulse">
                  <div className="w-24 h-24 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <Zap className="h-12 w-12 text-purple-200" />
                  </div>
                </div>

                {/* Contributor Nodes */}
                {[...Array(8)].map((_, i) => {
                  const angle = (i / 8) * Math.PI * 2;
                  const radius = 150;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  
                  return (
                    <div
                      key={i}
                      className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center shadow-lg shadow-teal-500/30"
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                        animation: `pulse 2s ease-in-out infinite ${i * 0.25}s`,
                      }}
                    >
                      <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <Users className="h-6 w-6 text-teal-200" />
                      </div>
                    </div>
                  );
                })}

                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {[...Array(8)].map((_, i) => {
                    const angle = (i / 8) * Math.PI * 2;
                    const radius = 150;
                    const x = Math.cos(angle) * radius + 200;
                    const y = Math.sin(angle) * radius + 200;
                    
                    return (
                      <line
                        key={i}
                        x1="200"
                        y1="200"
                        x2={x}
                        y2={y}
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        opacity="0.3"
                      />
                    );
                  })}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Training Info */}
            <div className="lg:w-80 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-purple-100">Training Progress</h3>
                  <span className="text-sm text-gray-400">Round {trainingRound}</span>
                </div>
                <Progress value={progress} className="h-2 bg-purple-900/30" />
                <p className="text-sm text-gray-400 mt-2">
                  {isTraining ? `Processing batch ${progress}/100` : "Ready to start training"}
                </p>
              </div>

              {isTraining && (
                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/30 animate-pulse">
                  <p className="text-purple-200">
                    Training Round {trainingRound} - Accuracy +{((accuracy - 92.3) / 92.3 * 100).toFixed(1)}%
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => setIsTraining(!isTraining)}
                  className={
                    isTraining
                      ? "flex-1 bg-red-600 hover:bg-red-500 border-red-400/30"
                      : "flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border-purple-400/30"
                  }
                >
                  {isTraining ? (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      Stop Training
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Training
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Token Reward Summary */}
        <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/30 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-yellow-500/20 border border-yellow-400/30">
                <Award className="h-8 w-8 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Session Rewards</p>
                {loading ? (
                  <Loader2 className="h-6 w-6 text-yellow-400 animate-spin" />
                ) : (
                  <p className="text-3xl text-yellow-100">
                    +{sessionRewards || (trainingRound - 4) * 50 + 150} OAC
                  </p>
                )}
              </div>
              {walletData && (
                <div className="ml-4 pl-4 border-l border-yellow-500/30">
                  <p className="text-xs text-gray-400 mb-1">Total Balance</p>
                  <p className="text-xl text-yellow-200">{walletData.balance.toLocaleString()} OAC</p>
                </div>
              )}
            </div>
            <Button
              onClick={() => onNavigate("wallet")}
              variant="outline"
              className="border-yellow-400/50 hover:bg-yellow-500/10 text-yellow-200"
            >
              {walletAddress ? "View Wallet" : "Connect Wallet"}
            </Button>
          </div>
        </Card>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
