import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
export const FILE_BASE = import.meta.env.VITE_FILE_BASE_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const locations = ["Thanjavur", "Kumbakonam", "Thiruvaiyaru", "Orathanadu", "Pattukottai"];
export const machineTypes = ["Tractor", "Harvester", "Sprayer", "Seeder", "Rotavator"];
