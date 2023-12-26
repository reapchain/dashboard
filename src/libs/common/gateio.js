import axios from "axios";
import { gateioApi } from "/env/reapchain.config";

const axiosInstance = axios.create({
  baseURL: gateioApi,
  headers: {
    "X-Requested-With": "JSONHttpRequest",
    "Content-Type": "application/json",
  },
  responseType: "json",
  timeout: 5000,
});

export default axiosInstance;
