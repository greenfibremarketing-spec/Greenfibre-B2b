"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getStoredToken,
  getStoredUser,
  setAuthSession,
  clearAuthSession,
  loginB2B,
  registerB2B,
  sendOtp as sendOtpApi,
  verifyOtp as verifyOtpApi,
  resetPassword as resetPasswordApi,
  fetchB2BProfile,
  refreshB2BToken
} from "@/lib/auth";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from stored session and verify with backend
  useEffect(() => {
    async function initAuth() {
      const storedToken = getStoredToken();
      const storedUser = getStoredUser();

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          setUser(storedUser);
        }
        try {
          const freshUser = await fetchB2BProfile(storedToken);
          if (freshUser) {
            setUser(freshUser);
          }
        } catch (err) {
          console.warn("[Auth] Initial profile verification failed:", err);
        }
      }
      setIsLoading(false);
    }

    initAuth();
  }, []);

  // Periodic token refresh every 12 hours
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(async () => {
      try {
        const renewedToken = await refreshB2BToken(token);
        if (renewedToken) {
          setToken(renewedToken);
        }
      } catch (err) {
        console.warn("[Auth] Background token refresh error:", err);
      }
    }, 12 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token]);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      const result = await loginB2B(credentials);
      setToken(result.token);
      setUser(result.user);
      setIsLoading(false);
      return result;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  }, []);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      const result = await registerB2B(userData);
      setToken(result.token);
      setUser(result.user);
      setIsLoading(false);
      return result;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  }, []);

  const sendOtp = useCallback(async (params) => {
    return await sendOtpApi(params);
  }, []);

  const verifyOtp = useCallback(async (params) => {
    return await verifyOtpApi(params);
  }, []);

  const resetPassword = useCallback(async (params) => {
    return await resetPasswordApi(params);
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/signup";
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) return null;
    const freshUser = await fetchB2BProfile(token);
    if (freshUser) {
      setUser(freshUser);
    }
    return freshUser;
  }, [token]);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isB2BVerified: Boolean(user?.isB2BVerified),
    isLoading,
    login,
    register,
    sendOtp,
    verifyOtp,
    resetPassword,
    logout,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
