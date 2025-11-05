import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Wallet, Download, ArrowUpRight, ArrowDownLeft, TrendingUp, Loader2 } from "lucide-react";
import { getWalletData, claimRewards, requestAirdrop, Transaction, WalletData } from "../api";

interface WalletPageProps {
  onNavigate: (page: string) => void;
  walletAddress?: string | null;
}

export function WalletPage({ onNavigate, walletAddress }: WalletPageProps) {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [airdropping, setAirdropping] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      loadWalletData();
    } else {
      setLoading(false);
    }
  }, [walletAddress]);

  const loadWalletData = async () => {
    if (!walletAddress) return;
    
    setLoading(true);
    try {
      const data = await getWalletData(walletAddress);
      setWallet(data.wallet);
      setTransactions(data.transactions);
    } catch (error) {
      console.error("Failed to load wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!walletAddress) return;
    
    setClaiming(true);
    try {
      const result = await claimRewards(walletAddress);
      alert(`Successfully claimed ${result.claimed} OAC!`);
      await loadWalletData(); // Reload wallet data
    } catch (error) {
      console.error("Failed to claim rewards:", error);
      alert("Failed to claim rewards. Please try again.");
    } finally {
      setClaiming(false);
    }
  };

  const handleAirdrop = async () => {
    if (!walletAddress) return;
    
    setAirdropping(true);
    try {
      const result = await requestAirdrop(walletAddress);
      alert(`Airdrop successful! ${result.amount} OAC added to your wallet.`);
      await loadWalletData(); // Reload wallet data
    } catch (error: any) {
      if (error.message?.includes("already claimed")) {
        alert("Airdrop already claimed for this wallet.");
      } else {
        console.error("Failed to claim airdrop:", error);
        alert("Failed to claim airdrop. Please try again.");
      }
    } finally {
      setAirdropping(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return timestamp;
    }
  };

  const totalBalance = wallet?.balance || 0;
  const pendingRewards = wallet?.pendingRewards || 0;
  const lifetimeEarnings = wallet?.lifetimeEarnings || 0;

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
            Wallet
          </h1>
          <p className="text-gray-400">Manage your OpenAIChain tokens and transaction history</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Main Balance */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/30 backdrop-blur-xl p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-400/30">
                  <Wallet className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-sm text-gray-400">Total Balance</span>
              </div>
              <p className="text-4xl text-purple-100 mb-2">{totalBalance.toLocaleString()}</p>
              <p className="text-sm text-purple-300">OAC Tokens</p>
            </div>
          </Card>

          {/* Pending Rewards */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500/30 backdrop-blur-xl p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500 rounded-full blur-3xl opacity-20"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-yellow-500/20 border border-yellow-400/30">
                  <Download className="h-5 w-5 text-yellow-400" />
                </div>
                <span className="text-sm text-gray-400">Pending Rewards</span>
              </div>
              <p className="text-4xl text-yellow-100 mb-2">{pendingRewards.toLocaleString()}</p>
              <p className="text-sm text-yellow-300">Ready to claim</p>
            </div>
          </Card>

          {/* Lifetime Earnings */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-teal-900/30 to-green-900/30 border-teal-500/30 backdrop-blur-xl p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500 rounded-full blur-3xl opacity-20"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-teal-500/20 border border-teal-400/30">
                  <TrendingUp className="h-5 w-5 text-teal-400" />
                </div>
                <span className="text-sm text-gray-400">Lifetime Earnings</span>
              </div>
              <p className="text-4xl text-teal-100 mb-2">{lifetimeEarnings.toLocaleString()}</p>
              <p className="text-sm text-teal-300">All-time total</p>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {walletAddress ? (
            <>
              <Button
                onClick={handleClaim}
                disabled={claiming || pendingRewards === 0}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border border-purple-400/30 shadow-lg shadow-purple-500/20 py-6 disabled:opacity-50"
              >
                {claiming ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Claiming...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    Claim {pendingRewards} OAC Tokens
                  </>
                )}
              </Button>
              <Button
                onClick={handleAirdrop}
                disabled={airdropping}
                variant="outline"
                className="flex-1 border-purple-500/30 hover:bg-purple-500/10 backdrop-blur-sm py-6 disabled:opacity-50"
              >
                {airdropping ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Claim Welcome Airdrop (500 OAC)
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => onNavigate("marketplace")}
              variant="outline"
              className="flex-1 border-purple-500/30 hover:bg-purple-500/10 backdrop-blur-sm py-6"
            >
              <Wallet className="h-5 w-5 mr-2" />
              Connect MetaMask to view wallet
            </Button>
          )}
        </div>

        {/* Transaction History */}
        <Card className="bg-gradient-to-br from-purple-900/10 to-blue-900/10 border-purple-500/30 backdrop-blur-sm overflow-hidden">
          <div className="p-6 border-b border-purple-500/20">
            <h3 className="text-purple-100">Transaction History</h3>
            <p className="text-sm text-gray-400 mt-1">Your recent blockchain transactions</p>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
              </div>
            ) : transactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-purple-500/20 hover:bg-purple-500/5">
                    <TableHead className="text-purple-300">Type</TableHead>
                    <TableHead className="text-purple-300">Description</TableHead>
                    <TableHead className="text-purple-300">Amount</TableHead>
                    <TableHead className="text-purple-300">Time</TableHead>
                    <TableHead className="text-purple-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow
                      key={tx.id}
                      className="border-purple-500/10 hover:bg-purple-500/5 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {tx.type === "earn" ? (
                            <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30">
                              <ArrowDownLeft className="h-4 w-4 text-green-400" />
                            </div>
                          ) : (
                            <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                              <ArrowUpRight className="h-4 w-4 text-blue-400" />
                            </div>
                          )}
                          <span className="text-gray-300 capitalize">{tx.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{tx.description}</TableCell>
                      <TableCell>
                        <span
                          className={
                            tx.type === "earn"
                              ? "text-green-400"
                              : "text-blue-400"
                          }
                        >
                          {tx.amount}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-400 text-sm">{formatTimestamp(tx.time)}</TableCell>
                      <TableCell>
                        <Badge className={
                          tx.status === "completed"
                            ? "bg-green-500/20 text-green-300 border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                        }>
                          {tx.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>No transactions found. Connect your wallet and start training models to earn rewards!</p>
              </div>
            )}
          </div>
        </Card>

        {/* Wallet Info */}
        {walletAddress ? (
          <Card className="mt-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30 backdrop-blur-sm p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-400/30">
                <Wallet className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-blue-100 mb-1">Connected Wallet</h4>
                <p className="text-sm text-gray-400 mb-2 font-mono">{walletAddress}</p>
                <p className="text-xs text-gray-500">
                  Wallet connected via MetaMask. All transactions are tracked on-chain.
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="mt-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30 backdrop-blur-sm p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-400/30">
                <Wallet className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-blue-100 mb-1">No Wallet Connected</h4>
                <p className="text-sm text-gray-400 mb-2">
                  Connect your MetaMask wallet to view your balance and transactions
                </p>
                <p className="text-xs text-gray-500">
                  New wallets receive a welcome airdrop of 500 OAC tokens!
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
