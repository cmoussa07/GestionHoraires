import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem("token");
      // Ne redirige que si l'utilisateur était connecté
      if (token) {
        localStorage.removeItem("token");
        localStorage.removeItem("role_id");
        localStorage.removeItem("nom");
        localStorage.removeItem("email");
        localStorage.removeItem("enseignant_id");
        window.location.href = "/login";
      }
    } else if (error.response?.status === 403) {
      console.warn("Accès refusé:", error.response.data);
    }
    return Promise.reject(error);
  },
);

export default api;
