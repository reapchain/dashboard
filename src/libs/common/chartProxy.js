import axios from "axios";
import { coinoneApi } from "@/chains/config/reapchain.config";

const axiosInstance = axios.create({
  baseURL: "https://wc5toelfc4.execute-api.ap-northeast-2.amazonaws.com",
  headers: {
    "X-Requested-With": "JSONHttpRequest",
    "Content-Type": "application/json",
  },
  responseType: "json",
  timeout: 5000,
});

export default axiosInstance;
