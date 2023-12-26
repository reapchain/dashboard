import axios from "axios";
import { coinoneApi } from "/env/reapchain.config";

const axiosInstance = axios.create({
  baseURL: coinoneApi,
  headers: {
    "X-Requested-With": "JSONHttpRequest",
    "Content-Type": "application/json",
  },
  responseType: "json",
  timeout: 5000,
});

export default axiosInstance;
