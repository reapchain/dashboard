import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_BASEURL || "/",
  headers: { "Content-Type": "application/json" },
  responseType: "json",
  timeout: 5000,
});

export default axiosInstance;
