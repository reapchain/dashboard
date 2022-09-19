import axios from "axios";
import { coingeckoApi } from "@/chains/config/reapchain.config";

const axiosInstance = axios.create({
  baseURL: coingeckoApi,
  headers: {
    "X-Requested-With": "JSONHttpRequest",
    "Content-Type": "application/json",
  },
  responseType: "json",
  timeout: 5000,
});

export default axiosInstance;
