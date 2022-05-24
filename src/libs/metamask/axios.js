import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `http://192.168.100.44:1317`,
  // baseURL: `http://13.124.60.235:1317`,
  headers: { "Content-Type": "application/json" },
  responseType: "json",
  timeout: 5000,
});

export default axiosInstance;
