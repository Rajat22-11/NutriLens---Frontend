import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api, { setUnauthorizedHandler, tokenStore } from "../api/client";
import { clearGoalsCache } from "../utils/useGoals";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => tokenStore.get());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(tokenStore.get()));
  // true when the user signed out themselves (vs. an expired session)
  const [signedOut, setSignedOut] = useState(false);

  const logout = useCallback((manual = false) => {
    setSignedOut(manual === true);
    tokenStore.clear();
    clearGoalsCache();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, [logout]);

  const refreshProfile = useCallback(async () => {
    const { data } = await api.get("/api/user/profile");
    setUser(data);
    return data;
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    refreshProfile()
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [token, refreshProfile]);

  const handleAuth = useCallback((data) => {
    clearGoalsCache();
    setSignedOut(false);
    tokenStore.set(data.token);
    setUser(data.user);
    setToken(data.token);
    return data.user;
  }, []);

  const login = useCallback(
    async (email, password) => handleAuth((await api.post("/api/auth/login", { email, password })).data),
    [handleAuth]
  );

  const signup = useCallback(
    async (payload) => handleAuth((await api.post("/api/auth/signup", payload)).data),
    [handleAuth]
  );

  const value = useMemo(
    () => ({ token, user, setUser, loading, signedOut, isAuthenticated: Boolean(token), login, signup, logout, refreshProfile }),
    [token, user, loading, signedOut, login, signup, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
