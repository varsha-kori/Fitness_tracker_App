import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://fitness-tracker-app-beta-nine.vercel.app/login",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;