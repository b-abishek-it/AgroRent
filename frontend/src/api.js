import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://agrorent-backend-ntr8.onrender.com/api";
export const FILE_BASE = import.meta.env.VITE_FILE_BASE_URL || "https://agrorent-backend-ntr8.onrender.com/";

export const getMachineImageUrl = (image) => {
  if (!image) return "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600";
  return image.startsWith("http://") || image.startsWith("https://") ? image : `${FILE_BASE}${image}`;
};

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
