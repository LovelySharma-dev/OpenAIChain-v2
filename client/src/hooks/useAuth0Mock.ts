import { useState, useEffect, createContext, useContext } from "react";

// Mock Auth0 context for development
const Auth0Context = createContext<any>(null);

export function useAuth0Mock() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    // Check localStorage for demo auth
    const demoAuth = localStorage.getItem("demoAuth");
    if (demoAuth === "true") {
      setIsAuthenticated(true);
      setUser({ 
        email: "demo@openaichain.com", 
        name: "Demo User",
        sub: "auth0|demo"
      });
    }
  }, []);

  const loginWithRedirect = async () => {
    setIsLoading(true);
    try {
      // Simulate login
      await new Promise(resolve => setTimeout(resolve, 500));
      localStorage.setItem("demoAuth", "true");
      setIsAuthenticated(true);
      setUser({ 
        email: "demo@openaichain.com", 
        name: "Demo User",
        sub: "auth0|demo"
      });
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (options?: { logoutParams?: { returnTo?: string } }) => {
    localStorage.removeItem("demoAuth");
    setIsAuthenticated(false);
    setUser(null);
    if (options?.logoutParams?.returnTo) {
      window.location.href = options.logoutParams.returnTo;
    }
  };

  const getAccessTokenSilently = async () => {
    return "demo-token";
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    error,
  };
}

