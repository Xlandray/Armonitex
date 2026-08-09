import axios from "axios";

export const apiBaseUrl =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000/api/v1";

export const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10_000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});
