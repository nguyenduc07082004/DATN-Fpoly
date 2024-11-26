import axios from "axios";
export const baseURL = "http://localhost:8000";

const ins = axios.create({
  baseURL: import.meta.env.VITE_API || baseURL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});
ins.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

export const getProtectedData = (token: string) =>
  ins.get("/protected", { headers: { Authorization: `Bearer ${token}` } });
export default ins;
