// client/src/api/auth.ts

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  tokenBalance: number;
  totalRewards: number;
  modelsContributed: number;
  role: string;
  walletAddress?: string;
};

export type AuthResponse = {
  success: boolean;
  token: string;
  user: AuthUser;
  message?: string;
};

function getToken(): string | null {
  try {
    return localStorage.getItem("authToken");
  } catch {
    return null;
  }
}

function setToken(token: string) {
  try {
    localStorage.setItem("authToken", token);
  } catch {}
}

export function logout() {
  try {
    localStorage.removeItem("authToken");
  } catch {}
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { headers, ...options });
  if (!res.ok) {
    let message = `API Error: ${res.status}`;
    try {
      const data = await res.json();
      message = data.message || data.error || message;
    } catch {}
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function register(email: string, password: string, username?: string): Promise<AuthResponse> {
  const body: any = { email, password };
  if (username) body.name = username;
  const data = await request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (data?.token) setToken(data.token);
  return data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (data?.token) setToken(data.token);
  return data;
}

export async function fetchProfile(): Promise<{ success: boolean; user: AuthUser }> {
  return request<{ success: boolean; user: AuthUser }>("/api/auth/profile", { method: "GET" });
}

export { getToken };


