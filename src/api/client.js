import axios from "axios";

const DEFAULT_PROD_API = "https://nutrilens-api-v2.onrender.com";

export const API_URL = (
  import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000" : DEFAULT_PROD_API)
).replace(/\/+$/, "");

const TOKEN_KEY = "auth_token";

export const tokenStore = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (t) => {
    try {
      localStorage.setItem(TOKEN_KEY, t);
    } catch {
      /* storage unavailable */
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("user_id");
    } catch {
      /* storage unavailable */
    }
  },
};

const api = axios.create({ baseURL: API_URL, timeout: 120000 });

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = error.config?.url || "";
    if (error.response?.status === 401 && !url.includes("/api/auth/")) {
      tokenStore.clear();
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);

export function errorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (error?.response?.data) {
    const d = error.response.data;
    return d.message || d.error || fallback;
  }
  if (error?.code === "ECONNABORTED") return "The server took too long to respond. Please try again.";
  if (error?.request) return "Can't reach the NutriLens server. It may be waking up — try again in a few seconds.";
  return error?.message || fallback;
}

export const tzOffset = () => new Date().getTimezoneOffset();

export default api;
