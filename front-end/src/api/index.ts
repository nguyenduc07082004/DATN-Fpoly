import axios from "axios";
export const baseURL = "http://localhost:8000";

const ins = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
export default ins;
