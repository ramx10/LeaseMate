import axios from "axios";

const API = axios.create({
  baseURL: "/api"  // Vite proxy routes this to http://backend:5000 in Docker
});

export default API;
