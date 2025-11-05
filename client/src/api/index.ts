// client/src/api/index.ts

// 🔗 Base URL for backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// 📝 TypeScript Interfaces
export interface NodeResult {
  nodeId: number;
  accuracy: number;
  loss: number;
  epochs: number;
  status: string;
  timestamp?: string;
}

export interface TrainingData {
  federatedAccuracy?: number;
  federatedLoss?: number;
  accuracy?: number;
  loss?: number;
  epochs?: number;
  status: string;
  timestamp?: string;
  nodes?: NodeResult[];
}

export interface TrainingResponse {
  success: boolean;
  message: string;
  data: TrainingData;
  modelName: string;
  federated?: boolean;
}

export interface Model {
  id: string;
  name: string;
  author: string;
  description: string;
  type: string;
  downloads?: number;
  likes?: number;
  tags?: string[];
  accuracy: number | string;
  huggingFaceUrl?: string;
  lastUpdated?: string;
}

export interface ModelsResponse {
  success: boolean;
  count: number;
  models: Model[];
}

// 🔐 Auth Interfaces
export interface User {
  id: string;
  email: string;
  name?: string;
  tokenBalance: number;
  totalRewards: number;
  modelsContributed: number;
  role: string;
  walletAddress?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

// 🧠 Generic API call helper with error handling and CORS support
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  try {
    const url = `${API_URL}${endpoint}`;
    const headers: HeadersInit = { 
      "Content-Type": "application/json",
    };
    
    // Add JWT token if available; fallback to localStorage
    const effectiveToken = token ?? (typeof localStorage !== 'undefined' ? localStorage.getItem("authToken") : null);
    if (effectiveToken) {
      headers["Authorization"] = `Bearer ${effectiveToken}`;
    }
    
    const res = await fetch(url, {
      headers,
      ...options,
    });

    if (!res.ok) {
      let errorMessage = `API Error: ${res.status}`;
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const errorText = await res.text();
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return res.json() as Promise<T>;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to ${API_URL}. Make sure the backend is running.`);
    }
    throw error;
  }
}

// 💡 Specific API calls
export const fetchModels = (): Promise<ModelsResponse> => 
  apiRequest<ModelsResponse>("/api/models");

// 🔐 Auth API calls
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  return apiRequest<AuthResponse>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }
  );
};

export const signupUser = async (email: string, password: string, name?: string): Promise<AuthResponse> => {
  return apiRequest<AuthResponse>(
    "/api/auth/signup",
    {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    }
  );
};

export const getCurrentUser = async (token: string): Promise<{ success: boolean; user: User }> => {
  return apiRequest<{ success: boolean; user: User }>(
    "/api/auth/me",
    {
      method: "GET",
    },
    token
  );
};

export const trainModel = (
  data: { modelName: string; epochs: number; walletAddress?: string },
  token?: string
): Promise<TrainingResponse & { rewardAmount?: number }> => {
  return apiRequest<TrainingResponse & { rewardAmount?: number }>(
    "/api/train",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    token || null
  );
};

export const calculateReward = (
  data: { previousAccuracy: number; newAccuracy: number },
  token?: string
) =>
  apiRequest("/api/reward", {
    method: "POST",
    body: JSON.stringify(data),
  }, token || null);

export const fetchGovernance = () => apiRequest("/api/governance");

// Wallet & Token APIs
export interface WalletData {
  address: string;
  balance: number;
  pendingRewards: number;
  lifetimeEarnings: number;
  modelsContributed: number;
}

export interface Transaction {
  id: string;
  type: string;
  description: string;
  amount: string;
  time: string;
  status: string;
  transactionHash?: string;
}

export interface WalletResponse {
  success: boolean;
  wallet: WalletData;
  transactions: Transaction[];
}

export const getWalletData = (address: string): Promise<WalletResponse> =>
  apiRequest<WalletResponse>(`/api/reward/wallet/${address}`);

export const claimRewards = (walletAddress: string) =>
  apiRequest<{ success: boolean; message: string; claimed: number; newBalance: number; transactionHash?: string }>("/api/reward/claim", {
    method: "POST",
    body: JSON.stringify({ walletAddress }),
  });

export const requestAirdrop = (walletAddress: string) =>
  apiRequest<{ success: boolean; message: string; amount: number; newBalance: number; transactionHash?: string; claimed?: boolean }>("/api/reward/airdrop", {
    method: "POST",
    body: JSON.stringify({ walletAddress }),
  });

// Connect/register wallet
export const connectWallet = (walletAddress: string) =>
  apiRequest<{ success: boolean; message: string; wallet: WalletData }>("/api/wallet/connect", {
    method: "POST",
    body: JSON.stringify({ walletAddress }),
  });
