import React, { createContext, useContext, useState, useEffect } from "react";
import type { User, AuthResponse } from "../types";
import { apiClient } from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        try {
          // Validate token with backend
          const isValid = await apiClient.validateToken();
          if (isValid) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem("user");
            localStorage.removeItem("token");
          }
        } catch (error) {
          // Token validation failed, clear storage
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      setIsLoading(true);
      setError(null);

      const response: AuthResponse = await apiClient.login({ email, password });

      console.log("Logged in user:", response.user);

      setUser(response.user);
      setToken(response.token);

      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.token);

      return response.user;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      console.error("AuthContext login error:", err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setToken(null);
      setError(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
