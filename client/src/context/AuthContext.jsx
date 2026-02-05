import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authTokenKey } from "../api/http";
import { getMe, loginUser, logoutUser, registerUser } from "../api/chatApi";

const AuthContext = createContext(null);

const normalizeUser = (payload) => {
  if (!payload) return null;
  if (payload.user) return payload.user;
  return payload;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(authTokenKey));
  const [loading, setLoading] = useState(true);

  const setStoredToken = (value) => {
    if (value) {
      localStorage.setItem(authTokenKey, value);
      setToken(value);
      return;
    }
    localStorage.removeItem(authTokenKey);
    setToken(null);
  };

  const hydrate = async () => {
    try {
      const data = await getMe();
      setUser(normalizeUser(data));
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    hydrate();
  }, []);

  const login = async (payload) => {
    const data = await loginUser(payload);
    if (data?.token) {
      setStoredToken(data.token);
    }
    setUser(normalizeUser(data));
    return data;
  };

  const register = async (payload) => {
    const data = await registerUser(payload);
    if (data?.token) {
      setStoredToken(data.token);
    }
    setUser(normalizeUser(data));
    return data;
  };

  const logout = async () => {
    await logoutUser();
    setStoredToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
