import axios from "axios";
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "https://jobnova-portal-api-gateway.onrender.com/api" });
api.interceptors.request.use(config => {
  const token = localStorage.getItem("jobnova_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
