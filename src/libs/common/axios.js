import axios from "axios";
import { chainInfo } from "/env/reapchain.config";

const axiosInstance = axios.create({
  baseURL: chainInfo.restEndpoint,
  headers: { "Content-Type": "application/json" },
  responseType: "json",
  timeout: 5000,
});

export default axiosInstance;
