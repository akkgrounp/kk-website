import axios from "axios";

const envApiUrl = String(import.meta.env.VITE_API_URL || "").trim();
const isVercelHost = typeof window !== "undefined" && window.location.hostname.endsWith(".vercel.app");
const fallbackProdApiUrl = "https://manal-cv-estr.vercel.app";
const normalizeBaseUrl = (url) => url.replace(/\/+$/, "").replace(/\/api$/i, "");

const axiosInstance = axios.create({
  baseURL: normalizeBaseUrl(envApiUrl || (isVercelHost ? fallbackProdApiUrl : "http://localhost:5000")),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add bearer token on every request when available.
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
