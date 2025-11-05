import { useState, useEffect, useCallback } from "react";
import { connectWallet, getWalletData, WalletData } from "../api";

// Extend Window interface for MetaMask
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (accounts: string[]) => void) => void;
      removeListener: (event: string, handler: (accounts: string[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

interface UseWalletReturn {
  walletAddress: string | null;
  balance: number;
  walletData: WalletData | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshWallet: () => Promise<void>;
}

export function useWallet(): UseWalletReturn {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load wallet from localStorage on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setWalletAddress(savedAddress);
      loadWalletData(savedAddress);
    }
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum === "undefined") return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected wallet
        disconnectWallet();
      } else if (accounts[0] !== walletAddress) {
        // Account changed
        setWalletAddress(accounts[0]);
        localStorage.setItem("walletAddress", accounts[0]);
        loadWalletData(accounts[0]);
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, [walletAddress]);

  // Load wallet data from backend
  const loadWalletData = useCallback(async (address: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getWalletData(address);
      setWalletData(data.wallet);
      setBalance(data.wallet.balance);
    } catch (err) {
      console.error("Failed to load wallet data:", err);
      setError(err instanceof Error ? err.message : "Failed to load wallet data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Connect wallet
  const handleConnect = useCallback(async () => {
    if (typeof window.ethereum === "undefined") {
      setError("MetaMask is not installed. Please install MetaMask to connect your wallet.");
      alert("MetaMask is not installed. Please install MetaMask to connect your wallet.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const address = accounts[0];
      setWalletAddress(address);
      localStorage.setItem("walletAddress", address);

      // Register/connect wallet on backend
      try {
        await connectWallet(address);
      } catch (err) {
        console.log("Wallet connect error (may already be registered):", err);
      }

      // Load wallet data
      await loadWalletData(address);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to connect wallet";
      setError(errorMessage);
      console.error("Wallet connection error:", err);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [loadWalletData]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
    setBalance(0);
    setWalletData(null);
    localStorage.removeItem("walletAddress");
  }, []);

  // Refresh wallet data
  const refreshWallet = useCallback(async () => {
    if (walletAddress) {
      await loadWalletData(walletAddress);
    }
  }, [walletAddress, loadWalletData]);

  return {
    walletAddress,
    balance,
    walletData,
    isConnected: !!walletAddress,
    isLoading,
    error,
    connectWallet: handleConnect,
    disconnectWallet,
    refreshWallet,
  };
}

