import React, { createContext, useContext, useState } from "react";

// Minimal no-auth provider: always expose a guest user so UI works without login.
type AuthUser = {
  id: string;
  email: string | null;
  name: string;
  tokenBalance: number;
  totalRewards?: number;
  modelsContributed?: number;
  role?: string;
  walletAddress?: string | null;
};

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const GUEST_USER: AuthUser = {
  id: "guest",
  email: null,
  name: "Guest",
  tokenBalance: 0,
  totalRewards: 0,
  modelsContributed: 0,
  role: "guest",
  walletAddress: null,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: GUEST_USER,
    token: null,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  });

  const login = async (email: string, password: string) => {
    // Auth disabled: act as guest
    setAuthState((prev) => ({ ...prev, isAuthenticated: true, isLoading: false, error: null }));
    return { success: true };
  };

  const signup = async (email: string, password: string, name?: string) => {
    // Auth disabled: act as guest
    setAuthState((prev) => ({ ...prev, isAuthenticated: true, isLoading: false, error: null }));
    return { success: true };
  };

  const loginWithGoogle = async () => {
    // No-op: keep guest
    return;
  };

  const logout = () => {
    // Keep user as guest
    setAuthState({ user: GUEST_USER, token: null, isAuthenticated: true, isLoading: false, error: null });
  };

  const refreshUser = async () => {
    // No-op
    return;
  };

  const value: AuthContextValue = {
    ...authState,
    login,
    signup,
    loginWithGoogle,
    logout,
    refreshUser,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

