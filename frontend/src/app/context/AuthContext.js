"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, setTokens, clearTokens, getTokens } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    router.push("/login");
  }, [router]);

  const loadUser = useCallback(async () => {
    try {
      const { access } = getTokens();
      if (!access) {
        setLoading(false);
        return;
      }
      
      const userData = await api.get("/auth/me/");
      setUser(userData);
    } catch (err) {
      console.error("Failed to load user profile:", err.message);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      loadUser();
    }, 0);

    const handleGlobalLogout = () => {
      logout();
    };

    window.addEventListener("auth-logout", handleGlobalLogout);
    return () => {
      window.clearTimeout(loadTimer);
      window.removeEventListener("auth-logout", handleGlobalLogout);
    };
  }, [loadUser, logout]);

  const login = async (username, password) => {
    setError(null);
    setLoading(true);
    try {
      const data = await api.post("/auth/login/", { username, password });
      setTokens(data.access, data.refresh);
      
      // Load user profile
      const profile = await api.get("/auth/me/");
      setUser(profile);
      setLoading(false);
      router.push("/dashboard");
      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const register = async (username, email, password, confirmPassword) => {
    setError(null);
    setLoading(true);
    try {
      const data = await api.post("/auth/register/", {
        username,
        email,
        password,
        confirm_password: confirmPassword,
      });
      setTokens(data.access, data.refresh);

      // Load user profile
      const profile = await api.get("/auth/me/");
      setUser(profile);
      setLoading(false);
      router.push("/dashboard");
      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        setError,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
